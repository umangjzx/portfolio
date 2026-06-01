import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMouseTracker,
  normalizeX,
  normalizeY,
  NEUTRAL_POSITION,
} from './mouseTracker';

describe('MouseTrackerService', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  describe('normalizeX', () => {
    it('should return -1 at left edge', () => {
      expect(normalizeX(0, 1000)).toBeCloseTo(-1);
    });

    it('should return 0 at center', () => {
      expect(normalizeX(500, 1000)).toBeCloseTo(0);
    });

    it('should return 1 at right edge', () => {
      expect(normalizeX(1000, 1000)).toBeCloseTo(1);
    });
  });

  describe('normalizeY', () => {
    it('should return 1 at top edge', () => {
      expect(normalizeY(0, 800)).toBeCloseTo(1);
    });

    it('should return 0 at center', () => {
      expect(normalizeY(400, 800)).toBeCloseTo(0);
    });

    it('should return -1 at bottom edge', () => {
      expect(normalizeY(800, 800)).toBeCloseTo(-1);
    });
  });

  describe('non-touch device behavior', () => {
    it('should report isTouch as false', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });
      expect(tracker.isTouch()).toBe(false);
    });

    it('should return initial neutral position before any mouse movement', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });
      const pos = tracker.getPosition();
      expect(pos).toEqual(NEUTRAL_POSITION);
    });

    it('should update position on mousemove events', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });

      const event = new MouseEvent('mousemove', { clientX: 500, clientY: 400 });
      window.dispatchEvent(event);

      const pos = tracker.getPosition();
      expect(pos.x).toBe(500);
      expect(pos.y).toBe(400);
      expect(pos.normalizedX).toBeCloseTo(0);
      expect(pos.normalizedY).toBeCloseTo(0);
    });

    it('should compute normalized coordinates for top-left corner', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));

      const pos = tracker.getPosition();
      expect(pos.normalizedX).toBeCloseTo(-1);
      expect(pos.normalizedY).toBeCloseTo(1);
    });

    it('should compute normalized coordinates for bottom-right corner', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1000, clientY: 800 }));

      const pos = tracker.getPosition();
      expect(pos.normalizedX).toBeCloseTo(1);
      expect(pos.normalizedY).toBeCloseTo(-1);
    });

    it('should notify subscribers on mouse move', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });
      const callback = vi.fn();
      tracker.subscribe(callback);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250, clientY: 200 }));

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ x: 250, y: 200 })
      );
    });

    it('should support multiple subscribers', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      tracker.subscribe(callback1);
      tracker.subscribe(callback2);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe correctly when calling the returned function', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });
      const callback = vi.fn();
      const unsubscribe = tracker.subscribe(callback);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a copy of position to prevent external mutation', () => {
      const tracker = createMouseTracker({ isTouchDevice: false });

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 300 }));

      const pos1 = tracker.getPosition();
      const pos2 = tracker.getPosition();

      expect(pos1).toEqual(pos2);
      expect(pos1).not.toBe(pos2);
    });
  });

  describe('touch device behavior', () => {
    it('should report isTouch as true', () => {
      const tracker = createMouseTracker({ isTouchDevice: true });
      expect(tracker.isTouch()).toBe(true);
    });

    it('should return neutral position regardless of mouse events', () => {
      const tracker = createMouseTracker({ isTouchDevice: true });

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400 }));

      const pos = tracker.getPosition();
      expect(pos).toEqual(NEUTRAL_POSITION);
    });

    it('should not notify subscribers on mouse move', () => {
      const tracker = createMouseTracker({ isTouchDevice: true });
      const callback = vi.fn();
      tracker.subscribe(callback);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400 }));

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
