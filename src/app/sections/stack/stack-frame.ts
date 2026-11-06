export interface StackFrame {
  titleScale: number;
  titleOpacity: number;
  /** Percent of the section. */
  glowW: number;
  glowH: number;
  rigOpacity: number;
  rigRotateZ: number;
  rigTranslateZ: number;
  plateZ: number[];
  labelOpacity: number[];
  labelTop: number[];
  pulseOpacity: number;
  pulseZ: number;
  hot: boolean[];
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Layout of the "how I build" scene for scroll progress `p` (0..1). Timings come from the approved prototype. */
export function stackFrame(p: number, layers: number, opts: { mobile: boolean; height: number }): StackFrame {
  p = clamp01(p);
  const t = ease(clamp01(p / 0.28));
  const enter = ease(clamp01((p - 0.18) / 0.17));
  const spread = ease(clamp01((p - 0.32) / 0.25));
  const gap = (opts.mobile ? 8 : 12) + spread * (opts.mobile ? 40 : 72);
  const c = (layers - 1) / 2;
  const idx = Array.from({ length: layers }, (_, i) => i);
  const plateZ = idx.map((i) => (c - i) * gap);
  const pp = clamp01((p - 0.78) / 0.18);
  const pulseZ = c * gap - 2 * c * gap * pp;
  const h = opts.height;

  return {
    titleScale: 1 - 0.18 * t,
    titleOpacity: 1 - 0.93 * t,
    glowW: 55 + 40 * t,
    glowH: 60 + 35 * t,
    rigOpacity: enter,
    rigRotateZ: -38 + (1 - enter) * -20,
    rigTranslateZ: (1 - enter) * -200,
    plateZ,
    labelOpacity: idx.map((i) => clamp01((p - 0.42 - i * 0.06) / 0.1)),
    labelTop: idx.map((i) => (opts.mobile ? h * 0.6 + i * h * 0.075 : h * 0.5 - 150 + i * (26 + spread * 38))),
    pulseOpacity: pp > 0 && pp < 1 ? 1 : 0,
    pulseZ,
    hot: plateZ.map((z) => (pp > 0 && Math.abs(z - pulseZ) < gap / 2) || p > 0.97),
  };
}
