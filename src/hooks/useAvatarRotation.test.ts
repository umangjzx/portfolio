import { describe, it, expect } from 'vitest';
import { computeAvatarRotation } from './useAvatarRotation';

describe('computeAvatarRotation', () => {
  const DEG_TO_RAD = Math.PI / 180;

  it('returns zero rotation for neutral cursor position (0, 0)', () => {
    const result = computeAvatarRotation(0, 0);
    expect(result.rotationX).toBe(0);
    expect(result.rotationY).toBe(0);
  });

  it('computes correct rotation for normalizedX=1 (full right)', () => {
    const result = computeAvatarRotation(1, 0);
    expect(result.rotationY).toBeCloseTo(30 * DEG_TO_RAD, 5);
    expect(result.rotationX).toBe(0);
  });

  it('computes correct rotation for normalizedX=-1 (full left)', () => {
    const result = computeAvatarRotation(-1, 0);
    expect(result.rotationY).toBeCloseTo(-30 * DEG_TO_RAD, 5);
    expect(result.rotationX).toBe(0);
  });

  it('computes correct rotation for normalizedY=1 (full up)', () => {
    const result = computeAvatarRotation(0, 1);
    expect(result.rotationX).toBeCloseTo(20 * DEG_TO_RAD, 5);
    expect(result.rotationY).toBe(0);
  });

  it('computes correct rotation for normalizedY=-1 (full down)', () => {
    const result = computeAvatarRotation(0, -1);
    expect(result.rotationX).toBeCloseTo(-20 * DEG_TO_RAD, 5);
    expect(result.rotationY).toBe(0);
  });

  it('clamps horizontal rotation to ±30° for extreme normalizedX values', () => {
    const maxRad = 30 * DEG_TO_RAD;
    const result1 = computeAvatarRotation(5, 0);
    expect(result1.rotationY).toBeCloseTo(maxRad, 5);

    const result2 = computeAvatarRotation(-10, 0);
    expect(result2.rotationY).toBeCloseTo(-maxRad, 5);
  });

  it('clamps vertical rotation to ±20° for extreme normalizedY values', () => {
    const maxRad = 20 * DEG_TO_RAD;
    const result1 = computeAvatarRotation(0, 3);
    expect(result1.rotationX).toBeCloseTo(maxRad, 5);

    const result2 = computeAvatarRotation(0, -7);
    expect(result2.rotationX).toBeCloseTo(-maxRad, 5);
  });

  it('handles combined X and Y inputs correctly', () => {
    const result = computeAvatarRotation(0.5, -0.5);
    expect(result.rotationY).toBeCloseTo(15 * DEG_TO_RAD, 5);
    expect(result.rotationX).toBeCloseTo(-10 * DEG_TO_RAD, 5);
  });

  it('clamps both axes simultaneously for extreme values', () => {
    const result = computeAvatarRotation(100, -100);
    expect(result.rotationY).toBeCloseTo(30 * DEG_TO_RAD, 5);
    expect(result.rotationX).toBeCloseTo(-20 * DEG_TO_RAD, 5);
  });
});
