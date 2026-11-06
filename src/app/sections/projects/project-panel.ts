import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { prefersReducedMotion, refreshSettled } from '../../core/motion/motion';
import { decodeInto, scramble } from '../../core/text/scramble';
import { formatMetric, parseMetric } from '../../core/text/metric';
import { COPY } from '../../data/copy';
import { Project } from '../../data/projects';
import { ApiConsole } from './api-console';
import { SitePreview } from './site-preview';

type Phase = 'idle' | 'opening' | 'ready';

const READY_AT = 850;
const COUNT_MS = 900;
const COLLAPSE_MS = 700;

@Component({
  selector: 'app-project-panel',
  imports: [ApiConsole, SitePreview],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.open]': 'open()', '[class.ready]': 'ready()' },
  templateUrl: './project-panel.html',
  styleUrl: './project-panel.scss',
})
export class ProjectPanel {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  readonly project = input.required<Project>();
  readonly open = input(false);
  protected readonly ready = signal(false);

  protected readonly api = computed(() => {
    const p = this.project();
    return p.kind === 'api' ? p : null;
  });
  protected readonly site = computed(() => {
    const p = this.project();
    return p.kind === 'site' ? p : null;
  });
  protected readonly beats = computed(() => {
    const s = this.project().story;
    return [
      { k: COPY.challenge, text: s.challenge },
      { k: COPY.whatIDid, text: s.whatIDid },
      { k: COPY.result, text: s.result },
    ];
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly boot = viewChild<ElementRef<HTMLElement>>('boot');
  private readonly big = viewChild<ElementRef<HTMLElement>>('big');
  private readonly metricEls = viewChildren<ElementRef<HTMLElement>>('metric');
  private readonly apiConsole = viewChild(ApiConsole);
  private readonly sitePreview = viewChild(SitePreview);

  private phase: Phase = 'idle';
  private token = 0;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private raf = 0;

  constructor() {
    effect(() => {
      const open = this.open();
      untracked(() => (open ? this.start() : this.stop()));
    });

    // A language switch while open must show final texts in the new language, never a half-decoded line.
    effect(() => {
      this.lang.lang();
      untracked(() => {
        const el = this.boot()?.nativeElement;
        const text = this.bootText(this.phase);
        if (el && text !== null) decodeInto(el, text, 0);
      });
    });

    inject(DestroyRef).onDestroy(() => this.cancel());
  }

  private bootText(phase: Phase): string | null {
    const p = this.project();
    const t = (v: (typeof COPY)[keyof typeof COPY]) => this.lang.t(v);
    if (phase === 'opening') return `> ${t(COPY.opening)} ${p.slug} …`;
    if (phase === 'ready') {
      return p.kind === 'site' ? `> ${t(COPY.connected)} · ${p.url}` : `> ${t(COPY.ready)} · ${p.method} ${p.path}`;
    }
    return null;
  }

  private later(ms: number, fn: () => void): void {
    const mine = this.token;
    this.timers.push(setTimeout(() => mine === this.token && fn(), ms));
  }

  private cancel(): void {
    this.token++;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    cancelAnimationFrame(this.raf);
  }

  private start(): void {
    this.cancel();
    const reduced = prefersReducedMotion();
    const p = this.project();
    const boot = this.boot()?.nativeElement;
    this.phase = 'opening';
    if (boot) decodeInto(boot, this.bootText('opening')!, 500, { reducedMotion: reduced });

    this.resetMetrics();
    this.later(COLLAPSE_MS, () => void this.landRow(reduced));

    this.later(READY_AT, () => {
      this.phase = 'ready';
      this.ready.set(true);
      if (boot) decodeInto(boot, this.bootText('ready')!, 400, { reducedMotion: reduced });
      const big = this.big()?.nativeElement;
      if (big) decodeInto(big, p.fullTitle, 700, { reducedMotion: reduced });
      this.later(550, () => this.countMetrics(reduced));
      this.later(700, () => {
        if (p.kind === 'api') void this.apiConsole()?.send();
        else void this.sitePreview()?.runFlow();
      });
    });
  }

  /**
   * Scrolls the row's header under the nav once the layout has settled: the rows
   * collapsing/expanding must have finished (a stale target otherwise), and the
   * ScrollTrigger refresh their transitionend queues must have run, because a refresh
   * with pins on the page resets the scroll position and aborts a smooth scroll.
   */
  private async landRow(reduced: boolean): Promise<void> {
    const mine = this.token;
    const row = this.host.closest('.row');
    const list = row?.parentElement;
    if (!row || !list) return;
    const resizing = (list.getAnimations?.({ subtree: true }) ?? []).filter(
      (a) => (a as CSSTransition).transitionProperty === 'grid-template-rows',
    );
    await Promise.all(resizing.map((a) => a.finished.catch(() => undefined)));
    await new Promise((r) => requestAnimationFrame(r)); // transitionend handlers queue their refresh
    await refreshSettled();
    if (mine !== this.token) return;
    row.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  private stop(): void {
    this.cancel();
    this.phase = 'idle';
    this.ready.set(false);
    const boot = this.boot()?.nativeElement;
    if (boot) decodeInto(boot, '', 0);
    this.apiConsole()?.reset();
    this.sitePreview()?.reset();
    this.resetMetrics();
  }

  /** Start values, so the count never flashes the final figure first. */
  private resetMetrics(): void {
    const els = this.metricEls().map((r) => r.nativeElement);
    this.project().metrics.forEach((metric, i) => {
      const el = els[i];
      if (!el) return;
      decodeInto(el, '', 0);
      const m = parseMetric(metric.value);
      el.textContent = m ? formatMetric(m, 0) : scramble(metric.value, 0);
    });
  }

  private countMetrics(reduced: boolean): void {
    const metrics = this.project().metrics;
    const els = this.metricEls().map((r) => r.nativeElement);
    const counted: { el: HTMLElement; m: NonNullable<ReturnType<typeof parseMetric>> }[] = [];
    metrics.forEach((metric, i) => {
      const el = els[i];
      if (!el) return;
      const m = parseMetric(metric.value);
      if (!m) decodeInto(el, metric.value, 500, { reducedMotion: reduced });
      else if (reduced) el.textContent = metric.value;
      else counted.push({ el, m });
    });
    if (!counted.length) return;
    const mine = this.token;
    const t0 = performance.now();
    const frame = () => {
      if (mine !== this.token) return;
      const p = Math.min(1, (performance.now() - t0) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      counted.forEach(({ el, m }) => (el.textContent = formatMetric(m, eased)));
      if (p < 1) this.raf = requestAnimationFrame(frame);
    };
    frame();
  }
}
