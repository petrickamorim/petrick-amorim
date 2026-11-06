export const DECODE_CHARS = '!<>-_\/[]{}=+*^?#01ABCDEF';

const KEEP = new Set([' ', '·']);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Reveals the first `progress` share of `text`; the rest is random decode noise. */
export function scramble(text: string, progress: number, rand: () => number = Math.random): string {
  const shown = Math.floor(clamp01(progress) * text.length);
  let out = text.slice(0, shown);
  for (let i = shown; i < text.length; i++) {
    const ch = text[i];
    out += KEEP.has(ch) ? ch : DECODE_CHARS[Math.floor(rand() * DECODE_CHARS.length)];
  }
  return out;
}

const running = new WeakMap<HTMLElement, { id: number; resolve: () => void }>();

/** Animates `text` into `el` with the decode effect. A newer call on the same element cancels the older one. */
export function decodeInto(
  el: HTMLElement,
  text: string,
  durationMs: number,
  opts: { reducedMotion?: boolean } = {},
): Promise<void> {
  const previous = running.get(el);
  if (previous) {
    cancelAnimationFrame(previous.id);
    running.delete(el);
    previous.resolve();
  }
  if (opts.reducedMotion || durationMs <= 0) {
    el.textContent = text;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = () => {
      const p = Math.min(1, (performance.now() - start) / durationMs);
      el.textContent = scramble(text, p);
      if (p < 1) {
        running.set(el, { id: requestAnimationFrame(frame), resolve });
      } else {
        running.delete(el);
        resolve();
      }
    };
    frame();
  });
}
