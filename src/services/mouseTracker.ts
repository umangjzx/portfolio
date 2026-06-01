import type { MousePosition } from '../types';

/**
 * MouseTrackerService
 *
 * Tracks cursor position with normalized coordinates (-1 to 1).
 * Implements pub/sub pattern for position updates.
 * Detects touch devices and disables cursor tracking accordingly.
 *
 * Validates: Requirements 2.3, 13.1, 13.5
 */

export interface MouseTrackerService {
  subscribe(callback: (pos: MousePosition) => void): () => void;
  getPosition(): MousePosition;
  isTouch(): boolean;
}

export const NEUTRAL_POSITION: MousePosition = {
  x: 0,
  y: 0,
  normalizedX: 0,
  normalizedY: 0,
};

export function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function normalizeX(x: number, viewportWidth: number): number {
  return (x / viewportWidth) * 2 - 1;
}

export function normalizeY(y: number, viewportHeight: number): number {
  return -(y / viewportHeight) * 2 + 1;
}

export interface MouseTrackerOptions {
  isTouchDevice?: boolean;
}

export function createMouseTracker(options?: MouseTrackerOptions): MouseTrackerService {
  const subscribers = new Set<(pos: MousePosition) => void>();
  let currentPosition: MousePosition = { ...NEUTRAL_POSITION };
  const touchDevice = options?.isTouchDevice ?? detectTouchDevice();

  function handleMouseMove(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;
    const nx = normalizeX(x, window.innerWidth);
    const ny = normalizeY(y, window.innerHeight);

    currentPosition = { x, y, normalizedX: nx, normalizedY: ny };

    subscribers.forEach((callback) => callback(currentPosition));
  }

  // Only attach listener on non-touch devices
  if (!touchDevice && typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove);
  }

  return {
    subscribe(callback: (pos: MousePosition) => void): () => void {
      subscribers.add(callback);

      // Return unsubscribe function
      return () => {
        subscribers.delete(callback);
      };
    },

    getPosition(): MousePosition {
      if (touchDevice) {
        return { ...NEUTRAL_POSITION };
      }
      return { ...currentPosition };
    },

    isTouch(): boolean {
      return touchDevice;
    },
  };
}

// Export as singleton instance
export const mouseTracker = createMouseTracker();
