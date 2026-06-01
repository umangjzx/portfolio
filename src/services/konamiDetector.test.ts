import { describe, it, expect, beforeEach } from 'vitest';
import { KonamiDetector } from './konamiDetector';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

describe('KonamiDetector', () => {
  let detector: KonamiDetector;

  beforeEach(() => {
    detector = new KonamiDetector();
  });

  it('should return true when the full Konami code is entered', () => {
    for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
      expect(detector.handleKeyDown(KONAMI_CODE[i])).toBe(false);
    }
    expect(detector.handleKeyDown(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
  });

  it('should return false for partial sequences', () => {
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowDown');
    expect(detector.handleKeyDown('ArrowDown')).toBe(false);
  });

  it('should reset state on incorrect key', () => {
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowDown');
    // Wrong key — should reset
    detector.handleKeyDown('x');

    // Now entering the full sequence should work
    for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
      expect(detector.handleKeyDown(KONAMI_CODE[i])).toBe(false);
    }
    expect(detector.handleKeyDown(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
  });

  it('should handle the case where wrong key is also the start of the sequence', () => {
    // Start with ArrowUp
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowUp');
    // Now we expect ArrowDown, but enter ArrowUp (which is also the start)
    detector.handleKeyDown('ArrowUp');
    // Buffer should now have ['ArrowUp'] (restarted)
    // Continue with the rest of the sequence from position 1
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowDown');
    detector.handleKeyDown('ArrowDown');
    detector.handleKeyDown('ArrowLeft');
    detector.handleKeyDown('ArrowRight');
    detector.handleKeyDown('ArrowLeft');
    detector.handleKeyDown('ArrowRight');
    detector.handleKeyDown('b');
    expect(detector.handleKeyDown('a')).toBe(true);
  });

  it('should allow entering the code multiple times', () => {
    // First time
    for (const key of KONAMI_CODE) {
      detector.handleKeyDown(key);
    }

    // Second time
    for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
      expect(detector.handleKeyDown(KONAMI_CODE[i])).toBe(false);
    }
    expect(detector.handleKeyDown(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
  });

  it('should reset the buffer when reset() is called', () => {
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowUp');
    detector.handleKeyDown('ArrowDown');
    detector.reset();

    // After reset, partial progress is lost — need full sequence
    for (let i = 0; i < KONAMI_CODE.length - 1; i++) {
      expect(detector.handleKeyDown(KONAMI_CODE[i])).toBe(false);
    }
    expect(detector.handleKeyDown(KONAMI_CODE[KONAMI_CODE.length - 1])).toBe(true);
  });

  it('should return false for random keys', () => {
    expect(detector.handleKeyDown('x')).toBe(false);
    expect(detector.handleKeyDown('Enter')).toBe(false);
    expect(detector.handleKeyDown('Space')).toBe(false);
  });

  it('should be case-sensitive for b and a keys', () => {
    // Enter everything except use uppercase B and A
    for (let i = 0; i < 8; i++) {
      detector.handleKeyDown(KONAMI_CODE[i]);
    }
    // Uppercase B should not match
    expect(detector.handleKeyDown('B')).toBe(false);
  });
});
