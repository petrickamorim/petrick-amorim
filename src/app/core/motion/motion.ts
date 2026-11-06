import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const MOBILE_MAX = 760;
export const isMobile = () => innerWidth < MOBILE_MAX;

export { gsap, ScrollTrigger };

let refreshQueued = false;

/**
 * Re-sorts and refreshes every ScrollTrigger once per frame. Call it after creating
 * triggers: sections render in any order, and pins (refreshPriority 1) must be
 * measured before the triggers below them.
 */
export function refreshScroll(): void {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  });
}
