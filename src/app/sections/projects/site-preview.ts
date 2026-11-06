import { ChangeDetectionStrategy, Component, inject, input, viewChild } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { COPY } from '../../data/copy';
import { SiteProject } from '../../data/projects';
import { ArchFlow } from './arch-flow';

@Component({
  selector: 'app-site-preview',
  imports: [ArchFlow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'console' },
  templateUrl: './site-preview.html',
  styleUrl: './site-preview.scss',
})
export class SitePreview {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  readonly project = input.required<SiteProject>();

  /** Same screenshot in a lighter format; the JPEG stays as the fallback. */
  protected variant(jpg: string, ext: 'avif' | 'webp'): string {
    return jpg.replace(/\.jpe?g$/,`.${ext}`);
  }
  private readonly flow = viewChild.required(ArchFlow);

  runFlow(): Promise<void> {
    return this.flow().run('forward');
  }

  reset(): void {
    this.flow().reset();
  }
}
