import { describe, it, expect } from 'vitest';
import { computeLoadingProgress } from '../../utils/computations';

describe('computeLoadingProgress', () => {
  it('clamps raw progress to [0, 100]', () => {
    expect(computeLoadingProgress(-10, 0)).toBe(0);
    expect(computeLoadingProgress(150, 0)).toBe(100);
    expect(computeLoadingProgress(50, 0)).toBe(50);
  });

  it('ensures monotonically non-decreasing output', () => {
    // If previous is higher than raw, keep previous
    expect(computeLoadingProgress(30, 50)).toBe(50);
    // If raw is higher, use raw
    expect(computeLoadingProgress(70, 50)).toBe(70);
  });

  it('handles boundary values correctly', () => {
    expect(computeLoadingProgress(0, 0)).toBe(0);
    expect(computeLoadingProgress(100, 0)).toBe(100);
    expect(computeLoadingProgress(100, 100)).toBe(100);
  });

  it('handles NaN-like edge cases by clamping', () => {
    // Very large numbers get clamped to 100
    expect(computeLoadingProgress(999, 0)).toBe(100);
    // Very negative numbers get clamped to 0 but previous wins
    expect(computeLoadingProgress(-999, 50)).toBe(50);
  });

  it('returns previous when raw equals previous', () => {
    expect(computeLoadingProgress(42, 42)).toBe(42);
  });

  it('progress sequence is always non-decreasing', () => {
    const rawValues = [0, 5, 3, 10, 8, 20, 50, 45, 100];
    let prev = 0;
    for (const raw of rawValues) {
      const result = computeLoadingProgress(raw, prev);
      expect(result).toBeGreaterThanOrEqual(prev);
      prev = result;
    }
  });
});
