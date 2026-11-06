import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'contato', class: 'section' },
  template: '',
  styles: ':host { display: block; min-height: 100vh; }',
})
export class Contact {}
