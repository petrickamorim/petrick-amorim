import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { prefersReducedMotion, refreshScroll } from '../../core/motion/motion';
import { decodeInto } from '../../core/text/scramble';
import { Project } from '../../data/projects';
import { LiveSignal } from './live-signal';
import { ProjectPanel } from './project-panel';

@Component({
  selector: 'app-project-row',
  imports: [LiveSignal, ProjectPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'row', '[class.open]': 'open()' },
  templateUrl: './project-row.html',
  styleUrl: './project-row.scss',
})
export class ProjectRow {
  readonly project = input.required<Project>();
  readonly open = input(false);
  readonly toggle = output<void>();

  private readonly head = viewChild.required<ElementRef<HTMLElement>>('head');
  private readonly title = viewChild.required<ElementRef<HTMLElement>>('title');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected get no(): string {
    return String(this.project().order).padStart(2, '0');
  }

  get offsetTop(): number {
    return this.host.offsetTop;
  }

  decodeTitle(ms: number): void {
    decodeInto(this.title().nativeElement, this.project().title, ms, { reducedMotion: prefersReducedMotion() });
  }

  /** Sweep re-decode: skipped while the row is hovered or open. */
  sweepTitle(ms: number): void {
    if (this.open() || this.head().nativeElement.matches(':hover')) return;
    this.decodeTitle(ms);
  }

  protected onTransitionEnd(e: TransitionEvent): void {
    if (e.target === e.currentTarget && e.propertyName === 'grid-template-rows') refreshScroll();
  }
}
