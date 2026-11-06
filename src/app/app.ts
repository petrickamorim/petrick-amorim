import { Component, DestroyRef, ElementRef, afterNextRender, effect, inject, viewChild } from '@angular/core';
import { LangService } from './core/i18n/lang.service';
import { LayoutWatch, watchLayout } from './core/motion/layout-watch';
import { Nav } from './layout/nav/nav';
import { Contact } from './sections/contact/contact';
import { Experience } from './sections/experience/experience';
import { Home } from './sections/home/home';
import { Projects } from './sections/projects/projects';
import { Stack } from './sections/stack/stack';

@Component({
  selector: 'app-root',
  imports: [Nav, Home, Stack, Projects, Experience, Contact],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  constructor() {
    const lang = inject(LangService);
    let watch: LayoutWatch | undefined;
    afterNextRender(() => {
      // Content below a growing panel or reflowed text moves: keep the triggers in step.
      watch = watchLayout(this.main().nativeElement);
    });
    effect(() => {
      lang.lang();
      watch?.schedule();
    });
    inject(DestroyRef).onDestroy(() => watch?.stop());
  }
}
