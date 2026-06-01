import { describe, it, expect } from 'vitest';
import { computeCounterValue } from '../../utils/computations';

describe('AILaboratory - computeCounterValue', () => {
  const DURATION = 2000;

  it('returns 0 when elapsed is 0', () => {
    expect(computeCounterValue(100, 0, DURATION)).toBe(0);
  });

  it('returns target value when elapsed equals duration', () => {
    expect(computeCounterValue(100, DURATION, DURATION)).toBe(100);
  });

  it('returns target value when elapsed exceeds duration', () => {
    expect(computeCounterValue(100, 3000, DURATION)).toBe(100);
  });

  it('returns 0 for negative elapsed time', () => {
    expect(computeCounterValue(100, -500, DURATION)).toBe(0);
  });

  it('returns target value when duration is 0', () => {
    expect(computeCounterValue(50, 500, 0)).toBe(50);
  });

  it('returns 0 for negative target value', () => {
    expect(computeCounterValue(-10, 1000, DURATION)).toBe(0);
  });

  it('produces intermediate values between 0 and target', () => {
    const value = computeCounterValue(100, 1000, DURATION);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);
  });

  it('produces monotonically non-decreasing values over time', () => {
    const target = 500;
    let prev = 0;
    for (let t = 0; t <= DURATION; t += 100) {
      const current = computeCounterValue(target, t, DURATION);
      expect(current).toBeGreaterThanOrEqual(prev);
      prev = current;
    }
  });

  it('works correctly with the stats data target values', () => {
    // Projects: 15, Technologies: 20, GitHub: 500, Hackathons: 8
    const targets = [15, 20, 500, 8];
    for (const target of targets) {
      expect(computeCounterValue(target, 0, DURATION)).toBe(0);
      expect(computeCounterValue(target, DURATION, DURATION)).toBe(target);

      // Mid-point should be between 0 and target
      const mid = computeCounterValue(target, 1000, DURATION);
      expect(mid).toBeGreaterThanOrEqual(0);
      expect(mid).toBeLessThanOrEqual(target);
    }
  });

  it('handles target value of 0', () => {
    expect(computeCounterValue(0, 0, DURATION)).toBe(0);
    expect(computeCounterValue(0, 1000, DURATION)).toBe(0);
    expect(computeCounterValue(0, DURATION, DURATION)).toBe(0);
  });
});
