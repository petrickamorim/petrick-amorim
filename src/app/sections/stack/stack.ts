import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, effect, inject } from '@angular/core';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, isMobile, prefersReducedMotion, refreshScroll, registerGsap } from '../../core/motion/motion';
import { scramble } from '../../core/text/scramble';
import { COPY } from '../../data/copy';
import { STACK_LAYERS } from '../../data/stack-layers';
import { stackFrame } from './stack-frame';

@Component({
  selector: 'app-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'stack', class: 'section' },
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  protected readonly layers = STACK_LAYERS;

  private progress = 0;
  private ready = false;

  constructor() {
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);
    const one = (sel: string) => host.querySelector<HTMLElement>(sel)!;
    const all = (sel: string) => Array.from(host.querySelectorAll<HTMLElement>(sel));

    const apply = (p: number) => {
      this.progress = p;
      const f = stackFrame(p, this.layers.length, { mobile: isMobile(), height: host.clientHeight });
      const bigt = one('.bigt');
      bigt.style.transform = `scale(${f.titleScale})`;
      bigt.style.opacity = String(f.titleOpacity);
      const glow = one('.glow');
      glow.style.width = f.glowW + '%';
      glow.style.height = f.glowH + '%';
      const rig = one('.rig');
      rig.style.opacity = String(f.rigOpacity);
      rig.style.transform = `rotateX(58deg) rotateZ(${f.rigRotateZ}deg) translateZ(${f.rigTranslateZ}px)`;
      all('.plate').forEach((el, i) => {
        el.style.transform = `translateZ(${f.plateZ[i]}px)`;
        el.classList.toggle('hot', f.hot[i]);
      });
      const pulse = one('.pulse');
      pulse.style.opacity = String(f.pulseOpacity);
      pulse.style.transform = `translateZ(${f.pulseZ}px)`;
      all('.lab').forEach((el, i) => {
        const layer = this.layers[i];
        const lp = f.labelOpacity[i];
        el.style.opacity = String(lp);
        el.style.top = f.labelTop[i] + 'px';
        // a label not shown yet holds no text, so nothing (screen readers included) meets decode noise
        el.querySelector('h4')!.textContent = lp > 0 ? scramble(this.lang.t(layer.name), lp * 1.2) : '';
        el.querySelector('p')!.textContent = lp > 0 ? scramble(layer.techs.join(' · '), lp * 1.05) : '';
      });
    };

    effect(() => {
      this.lang.lang();
      if (this.ready) apply(this.progress);
    });

    afterNextRender(() => {
      registerGsap();
      this.ready = true;
      if (prefersReducedMotion()) {
        apply(1);
        return;
      }
      apply(0);
      const st = ScrollTrigger.create({
        trigger: host,
        start: 'top top',
        end: '+=220%',
        pin: true,
        scrub: true,
        refreshPriority: 1,
        onUpdate: (s) => apply(s.progress),
      });
      refreshScroll();
      destroyRef.onDestroy(() => st.kill());
    });
  }
}
