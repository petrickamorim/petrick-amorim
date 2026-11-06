import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Container, tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { LangService } from '../../core/i18n/lang.service';
import { ScrollTrigger, gsap, isMobile, prefersReducedMotion, refreshScroll, registerGsap } from '../../core/motion/motion';
import { decodeInto } from '../../core/text/scramble';
import { CONTACT } from '../../data/contact';
import { COPY } from '../../data/copy';
import { WarpField } from './warp-field';

const NAME = 'Petrick Amorim';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'home' },
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly lang = inject(LangService);
  protected readonly copy = COPY;
  protected readonly contact = CONTACT;
  protected readonly iconsOn = signal(false);

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('warp');
  private readonly ambient = viewChild.required<ElementRef<HTMLDivElement>>('ambient');
  private readonly hello = viewChild.required<ElementRef<HTMLElement>>('hello');
  private readonly name = viewChild.required<ElementRef<HTMLElement>>('name');
  private helloStarted = false;
  private introDone = false;
  private particles?: Container;

  constructor() {
    const destroyRef = inject(DestroyRef);
    const host = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;

    // A switch mid-intro cancels the running hello decode with the final text; afterwards it re-decodes briefly.
    effect(() => {
      const text = this.lang.t(COPY.hello);
      if (!this.helloStarted) return;
      decodeInto(this.hello().nativeElement, text, this.introDone ? 350 : 0, { reducedMotion: prefersReducedMotion() });
    });

    afterNextRender(() => {
      registerGsap();
      const reduced = prefersReducedMotion();
      const warp = new WarpField(this.canvas().nativeElement, { count: isMobile() ? 220 : 500 });
      const onResize = () => warp.resize();
      const onMove = (e: MouseEvent) => warp.setPointer(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5);
      addEventListener('resize', onResize);
      if (reduced) {
        warp.speed = 0.0004;
        for (let i = 0; i < 40; i++) warp.draw();
      } else {
        addEventListener('mousemove', onMove);
        warp.start();
      }

      this.loadAmbient(reduced);
      this.intro(reduced);

      let tl: gsap.core.Timeline | undefined;
      if (!reduced) {
        tl = gsap
          .timeline({ scrollTrigger: { trigger: host, start: 'top top', end: '+=100%', scrub: true, pin: true, refreshPriority: 1 } })
          .to(warp, { speed: 0.05, ease: 'power2.in' }, 0)
          .to(host.querySelector('.hero'), { scale: 2.4, opacity: 0, filter: 'blur(8px)', ease: 'power2.in' }, 0)
          .to(host.querySelectorAll('.scrollhint, .hfoot'), { opacity: 0 }, 0);
      }

      refreshScroll();

      destroyRef.onDestroy(() => {
        warp.stop();
        removeEventListener('resize', onResize);
        removeEventListener('mousemove', onMove);
        tl?.scrollTrigger?.kill();
        tl?.kill();
        this.particles?.destroy();
        ScrollTrigger.refresh();
      });
    });
  }

  private async intro(reduced: boolean): Promise<void> {
    await document.fonts.ready;
    this.helloStarted = true;
    await decodeInto(this.hello().nativeElement, this.lang.t(COPY.hello), 700, { reducedMotion: reduced });
    await decodeInto(this.name().nativeElement, NAME, 1600, { reducedMotion: reduced });
    this.introDone = true;
    this.iconsOn.set(true);
  }

  private async loadAmbient(reduced: boolean): Promise<void> {
    await loadSlim(tsParticles);
    this.particles = await tsParticles.load({
      element: this.ambient().nativeElement,
      options: {
        fullScreen: { enable: false },
        background: { color: 'transparent' },
        detectRetina: true,
        fpsLimit: 60,
        particles: {
          number: { value: isMobile() ? 40 : 80 },
          color: { value: '#ffffff' },
          size: { value: { min: 0.4, max: 1.3 } },
          opacity: {
            value: { min: 0.1, max: 0.6 },
            animation: { enable: !reduced, speed: 0.6, sync: false },
          },
          move: { enable: !reduced, speed: 0.12, random: true, outModes: { default: 'out' } },
        },
      },
    });
  }
}
