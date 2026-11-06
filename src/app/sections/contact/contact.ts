import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, gsap, prefersReducedMotion, refreshScroll, registerGsap } from '../../core/motion/motion';
import { CONTACT } from '../../data/contact';
import { COPY } from '../../data/copy';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'contato', class: 'section' },
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  protected readonly contact = CONTACT;
  protected readonly copiedOn = signal(false);
  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

    afterNextRender(() => {
      if (prefersReducedMotion()) {
        host.querySelector<HTMLElement>('.reveal')!.style.backgroundPosition = '0% 0';
        return;
      }
      registerGsap();
      const fadeTargets = host.querySelectorAll('.csub, .mail, .socials a, .avail');
      gsap.set(fadeTargets, { opacity: 0, y: 18 });
      const fill = gsap.to(host.querySelector('.reveal'), {
        backgroundPosition: '0% 0',
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top 75%', end: 'center 55%', scrub: true },
      });
      const entrance = gsap.to(fadeTargets, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        paused: true,
      });
      const trigger = ScrollTrigger.create({
        trigger: host,
        start: 'top 70%',
        onEnter: () => entrance.play(),
        onLeaveBack: () => entrance.reverse(),
      });
      refreshScroll();
      destroyRef.onDestroy(() => {
        fill.scrollTrigger?.kill();
        fill.kill();
        trigger.kill();
        entrance.kill();
      });
    });

    destroyRef.onDestroy(() => clearTimeout(this.copiedTimer));
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
    } catch {
      /* clipboard unavailable: still confirm the click */
    }
    this.copiedOn.set(true);
    clearTimeout(this.copiedTimer);
    this.copiedTimer = setTimeout(() => this.copiedOn.set(false), 1400);
  }
}
