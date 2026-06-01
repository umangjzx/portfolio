import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { mouseTracker } from '../services/mouseTracker';

/**
 * Clamps a value between min and max.
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Converts degrees to radians.
 */
function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Pure utility function for computing avatar rotation from normalized cursor position.
 *
 * - Horizontal (Y-axis rotation): normalizedX * 30°, clamped to ±30°
 * - Vertical (X-axis rotation): normalizedY * 20°, clamped to ±20°
 * - Returns values in radians
 *
 * This function is exported for property-based testing.
 *
 * Validates: Requirements 2.3, 2.9
 */
export function computeAvatarRotation(
  normalizedX: number,
  normalizedY: number
): { rotationX: number; rotationY: number } {
  // Compute raw rotation in degrees
  const rawHorizontalDeg = normalizedX * 30;
  const rawVerticalDeg = normalizedY * 20;

  // Clamp to bounds
  const clampedHorizontalDeg = clamp(rawHorizontalDeg, -30, 30);
  const clampedVerticalDeg = clamp(rawVerticalDeg, -20, 20);

  // Convert to radians
  const rotationY = degToRad(clampedHorizontalDeg);
  const rotationX = degToRad(clampedVerticalDeg);

  return { rotationX, rotationY };
}

/**
 * Interpolation factor for ~100ms smoothing at 60fps.
 * At 60fps, each frame is ~16.67ms. To achieve ~100ms smoothing:
 * factor = 1 - e^(-dt / tau) where tau ≈ 100ms
 * At 60fps: factor ≈ 1 - e^(-16.67/100) ≈ 0.154
 * We use a simpler approximation: factor = dt / 100ms (clamped to [0, 1])
 */
const SMOOTHING_TAU_MS = 100;

/**
 * useAvatarRotation
 *
 * Custom hook that:
 * 1. Subscribes to the Mouse Tracker service
 * 2. Converts normalized cursor position to rotation angles (clamped)
 * 3. Applies smooth interpolation (lerp) with ~100ms delay
 * 4. Returns current interpolated { rotationX, rotationY } in radians
 * 5. On touch devices, returns { rotationX: 0, rotationY: 0 } (neutral)
 *
 * Must be used inside a React Three Fiber <Canvas> component (uses useFrame).
 *
 * Validates: Requirements 2.3, 2.9
 */
export function useAvatarRotation(): {
  rotationX: React.MutableRefObject<number>;
  rotationY: React.MutableRefObject<number>;
} {
  const targetRotationX = useRef(0);
  const targetRotationY = useRef(0);
  const currentRotationX = useRef(0);
  const currentRotationY = useRef(0);
  const isTouchDevice = useRef(false);

  // Subscribe to mouse tracker on mount
  useEffect(() => {
    isTouchDevice.current = mouseTracker.isTouch();

    // On touch devices, keep neutral rotation
    if (isTouchDevice.current) return;

    const unsubscribe = mouseTracker.subscribe((pos) => {
      const { rotationX, rotationY } = computeAvatarRotation(
        pos.normalizedX,
        pos.normalizedY
      );
      targetRotationX.current = rotationX;
      targetRotationY.current = rotationY;
    });

    return unsubscribe;
  }, []);

  // Interpolate toward target each frame
  useFrame((_, delta) => {
    if (isTouchDevice.current) {
      currentRotationX.current = 0;
      currentRotationY.current = 0;
      return;
    }

    // Compute lerp factor based on delta time for frame-rate independent smoothing
    // factor = 1 - e^(-dt / tau), where tau = SMOOTHING_TAU_MS / 1000
    const dtSeconds = Math.min(delta, 0.1); // Cap delta to avoid jumps
    const factor = 1 - Math.exp(-dtSeconds / (SMOOTHING_TAU_MS / 1000));

    currentRotationX.current +=
      (targetRotationX.current - currentRotationX.current) * factor;
    currentRotationY.current +=
      (targetRotationY.current - currentRotationY.current) * factor;
  });

  return {
    rotationX: currentRotationX,
    rotationY: currentRotationY,
  };
}
