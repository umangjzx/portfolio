import { useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../store/portfolioStore';
import { checkIsMobile } from './useIsMobile';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Cubic-bezier(0.25, 0.0, 0.35, 1.0) easing function approximation.
 * Uses the exponential decay formula that closely matches the specified curve.
 * Ensures exact boundary values: 0 at t=0 and 1 at t>=1.
 */
function cubicBezierEasing(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

/**
 * Section IDs used for determining the current section based on scroll position.
 * These correspond to the section elements rendered in the DOM.
 */
const SECTION_IDS = [
  'hero',
  'about',
  'skills',
  'projects',
  'experience',
  'ai-lab',
  'testimonials',
  'contact',
] as const;

/**
 * Determines the current section based on scroll position by checking
 * which section element occupies the most viewport space.
 */
function getCurrentSection(): string {
  const viewportHeight = window.innerHeight;
  const viewportCenter = viewportHeight / 2;

  for (const sectionId of SECTION_IDS) {
    const element = document.getElementById(sectionId);
    if (!element) continue;

    const rect = element.getBoundingClientRect();
    // A section is "current" if its top is above the viewport center
    // and its bottom is below the viewport center
    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      return sectionId;
    }
  }

  // Fallback: if no section matches, return the first one
  return SECTION_IDS[0];
}

export interface ScrollEngineOptions {
  /** Scroll duration in seconds. Default: 1.2 */
  duration?: number;
  /** Custom easing function. Default: cubic-bezier(0.25, 0.0, 0.35, 1.0) approximation */
  easing?: (t: number) => number;
  /** Whether to enable smooth scrolling on touch devices. Default: true */
  syncTouch?: boolean;
}

/**
 * Custom hook that initializes the Lenis smooth scroll engine with GSAP ScrollTrigger integration.
 *
 * Features:
 * - Smooth scrolling with duration 1.2s and cubic-bezier(0.25, 0.0, 0.35, 1.0) easing
 * - GSAP ScrollTrigger integration for section-based animations
 * - Zustand store updates with scroll position and current section
 * - Supports both mouse wheel and touch-based scrolling with identical behavior
 * - requestAnimationFrame loop for Lenis
 * - Proper cleanup on unmount
 *
 * @param options - Optional configuration overrides
 * @returns Object with scrollTo utility function and lenis instance ref
 */
export function useScrollEngine(options: ScrollEngineOptions = {}) {
  const {
    duration = 1.2,
    easing = cubicBezierEasing,
    syncTouch = true,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const setScrollPosition = usePortfolioStore((state) => state.setScrollPosition);
  const setCurrentSection = usePortfolioStore((state) => state.setCurrentSection);

  useEffect(() => {
    const isMobile = checkIsMobile();

    // Initialize Lenis with specified configuration
    // On mobile: disable syncTouch to use native scroll (much smoother),
    // reduce duration, and lower multiplier to avoid fighting the OS.
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : duration,
      easing,
      smoothWheel: true,
      syncTouch: isMobile ? false : syncTouch,
      touchMultiplier: isMobile ? 1 : 2,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', (e: { scroll: number; progress: number }) => {
      // Update GSAP ScrollTrigger on each Lenis scroll event
      ScrollTrigger.update();

      // Update Zustand store with current scroll position
      setScrollPosition(e.scroll);

      // Determine and update current section
      const section = getCurrentSection();
      setCurrentSection(section);
    });

    // Connect GSAP ScrollTrigger's scrollerProxy to Lenis
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value?: number) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Tell ScrollTrigger to use Lenis's scroll position
    ScrollTrigger.defaults({
      scroller: document.documentElement,
    });

    // requestAnimationFrame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);

    // Refresh ScrollTrigger after Lenis is set up
    ScrollTrigger.refresh();

    // Cleanup on unmount
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      lenis.destroy();
      lenisRef.current = null;

      // Kill all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration, easing, syncTouch, setScrollPosition, setCurrentSection]);

  /**
   * Programmatically scroll to a target element, position, or selector.
   * Uses the same duration and easing as manual scrolling for consistency.
   */
  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: {
        offset?: number;
        immediate?: boolean;
        duration?: number;
        onComplete?: () => void;
      }
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          offset: options?.offset,
          immediate: options?.immediate,
          duration: options?.duration ?? duration,
          easing,
          onComplete: options?.onComplete
            ? () => options.onComplete?.()
            : undefined,
        });
      }
    },
    [duration, easing]
  );

  return {
    scrollTo,
    lenis: lenisRef,
  };
}

export default useScrollEngine;
