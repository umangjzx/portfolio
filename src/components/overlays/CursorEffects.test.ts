import { describe, it, expect } from 'vitest';
import { computeMagneticPull } from '../../utils/computations';

/**
 * Unit tests for CursorEffects overlay logic.
 * The component itself is a visual overlay; we test the exported pure functions.
 *
 * Validates: Requirements 13.2
 */

describe('CursorEffects - computeMagneticPull', () => {
  it('returns zero translation when cursor is more than 50px away', () => {
    const result = computeMagneticPull(200, 200, 100, 100);
    // Distance is ~141px, well beyond 50px
    expect(result.translateX).toBe(0);
    expect(result.translateY).toBe(0);
  });

  it('returns zero translation at exactly 51px distance', () => {
    // Element at (0, 0), cursor at (51, 0)
    const result = computeMagneticPull(51, 0, 0, 0);
    expect(result.translateX).toBe(0);
    expect(result.translateY).toBe(0);
  });

  it('returns non-zero translation when cursor is within 50px', () => {
    // Element at (100, 100), cursor at (120, 100) → distance = 20px
    const result = computeMagneticPull(120, 100, 100, 100);
    expect(result.translateX).toBeGreaterThan(0);
    expect(result.translateY).toBeCloseTo(0, 5);
  });

  it('translation magnitude never exceeds 8px', () => {
    // Cursor very close to element center (distance ~1px)
    const result = computeMagneticPull(100.5, 100.5, 100, 100);
    const magnitude = Math.sqrt(
      result.translateX ** 2 + result.translateY ** 2
    );
    expect(magnitude).toBeLessThanOrEqual(8);
  });

  it('returns maximum pull (~8px) when cursor is at element center', () => {
    const result = computeMagneticPull(100, 100, 100, 100);
    // At distance 0, strength = (1 - 0/50) * 8 = 8
    // But angle is undefined (atan2(0,0) = 0), so translateX = 8*cos(0) = 8, translateY = 0
    // Actually at exact center, dx=dy=0, distance=0, angle=0
    // cos(0)*8 = 8, sin(0)*8 = 0
    const magnitude = Math.sqrt(
      result.translateX ** 2 + result.translateY ** 2
    );
    expect(magnitude).toBeCloseTo(8, 1);
  });

  it('pull direction points from element toward cursor', () => {
    // Cursor to the right of element
    const result = computeMagneticPull(130, 100, 100, 100);
    expect(result.translateX).toBeGreaterThan(0);
    expect(result.translateY).toBeCloseTo(0, 5);

    // Cursor below element
    const result2 = computeMagneticPull(100, 130, 100, 100);
    expect(result2.translateX).toBeCloseTo(0, 5);
    expect(result2.translateY).toBeGreaterThan(0);
  });

  it('returns zero at exactly 50px boundary', () => {
    // At exactly 50px, strength = (1 - 50/50) * 8 = 0
    const result = computeMagneticPull(150, 100, 100, 100);
    expect(result.translateX).toBeCloseTo(0, 5);
    expect(result.translateY).toBeCloseTo(0, 5);
  });
});
