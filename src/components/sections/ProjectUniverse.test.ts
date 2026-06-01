import { describe, it, expect } from 'vitest';
import { computeTilt } from '../../utils/computations';

describe('computeTilt', () => {
  const cardRect = { left: 100, top: 100, width: 300, height: 200 };

  it('returns zero tilt when cursor is at center of card', () => {
    // Center of card: left + width/2 = 250, top + height/2 = 200
    const result = computeTilt(250, 200, cardRect);
    expect(result.rotateX).toBeCloseTo(0, 5);
    expect(result.rotateY).toBeCloseTo(0, 5);
    expect(result.lightX).toBe(50);
    expect(result.lightY).toBe(50);
  });

  it('tilts right (positive rotateY) when cursor is on right side', () => {
    // Right edge: clientX = 400 (left + width)
    const result = computeTilt(400, 200, cardRect);
    expect(result.rotateY).toBe(15);
    expect(result.rotateX).toBeCloseTo(0, 5);
  });

  it('tilts left (negative rotateY) when cursor is on left side', () => {
    // Left edge: clientX = 100 (left)
    const result = computeTilt(100, 200, cardRect);
    expect(result.rotateY).toBe(-15);
    expect(result.rotateX).toBeCloseTo(0, 5);
  });

  it('tilts up (positive rotateX) when cursor is at top', () => {
    // Top edge: clientY = 100 (top)
    const result = computeTilt(250, 100, cardRect);
    expect(result.rotateX).toBe(15);
    expect(result.rotateY).toBe(0);
  });

  it('tilts down (negative rotateX) when cursor is at bottom', () => {
    // Bottom edge: clientY = 300 (top + height)
    const result = computeTilt(250, 300, cardRect);
    expect(result.rotateX).toBe(-15);
    expect(result.rotateY).toBe(0);
  });

  it('clamps tilt to ±15 degrees even when cursor is outside card bounds', () => {
    // Far outside right: clientX = 1000
    const result = computeTilt(1000, 200, cardRect);
    expect(result.rotateY).toBeLessThanOrEqual(15);
    expect(result.rotateY).toBeGreaterThanOrEqual(-15);
    expect(result.rotateX).toBeLessThanOrEqual(15);
    expect(result.rotateX).toBeGreaterThanOrEqual(-15);
  });

  it('clamps light position to [0, 100] range', () => {
    // Cursor far outside card
    const result = computeTilt(0, 0, cardRect);
    expect(result.lightX).toBeGreaterThanOrEqual(0);
    expect(result.lightX).toBeLessThanOrEqual(100);
    expect(result.lightY).toBeGreaterThanOrEqual(0);
    expect(result.lightY).toBeLessThanOrEqual(100);
  });

  it('produces proportional tilt for intermediate positions', () => {
    // Halfway between center and right edge
    // Center X = 250, right edge = 400, halfway = 325
    const result = computeTilt(325, 200, cardRect);
    expect(result.rotateY).toBeCloseTo(7.5, 1);
    expect(result.rotateX).toBeCloseTo(0, 1);
  });

  it('handles zero-size card gracefully', () => {
    const zeroRect = { left: 0, top: 0, width: 0, height: 0 };
    // Division by zero scenario - should still clamp
    const result = computeTilt(50, 50, zeroRect);
    expect(result.rotateX).toBeGreaterThanOrEqual(-15);
    expect(result.rotateX).toBeLessThanOrEqual(15);
    expect(result.rotateY).toBeGreaterThanOrEqual(-15);
    expect(result.rotateY).toBeLessThanOrEqual(15);
  });
});
