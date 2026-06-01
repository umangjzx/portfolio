import type { GPUTier } from '../types';

/**
 * GPU Detector Service
 *
 * Detects GPU capability using WebGL renderer info and returns
 * a performance tier ('high' or 'low') to drive adaptive rendering.
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
 * Checks for known high-end GPU keywords (case-insensitive).
 */
function classifyRenderer(renderer: string | null): GPUTier {
  if (!renderer) {
    return 'low';
  }

  const lowerRenderer = renderer.toLowerCase();
  const isHighEnd = HIGH_END_GPU_KEYWORDS.some((keyword) =>
    lowerRenderer.includes(keyword)
  );

  return isHighEnd ? 'high' : 'low';
}

function createGPUDetector(): GPUDetectorService {
  return {
    /**
     * Detects the GPU tier by reading WebGL renderer info.
     * Defaults to 'low' if detection fails (Requirement 15.7).
     */
    detect(): GPUTier {
      const renderer = getRendererInfo();
      return classifyRenderer(renderer);
    },

    /**
     * Returns the recommended particle count for the given tier.
     * High tier: 1500 particles for rich visual effects.
     * Low tier: 300 particles for acceptable performance.
     */
    getParticleCount(tier: GPUTier): number {
      return tier === 'high' ? 1500 : 300;
    },

    /**
     * Determines whether 3D background effects should be enabled.
     * High tier: enabled (Requirement 15.1 - 60 FPS target).
     * Low tier: disabled (Requirement 15.5 - reduce to maintain 30 FPS).
     */
    shouldEnable3D(tier: GPUTier): boolean {
      return tier === 'high';
    },
  };
}

/** Singleton GPU detector instance */
export const gpuDetector: GPUDetectorService = createGPUDetector();

// Export internals for testing
export { getRendererInfo, classifyRenderer, HIGH_END_GPU_KEYWORDS };
