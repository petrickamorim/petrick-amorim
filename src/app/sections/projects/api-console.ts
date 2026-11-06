import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal, viewChild } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { COPY } from '../../data/copy';
import { ApiProject } from '../../data/projects';
import { ArchFlow } from './arch-flow';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

@Component({
  selector: 'app-api-console',
  imports: [ArchFlow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'console' },
  templateUrl: './api-console.html',
  styleUrl: './api-console.scss',
})
export class ApiConsole {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  readonly project = input.required<ApiProject>();
  protected readonly status = signal<{ text: string; ms: number } | null>(null);
  protected readonly body = signal('');

  private readonly flow = viewChild.required(ArchFlow);
  private gen = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.gen++);
  }

  protected onSend(e: Event): void {
    e.stopPropagation();
    void this.send();
  }

  /** Runs the request/response animation; a newer call cancels any send still in flight. */
  async send(): Promise<void> {
    const mine = ++this.gen;
    const p = this.project();
    this.status.set(null);
    this.body.set('');
    await this.flow().run('forward');
    if (mine !== this.gen) return;
    await this.flow().run('back');
    if (mine !== this.gen) return;
    this.status.set({ text: p.responseStatus, ms: p.status.baseMs + Math.round(Math.random() * 12) });
    for (let k = 3; ; k += 3) {
      this.body.set(p.responseBody.slice(0, k));
      if (k >= p.responseBody.length) break;
      await wait(16);
      if (mine !== this.gen) return;
    }
  }

  /** Back to the empty state (row closed). */
  reset(): void {
    this.gen++;
    this.status.set(null);
    this.body.set('');
    this.flow().reset();
  }
}
