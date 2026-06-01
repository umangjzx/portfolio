import { usePortfolioStore } from '../store/portfolioStore';

/**
 * Parallax layer speed multipliers.
 * Background: 0.3x, Midground: 0.6x, Foreground: 1.0x
 */
export const PARALLAX_MULTIPLIERS = {
  background: 0.3,
  midground: 0.6,
  foreground: 1.0,
} as const;

/**
 * Pure utility function that computes a parallax offset for a given scroll position and multiplier.
 * Exported separately for property-based testing.
 */
export function computeParallaxOffset(scrollPosition: number, multiplier: number): number {
  return scrollPosition * multiplier;
}

export interface ParallaxOffsets {
  background: number;
  midground: number;
  foreground: number;
}

/**
 * Custom hook that computes parallax layer offsets based on the current scroll position.
 *
 * Returns offsets for three depth layers:
 * - Background: moves at 0.3x scroll speed (slowest, farthest)
 * - Midground: moves at 0.6x scroll speed
 * - Foreground: moves at 1.0x scroll speed (fastest, closest)
 *
 * Requirements: 3.2, 3.5
 */
export function useParallax(): ParallaxOffsets {
  const scrollPosition = usePortfolioStore((state) => state.scrollPosition);

  return {
    background: computeParallaxOffset(scrollPosition, PARALLAX_MULTIPLIERS.background),
    midground: computeParallaxOffset(scrollPosition, PARALLAX_MULTIPLIERS.midground),
    foreground: computeParallaxOffset(scrollPosition, PARALLAX_MULTIPLIERS.foreground),
  };
}
