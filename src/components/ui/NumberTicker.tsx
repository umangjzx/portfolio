import { useEffect, useMemo, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { parseMetric } from '../../utils/computations';

/**
 * Counts a metric like "$139K+" or "11+" up from zero when scrolled into view
 * (adapted from Magic UI's "Number Ticker"). A spring drives the value and
 * writes textContent directly, so counting never re-renders React.
 * Screen readers get the final value only; reduced motion shows it instantly.
 */
export default function NumberTicker({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const parsed = useMemo(() => parseMetric(value), [value]);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });

  const animate = !!parsed && !reduced;

  useEffect(() => {
    if (animate && inView && parsed) motionValue.set(parsed.value);
  }, [animate, inView, parsed, motionValue]);

  useEffect(
    () =>
      spring.on('change', (v) => {
        if (animate && ref.current && parsed) {
          ref.current.textContent = `${parsed.prefix}${v.toFixed(parsed.decimals)}${parsed.suffix}`;
        }
      }),
    [animate, spring, parsed]
  );

  // The observed span is always rendered so useInView has a target even if
  // the reduced-motion preference changes after mount.
  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        {animate ? `${parsed.prefix}${(0).toFixed(parsed.decimals)}${parsed.suffix}` : value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
