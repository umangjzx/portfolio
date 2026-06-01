import { useEffect } from 'react';
import { gpuDetector } from '../services/gpuDetector';
import { usePortfolioStore } from '../store/portfolioStore';

/**
 * Performance Manager Hook
 *
 * Runs GPU detection on mount and provides reactive performance
 * settings (particle count, 3D feature flag) based on the detected tier.
 * The GPU tier is stored in Zustand for global access.
 *
 * Requirements: 15.1, 15.5, 15.7
 */
export function usePerformance() {
  const gpuTier = usePortfolioStore((state) => state.gpuTier);
  const setGpuTier = usePortfolioStore((state) => state.setGpuTier);

  useEffect(() => {
    const detectedTier = gpuDetector.detect();
    setGpuTier(detectedTier);
  }, [setGpuTier]);

  return {
    gpuTier,
    particleCount: gpuDetector.getParticleCount(gpuTier),
    enable3D: gpuDetector.shouldEnable3D(gpuTier),
  };
}
