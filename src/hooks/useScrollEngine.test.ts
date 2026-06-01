import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

/**
 * Unit tests for the useScrollEngine hook.
 *
 * Since the hook relies heavily on browser APIs (Lenis, GSAP ScrollTrigger, DOM elements,
 * requestAnimationFrame), we test the pure utility functions and verify the hook's
 * integration behavior through mocking.
 */

// Mock Lenis
const mockLenisOn = vi.fn();
const mockLenisOff = vi.fn();
const mockLenisDestroy = vi.fn();
const mockLenisRaf = vi.fn();
const mockLenisScrollTo = vi.fn();
const mockLenisInstance = {
  on: mockLenisOn,
  off: mockLenisOff,
  destroy: mockLenisDestroy,
  raf: mockLenisRaf,
  scrollTo: mockLenisScrollTo,
  scroll: 0,
};

vi.mock('@studio-freight/lenis', () => ({
  default: vi.fn(function () {
    return mockLenisInstance;
  }),
}));

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

// Mock ScrollTrigger
const mockSTUpdate = vi.fn();
const mockSTRefresh = vi.fn();
const mockSTScrollerProxy = vi.fn();
const mockSTDefaults = vi.fn();
const mockSTGetAll = vi.fn(() => []);

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    update: mockSTUpdate,
    refresh: mockSTRefresh,
    scrollerProxy: mockSTScrollerProxy,
    defaults: mockSTDefaults,
    getAll: mockSTGetAll,
  },
}));

// Mock Zustand store
const mockSetScrollPosition = vi.fn();
const mockSetCurrentSection = vi.fn();

vi.mock('../store/portfolioStore', () => ({
  usePortfolioStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({
      setScrollPosition: mockSetScrollPosition,
      setCurrentSection: mockSetCurrentSection,
    }),
}));

describe('useScrollEngine', () => {
  let rafCallbacks: ((time: number) => void)[] = [];
  let originalRAF: typeof requestAnimationFrame;
  let originalCAF: typeof cancelAnimationFrame;

  beforeEach(async () => {
    vi.clearAllMocks();
    rafCallbacks = [];

    // Mock requestAnimationFrame
    originalRAF = globalThis.requestAnimationFrame;
    originalCAF = globalThis.cancelAnimationFrame;
    globalThis.requestAnimationFrame = vi.fn((cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    }) as unknown as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = vi.fn();

    // Mock document.getElementById for section detection
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
  });

  afterEach(() => {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    vi.restoreAllMocks();
  });

  it('should initialize Lenis with correct configuration', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    const Lenis = (await import('@studio-freight/lenis')).default;
    expect(Lenis).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
      })
    );
  });

  it('should accept custom duration option', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine({ duration: 2.0 }));

    const Lenis = (await import('@studio-freight/lenis')).default;
    expect(Lenis).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 2.0,
      })
    );
  });

  it('should register scroll event listener on Lenis', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    expect(mockLenisOn).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should set up GSAP ScrollTrigger scroller proxy', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    expect(mockSTScrollerProxy).toHaveBeenCalledWith(
      document.documentElement,
      expect.objectContaining({
        scrollTop: expect.any(Function),
        getBoundingClientRect: expect.any(Function),
      })
    );
  });

  it('should start requestAnimationFrame loop', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('should call Lenis raf in the animation loop', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    // Simulate a frame
    if (rafCallbacks.length > 0) {
      rafCallbacks[0](16.67);
      expect(mockLenisRaf).toHaveBeenCalledWith(16.67);
    }
  });

  it('should refresh ScrollTrigger after initialization', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    expect(mockSTRefresh).toHaveBeenCalled();
  });

  it('should clean up on unmount', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const { unmount } = renderHook(() => useScrollEngine());

    unmount();

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
    expect(mockLenisDestroy).toHaveBeenCalled();
    expect(mockSTGetAll).toHaveBeenCalled();
  });

  it('should provide a scrollTo function', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const { result } = renderHook(() => useScrollEngine());

    expect(result.current.scrollTo).toBeInstanceOf(Function);
  });

  it('should call Lenis scrollTo when scrollTo is invoked', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const { result } = renderHook(() => useScrollEngine());

    act(() => {
      result.current.scrollTo('#about');
    });

    expect(mockLenisScrollTo).toHaveBeenCalledWith(
      '#about',
      expect.objectContaining({
        duration: 1.2,
      })
    );
  });

  it('should call Lenis scrollTo with custom options', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const { result } = renderHook(() => useScrollEngine());

    act(() => {
      result.current.scrollTo(500, { offset: -100, duration: 2.0 });
    });

    expect(mockLenisScrollTo).toHaveBeenCalledWith(
      500,
      expect.objectContaining({
        offset: -100,
        duration: 2.0,
      })
    );
  });

  it('should provide a lenis ref', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const { result } = renderHook(() => useScrollEngine());

    expect(result.current.lenis).toBeDefined();
    expect(result.current.lenis.current).toBe(mockLenisInstance);
  });

  it('should update scroll position in store on scroll event', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    // Get the scroll callback that was registered
    const scrollCallback = mockLenisOn.mock.calls.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (call: any) => call[0] === 'scroll'
    )?.[1];

    expect(scrollCallback).toBeDefined();

    // Simulate a scroll event
    if (scrollCallback) {
      scrollCallback({ scroll: 250, progress: 0.5 });
      expect(mockSetScrollPosition).toHaveBeenCalledWith(250);
      expect(mockSTUpdate).toHaveBeenCalled();
    }
  });

  it('should update current section in store on scroll event', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    renderHook(() => useScrollEngine());

    // Get the scroll callback
    const scrollCallback = mockLenisOn.mock.calls.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (call: any) => call[0] === 'scroll'
    )?.[1];

    if (scrollCallback) {
      scrollCallback({ scroll: 100, progress: 0.1 });
      expect(mockSetCurrentSection).toHaveBeenCalled();
    }
  });
});

describe('cubicBezierEasing (via Lenis constructor)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.requestAnimationFrame = vi.fn(() => 1) as unknown as typeof requestAnimationFrame;
    globalThis.cancelAnimationFrame = vi.fn();
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass an easing function to Lenis', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const Lenis = (await import('@studio-freight/lenis')).default;

    renderHook(() => useScrollEngine());

    const lenisCall = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(lenisCall.easing).toBeInstanceOf(Function);
  });

  it('should produce values between 0 and 1 for the easing function', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const Lenis = (await import('@studio-freight/lenis')).default;

    renderHook(() => useScrollEngine());

    const lenisCall = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const easing = lenisCall.easing;

    // Test at various points
    expect(easing(0)).toBeGreaterThanOrEqual(0);
    expect(easing(0.25)).toBeGreaterThanOrEqual(0);
    expect(easing(0.25)).toBeLessThanOrEqual(1);
    expect(easing(0.5)).toBeGreaterThanOrEqual(0);
    expect(easing(0.5)).toBeLessThanOrEqual(1);
    expect(easing(0.75)).toBeGreaterThanOrEqual(0);
    expect(easing(0.75)).toBeLessThanOrEqual(1);
    expect(easing(1)).toBeLessThanOrEqual(1);
  });

  it('should return 1 at t=1 for the easing function', async () => {
    const { useScrollEngine } = await import('./useScrollEngine');
    const Lenis = (await import('@studio-freight/lenis')).default;

    renderHook(() => useScrollEngine());

    const lenisCall = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    const easing = lenisCall.easing;

    expect(easing(1)).toBe(1);
  });
});
