import { useSyncExternalStore } from 'react';

/**
 * Centralized mobile detection hook.
 *
 * Uses a consistent breakpoint (768px) and subscribes to a media query
 * so components react to orientation changes and window resizing.
 *
 * Also exposes a static helper for non-hook contexts (e.g., Canvas setup).
 */

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

/** Static check — use in non-React contexts or initial render */
export function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** Reactive hook — re-renders on resize/orientation change */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
