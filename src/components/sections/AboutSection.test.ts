import { describe, it, expect } from 'vitest';
import { computeCardTilt } from '../../utils/computations';

describe('computeCardTilt', () => {
  const cardWidth = 400;
  const cardHeight = 300;

  it('returns zero tilt when cursor is at card center', () => {
    const { tiltX, tiltY } = computeCardTilt(cardWidth / 2, cardHeight / 2, cardWidth, cardHeight);
    expect(tiltX).toBe(0);
    expect(tiltY).toBe(0);
  });

  it('returns positive tiltY when cursor is at right edge', () => {
    const { tiltY } = computeCardTilt(cardWidth, cardHeight / 2, cardWidth, cardHeight);
    expect(tiltY).toBe(15);
  });

  it('returns negative tiltY when cursor is at left edge', () => {
    const { tiltY } = computeCardTilt(0, cardHeight / 2, cardWidth, cardHeight);
    expect(tiltY).toBe(-15);
  });

  it('returns negative tiltX when cursor is at bottom edge (inverted)', () => {
    const { tiltX } = computeCardTilt(cardWidth / 2, cardHeight, cardWidth, cardHeight);
    expect(tiltX).toBe(-15);
  });

  it('returns positive tiltX when cursor is at top edge (inverted)', () => {
    const { tiltX } = computeCardTilt(cardWidth / 2, 0, cardWidth, cardHeight);
    expect(tiltX).toBe(15);
  });

  it('clamps tilt when cursor is outside card bounds', () => {
    const { tiltX, tiltY } = computeCardTilt(cardWidth * 2, cardHeight * 2, cardWidth, cardHeight);
    expect(Math.abs(tiltX)).toBeLessThanOrEqual(15);
    expect(Math.abs(tiltY)).toBeLessThanOrEqual(15);
  });

  it('returns zero tilt for zero-dimension card', () => {
    const { tiltX, tiltY } = computeCardTilt(100, 100, 0, 0);
    expect(tiltX).toBe(0);
    expect(tiltY).toBe(0);
  });

  it('returns zero tilt for negative-dimension card', () => {
    const { tiltX, tiltY } = computeCardTilt(100, 100, -10, -10);
    expect(tiltX).toBe(0);
    expect(tiltY).toBe(0);
  });

  it('produces bounded tilt for any cursor position within card', () => {
    // Test several positions across the card
    const positions = [
      [0, 0], [cardWidth, 0], [0, cardHeight], [cardWidth, cardHeight],
      [cardWidth / 4, cardHeight / 4], [cardWidth * 3 / 4, cardHeight * 3 / 4],
    ];

    for (const [x, y] of positions) {
      const { tiltX, tiltY } = computeCardTilt(x, y, cardWidth, cardHeight);
      expect(Math.abs(tiltX)).toBeLessThanOrEqual(15);
      expect(Math.abs(tiltY)).toBeLessThanOrEqual(15);
    }
  });
});
