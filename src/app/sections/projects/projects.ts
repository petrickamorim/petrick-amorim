import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'projetos', class: 'section' },
  template: '',
  styles: ':host { display: block; min-height: 100vh; }',
})
export class Projects {}
