import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePerformance } from './usePerformance';
import { usePortfolioStore } from '../store/portfolioStore';
import { gpuDetector } from '../services/gpuDetector';

describe('usePerformance', () => {
  beforeEach(() => {
    // Reset Zustand store to default state before each test
    usePortfolioStore.setState({ gpuTier: 'low' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should run GPU detection on mount and store tier in Zustand', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('high');

    const { result } = renderHook(() => usePerformance());

    expect(gpuDetector.detect).toHaveBeenCalledOnce();
    expect(result.current.gpuTier).toBe('high');
    expect(usePortfolioStore.getState().gpuTier).toBe('high');
  });

  it('should return correct particle count for high tier', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('high');

    const { result } = renderHook(() => usePerformance());

    expect(result.current.particleCount).toBe(1500);
  });

  it('should return correct particle count for low tier', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('low');

    const { result } = renderHook(() => usePerformance());

    expect(result.current.particleCount).toBe(300);
  });

  it('should enable 3D for high tier', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('high');

    const { result } = renderHook(() => usePerformance());

    expect(result.current.enable3D).toBe(true);
  });

  it('should disable 3D for low tier', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('low');

    const { result } = renderHook(() => usePerformance());

    expect(result.current.enable3D).toBe(false);
  });

  it('should only run detection once on mount', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('high');

    const { rerender } = renderHook(() => usePerformance());

    rerender();
    rerender();

    expect(gpuDetector.detect).toHaveBeenCalledOnce();
  });

  it('should react to external gpuTier changes in the store', () => {
    vi.spyOn(gpuDetector, 'detect').mockReturnValue('low');

    const { result } = renderHook(() => usePerformance());

    expect(result.current.gpuTier).toBe('low');
    expect(result.current.particleCount).toBe(300);
    expect(result.current.enable3D).toBe(false);

    // Simulate external store change
    act(() => {
      usePortfolioStore.getState().setGpuTier('high');
    });

    expect(result.current.gpuTier).toBe('high');
    expect(result.current.particleCount).toBe(1500);
    expect(result.current.enable3D).toBe(true);
  });

  it('should default to low tier when detection fails', () => {
    // gpuDetector.detect() returns 'low' when WebGL is unavailable (jsdom)
    const { result } = renderHook(() => usePerformance());

    expect(result.current.gpuTier).toBe('low');
    expect(result.current.particleCount).toBe(300);
    expect(result.current.enable3D).toBe(false);
  });
});
