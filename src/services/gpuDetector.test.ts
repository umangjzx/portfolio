import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { gpuDetector, classifyRenderer, HIGH_END_GPU_KEYWORDS } from './gpuDetector';

describe('GPUDetectorService', () => {
  describe('classifyRenderer', () => {
    it('should return "low" when renderer is null', () => {
      expect(classifyRenderer(null)).toBe('low');
    });

    it('should return "high" for NVIDIA GPUs', () => {
      expect(classifyRenderer('NVIDIA GeForce RTX 3080')).toBe('high');
      expect(classifyRenderer('NVIDIA GeForce GTX 1660')).toBe('high');
      expect(classifyRenderer('NVIDIA Quadro P4000')).toBe('high');
    });

    it('should return "high" for AMD GPUs', () => {
      expect(classifyRenderer('AMD Radeon RX 6800 XT')).toBe('high');
      expect(classifyRenderer('AMD Radeon Pro 5500M')).toBe('high');
    });

    it('should return "high" for Apple Silicon GPUs', () => {
      expect(classifyRenderer('Apple M1')).toBe('high');
      expect(classifyRenderer('Apple M2 Pro')).toBe('high');
      expect(classifyRenderer('Apple M3 Max')).toBe('high');
      expect(classifyRenderer('Apple GPU')).toBe('high');
    });

    it('should return "high" for Intel Iris Xe', () => {
      expect(classifyRenderer('Intel Iris Xe Graphics')).toBe('high');
    });

    it('should return "high" for Intel Arc', () => {
      expect(classifyRenderer('Intel Arc A770')).toBe('high');
    });

    it('should return "low" for integrated Intel HD graphics', () => {
      expect(classifyRenderer('Intel HD Graphics 630')).toBe('low');
      expect(classifyRenderer('Intel UHD Graphics 620')).toBe('low');
    });

    it('should return "low" for unknown renderer strings', () => {
      expect(classifyRenderer('Unknown GPU')).toBe('low');
      expect(classifyRenderer('Mesa DRI Intel')).toBe('low');
      expect(classifyRenderer('ANGLE (Google Swiftshader)')).toBe('low');
    });

    it('should be case-insensitive', () => {
      expect(classifyRenderer('nvidia geforce rtx 4090')).toBe('high');
      expect(classifyRenderer('APPLE M2')).toBe('high');
      expect(classifyRenderer('Amd Radeon RX 7900')).toBe('high');
    });
  });

  describe('getParticleCount', () => {
    it('should return 1500 for high tier', () => {
      expect(gpuDetector.getParticleCount('high')).toBe(1500);
    });

    it('should return 300 for low tier', () => {
      expect(gpuDetector.getParticleCount('low')).toBe(300);
    });
  });

  describe('shouldEnable3D', () => {
    it('should return true for high tier', () => {
      expect(gpuDetector.shouldEnable3D('high')).toBe(true);
    });

    it('should return false for low tier', () => {
      expect(gpuDetector.shouldEnable3D('low')).toBe(false);
    });
  });

  describe('detect', () => {
    let originalCreateElement: typeof document.createElement;

    beforeEach(() => {
      originalCreateElement = document.createElement.bind(document);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return "low" when WebGL is not available', () => {
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement('canvas');
          vi.spyOn(canvas, 'getContext').mockReturnValue(null);
          return canvas;
        }
        return originalCreateElement(tag);
      });

      expect(gpuDetector.detect()).toBe('low');
    });

    it('should return "low" when debug extension is not available', () => {
      const mockGl = {
        getExtension: vi.fn().mockReturnValue(null),
        getParameter: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement('canvas');
          vi.spyOn(canvas, 'getContext').mockReturnValue(mockGl as unknown as RenderingContext);
          return canvas;
        }
        return originalCreateElement(tag);
      });

      expect(gpuDetector.detect()).toBe('low');
    });
  });

  describe('HIGH_END_GPU_KEYWORDS', () => {
    it('should contain expected GPU vendor keywords', () => {
      expect(HIGH_END_GPU_KEYWORDS).toContain('nvidia');
      expect(HIGH_END_GPU_KEYWORDS).toContain('amd');
      expect(HIGH_END_GPU_KEYWORDS).toContain('radeon');
      expect(HIGH_END_GPU_KEYWORDS).toContain('apple m1');
      expect(HIGH_END_GPU_KEYWORDS).toContain('apple m2');
      expect(HIGH_END_GPU_KEYWORDS).toContain('apple m3');
    });
  });
});
