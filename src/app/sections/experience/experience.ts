import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, gsap, prefersReducedMotion, refreshScroll, registerGsap } from '../../core/motion/motion';
import { COPY } from '../../data/copy';
import { EXPERIENCE } from '../../data/experience';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'exp', class: 'section' },
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  protected readonly items = EXPERIENCE;

  private readonly tl = viewChild.required<ElementRef<HTMLElement>>('tl');
  private readonly fill = viewChild.required<ElementRef<HTMLElement>>('fill');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const tl = this.tl().nativeElement;
      const fill = this.fill().nativeElement;
      const items = Array.from(tl.querySelectorAll<HTMLElement>('.item'));

      if (prefersReducedMotion()) {
        items.forEach((el) => el.classList.add('on'));
        fill.style.transform = 'scaleY(1)';
        return;
      }

      registerGsap();
      const tween = gsap.to(fill, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: tl, start: 'top 82%', end: 'bottom 82%', scrub: true },
      });
      const triggers = items.map((el) => {
        const bullets = Array.from(el.querySelectorAll<HTMLElement>('.hl li'));
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
          onEnter: () => {
            el.classList.add('on');
            if (bullets.length) {
              gsap.fromTo(
                bullets,
                { y: 18, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity' },
              );
            }
          },
          onLeaveBack: () => el.classList.remove('on'),
        });
      });
      refreshScroll();

      destroyRef.onDestroy(() => {
        tween.scrollTrigger?.kill();
        tween.kill();
        triggers.forEach((t) => t.kill());
      });
    });
  }
}
