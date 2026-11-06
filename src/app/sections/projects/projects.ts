import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, prefersReducedMotion, refreshScroll, registerGsap } from '../../core/motion/motion';
import { COPY } from '../../data/copy';
import { PROJECTS } from '../../data/projects';
import { ProjectRow } from './project-row';

const SWEEP_EVERY = 6500;
const SWEEP_MS = 1800;

@Component({
  selector: 'app-projects',
  imports: [ProjectRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'projetos', class: 'section' },
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  protected readonly projects = [...PROJECTS].sort((a, b) => a.order - b.order);
  protected readonly openSlug = signal<string | null>(null);

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly scan = viewChild.required<ElementRef<HTMLElement>>('scan');
  private readonly rows = viewChildren(ProjectRow);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      registerGsap();
      const reduced = prefersReducedMotion();
      const timers: ReturnType<typeof setTimeout>[] = [];
      let decoded = false;

      const trigger = ScrollTrigger.create({
        trigger: this.list().nativeElement,
        start: 'top 80%',
        onEnter: () => {
          if (decoded) return;
          decoded = true;
          this.rows().forEach((row, i) => timers.push(setTimeout(() => row.decodeTitle(600), i * 90)));
        },
      });

      const sweep = () => {
        const h = this.list().nativeElement.offsetHeight;
        this.scan().nativeElement.animate(
          [
            { top: '0px', opacity: 0 },
            { opacity: 1, offset: 0.1 },
            { opacity: 1, offset: 0.9 },
            { top: `${h}px`, opacity: 0 },
          ],
          { duration: SWEEP_MS, easing: 'ease-in-out' },
        );
        this.rows().forEach((row) => {
          timers.push(setTimeout(() => row.sweepTitle(380), (row.offsetTop / h) * SWEEP_MS));
        });
      };
      const interval = reduced ? undefined : setInterval(sweep, SWEEP_EVERY);

      refreshScroll();

      destroyRef.onDestroy(() => {
        trigger.kill();
        clearInterval(interval);
        timers.forEach(clearTimeout);
      });
    });
  }

  protected toggle(slug: string): void {
    this.openSlug.update((cur) => (cur === slug ? null : slug));
  }
}
