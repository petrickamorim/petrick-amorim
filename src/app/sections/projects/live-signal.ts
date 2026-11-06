import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { Project } from '../../data/projects';

const POINTS = 14;
const randomPoints = () => Array.from({ length: POINTS }, () => Math.random());

/** Decorative signs of life: a sparkline and a jittering latency, never a real health check. */
@Component({
  selector: 'app-live-signal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'stt' },
  templateUrl: './live-signal.html',
  styleUrl: './live-signal.scss',
})
export class LiveSignal {
  protected readonly lang = inject(LangService);
  readonly status = input.required<Project['status']>();
  protected readonly pts = signal(randomPoints());
  protected readonly ms = signal<number | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const tick = () => {
        this.pts.update((p) => [...p.slice(1), Math.random()]);
        this.ms.set(Math.round(this.status().baseMs * (0.8 + Math.random() * 0.5)));
      };
      const id = setInterval(tick, 700);
      destroyRef.onDestroy(() => clearInterval(id));
    });
  }

  protected points(): string {
    return this.pts()
      .map((v, i) => `${i * 5},${(16 - v * 14).toFixed(1)}`)
      .join(' ');
  }
}
