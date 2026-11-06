import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, input, signal, viewChild, viewChildren } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { FlowNode } from '../../data/projects';

const HOP_MS = 260;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  selector: 'app-arch-flow',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flow' },
  templateUrl: './arch-flow.html',
  styleUrl: './arch-flow.scss',
})
export class ArchFlow {
  protected readonly lang = inject(LangService);
  readonly nodes = input.required<FlowNode[]>();
  protected readonly hits = signal<number[]>([]);

  private readonly nodeEls = viewChildren<ElementRef<HTMLElement>>('node');
  private readonly pkt = viewChild.required<ElementRef<HTMLElement>>('pkt');
  private gen = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.gen++);
  }

  /** Sends the packet node to node; a newer run (or reset) cancels this one. */
  async run(direction: 'forward' | 'back'): Promise<void> {
    const mine = ++this.gen;
    const els = this.nodeEls().map((r) => r.nativeElement);
    const pkt = this.pkt().nativeElement;
    const xs = els.map((n) => n.offsetLeft + n.offsetWidth / 2);
    const order = els.map((_, i) => i);
    if (direction === 'back') order.reverse();

    this.hits.set([]);
    pkt.style.opacity = '1';
    pkt.style.background = direction === 'back' ? 'var(--green)' : 'var(--purple)';

    for (let step = 0; step < order.length; step++) {
      const i = order[step];
      const from = step ? xs[order[step - 1]] : xs[i];
      pkt.animate?.([{ left: `${from}px` }, { left: `${xs[i]}px` }], {
        duration: step ? HOP_MS : 1,
        fill: 'forwards',
        easing: 'ease-in-out',
      });
      await wait(step ? HOP_MS : 1);
      if (mine !== this.gen) return;
      this.hits.update((h) => [...h, i]);
      if (step) {
        const prev = order[step - 1];
        setTimeout(() => mine === this.gen && this.hits.update((h) => h.filter((x) => x !== prev)), 200);
      }
    }
    pkt.style.opacity = '0';
    setTimeout(() => mine === this.gen && this.hits.set([]), 700);
  }

  reset(): void {
    this.gen++;
    this.hits.set([]);
    this.pkt().nativeElement.style.opacity = '0';
  }
}
