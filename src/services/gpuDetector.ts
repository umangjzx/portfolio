import type { GPUTier } from '../types';

/**
 * GPU Detector Service
 *
 * Detects GPU capability using WebGL renderer info and returns
 * a performance tier ('high', 'mid', or 'low') to drive adaptive rendering.
 * Also factors in hardware concurrency (CPU cores) and device memory for
 * a more accurate classification on laptops without dedicated GPUs.
 *
 * Requirements: 15.1, 15.5, 15.7
 */

/** Known high-end GPU keywords used for tier classification */
const HIGH_END_GPU_KEYWORDS = [
  'nvidia',
  'geforce',
  'rtx',
  'gtx',
  'quadro',
  'amd',
  'radeon',
  'rx ',
  'apple m1',
  'apple m2',
  'apple m3',
  'apple m4',
  'apple gpu',
  'intel iris xe',
  'intel arc',
];

/** Known integrated/low-end GPU keywords */
const LOW_END_GPU_KEYWORDS = [
  'intel hd',
  'intel uhd',
  'mesa',
  'swiftshader',
  'llvmpipe',
  'software',
  'microsoft basic',
];

export interface GPUDetectorService {
  detect(): GPUTier;
  getParticleCount(tier: GPUTier): number;
  shouldEnable3D(tier: GPUTier): boolean;
}

/**
 * Attempts to retrieve the GPU renderer string via WebGL.
 * Returns null if WebGL is unavailable or the debug extension is not supported.
 */
function getRendererInfo(): string | null {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      return null;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return null;
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return typeof renderer === 'string' ? renderer : null;
  } catch {
    return null;
  }
}

/**
 * Determines GPU tier based on the renderer string.
 * Now returns 'high', 'mid', or 'low' for more granular performance scaling.
 */
function classifyRenderer(renderer: string | null): GPUTier {
  if (!renderer) {
    return 'low';
  }

  const lowerRenderer = renderer.toLowerCase();

  // Check for known low-end/software renderers first
  const isLowEnd = LOW_END_GPU_KEYWORDS.some((keyword) =>
    lowerRenderer.includes(keyword)
  );
  if (isLowEnd) return 'low';

  const isHighEnd = HIGH_END_GPU_KEYWORDS.some((keyword) =>
    lowerRenderer.includes(keyword)
  );

  if (isHighEnd) {
    // Further distinguish: RTX/M-series = high, older dedicated = mid
    const isPremium = /rtx|apple m[2-9]|apple m\d{2}|rx [67]\d{2,}/i.test(renderer);
    return isPremium ? 'high' : 'high';
  }

  // Unknown GPU (likely integrated) — classify as mid
  return 'mid';
}

/**
 * Detects if the device is mobile based on screen width.
 * Mobile devices are forced to 'low' tier regardless of GPU capability
 * to preserve battery and prevent thermal throttling.
 */
function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Use hardware concurrency and device memory as additional signals.
 * Many laptops have decent CPUs but weak integrated GPUs.
 */
function getHardwareScore(): 'high' | 'mid' | 'low' {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4 && memory >= 4) return 'mid';
  return 'low';
}

function createGPUDetector(): GPUDetectorService {
  return {
    /**
     * Detects the GPU tier by reading WebGL renderer info.
     * Mobile devices are always classified as 'low' regardless of GPU.
     * Defaults to 'low' if detection fails (Requirement 15.7).
     */
    detect(): GPUTier {
      // Force low tier on mobile to preserve battery and performance
      if (isMobileDevice()) {
        return 'low';
      }

      const renderer = getRendererInfo();
      const gpuTier = classifyRenderer(renderer);
      const hwScore = getHardwareScore();

      // Combine signals: downgrade if hardware is weak, upgrade mid if hardware is strong
      if (gpuTier === 'high' && hwScore === 'low') return 'mid';
      if (gpuTier === 'mid' && hwScore === 'high') return 'mid'; // Don't promote unknown GPU
      if (gpuTier === 'low') return 'low';

      return gpuTier;
    },

    /**
     * Returns the recommended particle count for the given tier.
     * High tier: 1500 particles for rich visual effects.
     * Mid tier: 800 particles for decent visuals without jank.
     * Low tier: 300 particles for acceptable performance.
     */
    getParticleCount(tier: GPUTier): number {
      if (tier === 'high') return 1500;
      if (tier === 'mid') return 800;
      return 300;
    },

    /**
     * Determines whether 3D background effects should be enabled.
     * High tier: enabled (Requirement 15.1 - 60 FPS target).
     * Mid tier: enabled with reduced quality.
     * Low tier: disabled (Requirement 15.5 - reduce to maintain 30 FPS).
     */
    shouldEnable3D(tier: GPUTier): boolean {
      return tier !== 'low';
    },
  };
}

/** Singleton GPU detector instance */
export const gpuDetector: GPUDetectorService = createGPUDetector();

// Export internals for testing
export { getRendererInfo, classifyRenderer, HIGH_END_GPU_KEYWORDS, LOW_END_GPU_KEYWORDS, getHardwareScore };
