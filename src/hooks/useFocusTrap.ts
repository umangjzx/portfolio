import { useEffect, useRef } from 'react';

/**
 * Custom hook that traps keyboard focus within a container element.
 * When active, Tab and Shift+Tab cycle through focusable elements
 * inside the container without escaping to the rest of the page.
 *
 * @param isActive - Whether the focus trap is currently active
 * @param options - Optional configuration
 * @param options.onEscape - Callback when Escape key is pressed
 * @param options.initialFocusRef - Ref to the element that should receive focus when trap activates
 */
export function useFocusTrap(
  isActive: boolean,
  options?: {
    onEscape?: () => void;
    initialFocusRef?: React.RefObject<HTMLElement | null>;
  }
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Focus the initial element or first focusable element
    const focusInitial = () => {
      if (options?.initialFocusRef?.current) {
        options.initialFocusRef.current.focus();
      } else {
        const firstFocusable = getFocusableElements(container)[0];
        firstFocusable?.focus();
      }
    };

    // Delay to allow animations to start
    const timer = setTimeout(focusInitial, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options?.onEscape) {
        e.preventDefault();
        options.onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;

      const firstEl = focusableElements[0];
      const lastEl = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    // Prevent body scroll while trap is active
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isActive, options?.onEscape, options?.initialFocusRef]);

  return containerRef;
}

/**
 * Get all focusable elements within a container.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}
