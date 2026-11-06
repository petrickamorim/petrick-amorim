import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'home', class: 'section' },
  template: '',
  styles: ':host { display: block; min-height: 100vh; }',
})
export class Home {}
