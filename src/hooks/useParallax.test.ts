import { describe, it, expect } from 'vitest';
import { computeParallaxOffset, PARALLAX_MULTIPLIERS } from './useParallax';

describe('computeParallaxOffset', () => {
  it('returns 0 when scroll position is 0', () => {
    expect(computeParallaxOffset(0, 0.3)).toBe(0);
    expect(computeParallaxOffset(0, 0.6)).toBe(0);
    expect(computeParallaxOffset(0, 1.0)).toBe(0);
  });

  it('computes background offset at 0.3x scroll speed', () => {
    expect(computeParallaxOffset(100, PARALLAX_MULTIPLIERS.background)).toBe(30);
    expect(computeParallaxOffset(500, PARALLAX_MULTIPLIERS.background)).toBe(150);
  });

  it('computes midground offset at 0.6x scroll speed', () => {
    expect(computeParallaxOffset(100, PARALLAX_MULTIPLIERS.midground)).toBe(60);
    expect(computeParallaxOffset(500, PARALLAX_MULTIPLIERS.midground)).toBe(300);
  });

  it('computes foreground offset at 1.0x scroll speed', () => {
    expect(computeParallaxOffset(100, PARALLAX_MULTIPLIERS.foreground)).toBe(100);
    expect(computeParallaxOffset(500, PARALLAX_MULTIPLIERS.foreground)).toBe(500);
  });

  it('handles negative scroll positions', () => {
    expect(computeParallaxOffset(-200, PARALLAX_MULTIPLIERS.background)).toBe(-60);
    expect(computeParallaxOffset(-200, PARALLAX_MULTIPLIERS.midground)).toBe(-120);
    expect(computeParallaxOffset(-200, PARALLAX_MULTIPLIERS.foreground)).toBe(-200);
  });

  it('handles fractional scroll positions', () => {
    expect(computeParallaxOffset(33.5, PARALLAX_MULTIPLIERS.background)).toBeCloseTo(10.05);
    expect(computeParallaxOffset(33.5, PARALLAX_MULTIPLIERS.midground)).toBeCloseTo(20.1);
    expect(computeParallaxOffset(33.5, PARALLAX_MULTIPLIERS.foreground)).toBeCloseTo(33.5);
  });
});

describe('PARALLAX_MULTIPLIERS', () => {
  it('has correct multiplier values', () => {
    expect(PARALLAX_MULTIPLIERS.background).toBe(0.3);
    expect(PARALLAX_MULTIPLIERS.midground).toBe(0.6);
    expect(PARALLAX_MULTIPLIERS.foreground).toBe(1.0);
  });

  it('maintains ordering: background < midground < foreground', () => {
    expect(PARALLAX_MULTIPLIERS.background).toBeLessThan(PARALLAX_MULTIPLIERS.midground);
    expect(PARALLAX_MULTIPLIERS.midground).toBeLessThan(PARALLAX_MULTIPLIERS.foreground);
  });
});
