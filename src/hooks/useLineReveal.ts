import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export interface LineRevealOptions {
  /** Reveal when scrolled into view (default) or immediately on mount. */
  onScroll?: boolean;
  /** Seconds before the first line starts. */
  delay?: number;
}

/**
 * Masked line-by-line headline reveal (GSAP SplitText).
 *
 * Lines slide up from behind a clip mask. `autoSplit` re-splits after web
 * fonts load or the container resizes, and returning the tween from
 * `onSplit` lets GSAP keep it in sync. SplitText's default `aria: 'auto'`
 * keeps the heading readable by screen readers. Skipped entirely under
 * `prefers-reduced-motion`.
 */
export function useLineReveal(
  ref: RefObject<HTMLElement | null>,
  { onScroll = true, delay = 0 }: LineRevealOptions = {}
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.09,
            delay,
            scrollTrigger: onScroll ? { trigger: el, start: 'top 88%', once: true } : undefined,
          }),
      });
    });

    return () => mm.revert();
  }, [ref, onScroll, delay]);
}
