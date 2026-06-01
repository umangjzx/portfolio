import { useState, useEffect } from 'react';

/**
 * Centralized mobile detection hook.
 *
 * Uses a consistent breakpoint (768px) and listens for resize events
 * so components react to orientation changes and window resizing.
 *
 * Also exposes a static helper for non-hook contexts (e.g., Canvas setup).
 */

const MOBILE_BREAKPOINT = 768;

/** Static check — use in non-React contexts or initial render */
export function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/** Reactive hook — re-renders on resize/orientation change */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(checkIsMobile);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial value from media query (handles SSR hydration edge case)
    setIsMobile(mql.matches);

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
