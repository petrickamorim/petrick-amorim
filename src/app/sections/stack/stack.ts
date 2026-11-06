import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { COPY } from '../../data/copy';

@Component({
  selector: 'app-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'stack', class: 'section' },
  template: `<div class="bigt">{{ lang.t(copy.stackTitle) }}</div>`,
  styles: ':host { display: block; min-height: 100vh; position: relative; }',
})
export class Stack {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
}
