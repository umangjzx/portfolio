import { describe, it, expect } from 'vitest';
import { parseMetric } from './computations';

describe('parseMetric', () => {
  it('splits currency prefix and magnitude suffix', () => {
    expect(parseMetric('$139K+')).toEqual({ prefix: '$', value: 139, suffix: 'K+', decimals: 0 });
  });

  it('handles plain integers and trailing plus', () => {
    expect(parseMetric('14')).toEqual({ prefix: '', value: 14, suffix: '', decimals: 0 });
    expect(parseMetric('11+')).toEqual({ prefix: '', value: 11, suffix: '+', decimals: 0 });
  });

  it('preserves decimal precision', () => {
    expect(parseMetric('8.01 CGPA')).toEqual({ prefix: '', value: 8.01, suffix: ' CGPA', decimals: 2 });
  });

  it('returns null when there is no number', () => {
    expect(parseMetric('N/A')).toBeNull();
  });
});
