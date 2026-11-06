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

let queued: Promise<void> | null = null;

/**
 * Re-sorts and refreshes every ScrollTrigger once per frame. Call it after creating
 * triggers: sections render in any order, and pins (refreshPriority 1) must be
 * measured before the triggers below them. Resolves once the refresh has run.
 */
export function refreshScroll(): Promise<void> {
  queued ??= new Promise<void>((resolve) =>
    requestAnimationFrame(() => {
      queued = null;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      resolve();
    }),
  );
  return queued;
}

/**
 * Resolves after a refresh still queued has run. A refresh with pins on the page
 * resets and restores the scroll position, which aborts a smooth scroll in flight,
 * so programmatic smooth scrolls must start only after it.
 */
export function refreshSettled(): Promise<void> {
  return queued ?? Promise.resolve();
}
