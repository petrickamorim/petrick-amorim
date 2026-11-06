import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { Lang } from '../../core/i18n/i18n.types';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, registerGsap } from '../../core/motion/motion';

const SECTIONS = [
  { id: 'stack', label: '01' },
  { id: 'projetos', label: '02' },
  { id: 'exp', label: '03' },
  { id: 'contato', label: '04' },
];

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  protected readonly lang = inject(LangService);
  protected readonly sections = SECTIONS;
  protected readonly showIndex = signal(false);
  protected readonly active = signal<string | null>(null);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      registerGsap();
      const triggers = [
        ScrollTrigger.create({
          trigger: '#stack',
          start: 'top 50%',
          onEnter: () => this.showIndex.set(true),
          onLeaveBack: () => this.showIndex.set(false),
        }),
        ...SECTIONS.map((s) =>
          ScrollTrigger.create({
            trigger: `#${s.id}`,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => self.isActive && this.active.set(s.id),
          }),
        ),
      ];
      destroyRef.onDestroy(() => triggers.forEach((t) => t.kill()));
    });
  }

  protected setLang(l: Lang): void {
    this.lang.set(l);
  }

  protected go(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    const pin = ScrollTrigger.getAll().find((t) => t.trigger === el && t.pin);
    const top = pin ? pin.start + 1 : el.getBoundingClientRect().top + scrollY;
    scrollTo({ top, behavior: 'smooth' });
  }
}
