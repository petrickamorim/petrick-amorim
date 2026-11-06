import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'exp', class: 'section' },
  template: '',
  styles: ':host { display: block; min-height: 100vh; }',
})
export class Experience {}
