import { refreshScroll } from './motion';

export interface LayoutWatch {
  /** Queues a refresh as if the element had resized (e.g. after a language switch). */
  schedule(): void;
  stop(): void;
}

/**
 * Refreshes the ScrollTriggers once the observed element stops changing size: panels
 * opening, a response typing in, text reflowing after a language switch, late fonts.
 * A refresh with pins on the page resets the scroll position and aborts a smooth
 * scroll in flight, so a pending refresh also waits until scrolling has been idle.
 */
export function watchLayout(
  el: Element,
  refresh: () => unknown = refreshScroll,
  idleMs = 150,
): LayoutWatch {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let initial = true;

  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      void refresh();
    }, idleMs);
  };
  const onScroll = () => {
    if (timer !== undefined) schedule();
  };

  const observer =
    typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => {
          // The first callback reports the size at observe() time: nothing changed yet.
          if (initial) initial = false;
          else schedule();
        })
      : null;
  observer?.observe(el);
  addEventListener('scroll', onScroll, { passive: true });

  return {
    schedule,
    stop() {
      observer?.disconnect();
      removeEventListener('scroll', onScroll);
      clearTimeout(timer);
      timer = undefined;
    },
  };
}
