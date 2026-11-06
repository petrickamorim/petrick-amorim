export interface Metric {
  prefix: string;
  value: number;
  decimals: number;
  suffix: string;
}

/** Splits values like "5,0★", "<1s" or "15min" so they can be counted up from zero. */
export function parseMetric(v: string): Metric | null {
  const m = v.match(/^([<]?)(\d+[,.]?\d*)(.*)$/);
  if (!m) return null;
  const num = m[2];
  const sep = num.search(/[,.]/);
  return {
    prefix: m[1],
    value: parseFloat(num.replace(',', '.')),
    decimals: sep === -1 ? 0 : num.length - sep - 1,
    suffix: m[3],
  };
}

export function formatMetric(m: Metric, t: number): string {
  return m.prefix + (m.value * t).toFixed(m.decimals).replace('.', ',') + m.suffix;
}
