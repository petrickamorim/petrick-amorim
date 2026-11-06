import { stackFrame } from './stack-frame';

const desk = { mobile: false, height: 900 };

describe('stackFrame', () => {
  it('starts with the full title and nothing else visible', () => {
    const f = stackFrame(0, 5, desk);
    expect(f.titleScale).toBe(1);
    expect(f.titleOpacity).toBe(1);
    expect(f.rigOpacity).toBe(0);
    expect(f.labelOpacity).toEqual([0, 0, 0, 0, 0]);
    expect(f.pulseOpacity).toBe(0);
    expect(f.hot).toEqual([false, false, false, false, false]);
  });

  it('ends with the title in the background and every layer lit', () => {
    const f = stackFrame(1, 5, desk);
    expect(f.titleOpacity).toBeCloseTo(0.07, 5);
    expect(f.titleScale).toBeCloseTo(0.82, 5);
    expect(f.labelOpacity).toEqual([1, 1, 1, 1, 1]);
    expect(f.hot).toEqual([true, true, true, true, true]);
    expect(f.pulseOpacity).toBe(0);
  });

  it('stacks the plates symmetrically around the center', () => {
    const f = stackFrame(0.6, 5, desk);
    expect(f.plateZ[0]).toBeCloseTo(-f.plateZ[4], 8);
    expect(f.plateZ[2]).toBeCloseTo(0, 8);
    expect(f.plateZ[0]).toBeGreaterThan(f.plateZ[1]);
  });

  it('lights only the plates the pulse is crossing', () => {
    const f = stackFrame(0.87, 5, desk);
    const lit = f.hot.map((h, i) => (h ? i : -1)).filter((i) => i >= 0);
    expect(f.pulseOpacity).toBe(1);
    expect(lit.length).toBeGreaterThanOrEqual(1);
    expect(lit.length).toBeLessThanOrEqual(2);
    if (lit.length === 2) expect(lit[1] - lit[0]).toBe(1);
  });

  it('clamps progress outside 0..1', () => {
    expect(stackFrame(-0.5, 5, desk)).toEqual(stackFrame(0, 5, desk));
    expect(stackFrame(1.5, 5, desk)).toEqual(stackFrame(1, 5, desk));
  });

  it('places labels below the plates on mobile', () => {
    const f = stackFrame(1, 5, { mobile: true, height: 800 });
    expect(f.labelTop[0]).toBeCloseTo(480, 5);
    expect(f.labelTop[1]).toBeCloseTo(540, 5);
  });
});
