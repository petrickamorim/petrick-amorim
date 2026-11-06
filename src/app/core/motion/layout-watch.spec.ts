import { watchLayout } from './layout-watch';

class FakeObserver {
  static last: FakeObserver;
  observed: Element[] = [];
  disconnected = false;
  constructor(readonly cb: () => void) {
    FakeObserver.last = this;
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  disconnect() {
    this.disconnected = true;
  }
}

describe('watchLayout', () => {
  const original = globalThis.ResizeObserver;
  let refresh: ReturnType<typeof vi.fn<() => void>>;
  let el: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = FakeObserver;
    refresh = vi.fn<() => void>();
    el = document.createElement('main');
  });

  afterEach(() => {
    vi.useRealTimers();
    (globalThis as { ResizeObserver: unknown }).ResizeObserver = original;
  });

  it('ignores the initial observation and refreshes once after resizes settle', () => {
    const w = watchLayout(el, refresh, 150);
    expect(FakeObserver.last.observed).toEqual([el]);
    FakeObserver.last.cb();
    vi.advanceTimersByTime(500);
    expect(refresh).not.toHaveBeenCalled();
    FakeObserver.last.cb();
    vi.advanceTimersByTime(100);
    FakeObserver.last.cb();
    vi.advanceTimersByTime(100);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60);
    expect(refresh).toHaveBeenCalledTimes(1);
    w.stop();
  });

  it('waits for scrolling to stop before refreshing a pending change', () => {
    const w = watchLayout(el, refresh, 150);
    FakeObserver.last.cb();
    w.schedule();
    vi.advanceTimersByTime(100);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(100);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(100);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60);
    expect(refresh).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(500);
    expect(refresh).toHaveBeenCalledTimes(1);
    w.stop();
  });

  it('disconnects and drops a pending refresh on stop', () => {
    const w = watchLayout(el, refresh, 150);
    w.schedule();
    w.stop();
    vi.advanceTimersByTime(500);
    expect(refresh).not.toHaveBeenCalled();
    expect(FakeObserver.last.disconnected).toBe(true);
  });
});
