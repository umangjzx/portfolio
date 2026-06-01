import { describe, it, expect } from 'vitest';
import { computeContactMagneticPull as computeMagneticPull } from '../../utils/computations';

/**
 * Unit tests for ContactPortal utility functions.
 * Tests the magnetic pull calculation which is the core testable logic.
 *
 * Requirements: 10.4 (magnetic pull on submit button)
 */
describe('ContactPortal - computeMagneticPull', () => {
  it('returns zero translation when cursor is beyond 50px radius', () => {
    const result = computeMagneticPull(100, 100, 0, 0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns zero translation when distance is exactly 0 (cursor on center)', () => {
    const result = computeMagneticPull(50, 50, 50, 50);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('returns non-zero translation when cursor is within 50px radius', () => {
    // Cursor is 25px to the right of center
    const result = computeMagneticPull(75, 50, 50, 50);
    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBe(0);
  });

  it('translation magnitude never exceeds 8px', () => {
    // Cursor very close to center (1px away)
    const result = computeMagneticPull(51, 50, 50, 50);
    const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
    expect(magnitude).toBeLessThanOrEqual(8);
  });

  it('translation magnitude increases as cursor gets closer', () => {
    const far = computeMagneticPull(90, 50, 50, 50); // 40px away
    const close = computeMagneticPull(60, 50, 50, 50); // 10px away

    const farMag = Math.sqrt(far.x * far.x + far.y * far.y);
    const closeMag = Math.sqrt(close.x * close.x + close.y * close.y);

    expect(closeMag).toBeGreaterThan(farMag);
  });

  it('returns zero when distance is exactly 50px (boundary)', () => {
    // 50px to the right
    const result = computeMagneticPull(100, 50, 50, 50);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('handles diagonal cursor positions correctly', () => {
    // Cursor at 30px diagonal (within radius)
    const result = computeMagneticPull(
      50 + 21.21, // ~30px diagonal
      50 + 21.21,
      50,
      50
    );
    const magnitude = Math.sqrt(result.x * result.x + result.y * result.y);
    expect(magnitude).toBeGreaterThan(0);
    expect(magnitude).toBeLessThanOrEqual(8);
  });

  it('pulls toward cursor direction', () => {
    // Cursor to the right
    const rightPull = computeMagneticPull(70, 50, 50, 50);
    expect(rightPull.x).toBeGreaterThan(0);

    // Cursor to the left
    const leftPull = computeMagneticPull(30, 50, 50, 50);
    expect(leftPull.x).toBeLessThan(0);

    // Cursor above
    const upPull = computeMagneticPull(50, 30, 50, 50);
    expect(upPull.y).toBeLessThan(0);

    // Cursor below
    const downPull = computeMagneticPull(50, 70, 50, 50);
    expect(downPull.y).toBeGreaterThan(0);
  });
});
