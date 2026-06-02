import { useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../store/portfolioStore';
import { checkIsMobile } from './useIsMobile';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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
    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      return sectionId;
    }
  }

  return SECTION_IDS[0];
}

export interface ScrollEngineOptions {
  /** Whether to enable smooth scrolling on touch devices. Default: true */
  syncTouch?: boolean;
}

/**
 * Custom hook that initializes the Lenis smooth scroll engine with GSAP ScrollTrigger integration.
 *
 * Uses lerp-based smoothing (not duration-based) for immediate, responsive, buttery feel.
 * Lerp = linear interpolation per frame — higher values = snappier response.
 *
 * - Desktop: lerp 0.12 → ~60ms response time, feels instant but smooth
 * - Mobile: native scroll (no Lenis smoothing) for best feel
 */
export function useScrollEngine(options: ScrollEngineOptions = {}) {
  const { syncTouch = false } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const setScrollPosition = usePortfolioStore((state) => state.setScrollPosition);
  const setCurrentSection = usePortfolioStore((state) => state.setCurrentSection);
  const lastSectionRef = useRef<string>('hero');

  useEffect(() => {
    const isMobile = checkIsMobile();

    // Lerp-based Lenis: no duration, just pure interpolation.
    // Higher lerp = snappier. 0.12 is the sweet spot for "buttery but responsive".
    const lenis = new Lenis({
      lerp: isMobile ? 0.15 : 0.12,
      smoothWheel: true,
      syncTouch: isMobile ? false : syncTouch,
      touchMultiplier: isMobile ? 1.5 : 2,
      wheelMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // Throttle section detection — no need to check every single frame
    let sectionCheckPending = false;

    lenis.on('scroll', (e: { scroll: number; progress: number }) => {
      ScrollTrigger.update();
      setScrollPosition(e.scroll);

      // Throttle section detection to once per ~3 frames
      if (!sectionCheckPending) {
        sectionCheckPending = true;
        requestAnimationFrame(() => {
          const section = getCurrentSection();
          if (section !== lastSectionRef.current) {
            lastSectionRef.current = section;
            setCurrentSection(section);
          }
          sectionCheckPending = false;
        });
      }
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

    ScrollTrigger.defaults({
      scroller: document.documentElement,
    });

    // RAF loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    rafIdRef.current = requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [syncTouch, setScrollPosition, setCurrentSection]);

  /**
   * Programmatically scroll to a target element, position, or selector.
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
          duration: options?.duration ?? 0.8,
          onComplete: options?.onComplete
            ? () => options.onComplete?.()
            : undefined,
        });
      }
    },
    []
  );

  return {
    scrollTo,
    lenis: lenisRef,
  };
}

export default useScrollEngine;
