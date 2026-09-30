import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getServerSnapshot = () => false;

/**
 * Hook that detects `prefers-reduced-motion: reduce` media query.
 * Returns true if the user has requested reduced motion.
 * Reactively updates if the preference changes at runtime.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, checkReducedMotion, getServerSnapshot);
}

/** Static check — use in non-React contexts */
export function checkReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}
