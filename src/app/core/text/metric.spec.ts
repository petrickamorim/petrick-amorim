import { formatMetric, parseMetric } from './metric';

describe('parseMetric', () => {
  it('parses a decimal with comma and a suffix', () => {
    expect(parseMetric('5,0★')).toEqual({ prefix: '', value: 5, decimals: 1, suffix: '★' });
  });

  it('parses a prefix', () => {
    expect(parseMetric('<1s')).toEqual({ prefix: '<', value: 1, decimals: 0, suffix: 's' });
  });

  it('parses a word suffix', () => {
    expect(parseMetric('15min')).toEqual({ prefix: '', value: 15, decimals: 0, suffix: 'min' });
  });

  it('returns null for non numeric values', () => {
    expect(parseMetric('OWASP')).toBeNull();
  });
});

describe('formatMetric', () => {
  it('formats the final value with comma decimals', () => {
    expect(formatMetric(parseMetric('5,0★')!, 1)).toBe('5,0★');
  });

  it('formats a partial value', () => {
    expect(formatMetric(parseMetric('100%')!, 0.5)).toBe('50%');
  });
});
