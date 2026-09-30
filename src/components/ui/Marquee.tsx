import { useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

export interface MarqueeProps {
  items: ReactNode[];
  /** Seconds for one full loop. */
  duration?: number;
  label: string;
}

/**
 * Infinite horizontal marquee (adapted from Magic UI's "Marquee").
 * The track is rendered twice and translated by exactly one copy plus the
 * gap, so the loop is seamless. Edges fade via mask-image; it pauses on
 * hover/focus and has an explicit pause button (WCAG 2.2.2 — moving content
 * longer than 5s must be pausable). Under reduced motion it is a static row
 * that can be swiped or scrolled with the keyboard (hence tabIndex).
 */
export default function Marquee({ items, duration = 45, label }: MarqueeProps) {
  const [paused, setPaused] = useState(false);

  const track = (hidden: boolean) => (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="shrink-0">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative">
      <div
        className="marquee rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        data-paused={paused || undefined}
        style={{ ['--duration' as string]: `${duration}s` }}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {track(false)}
        {track(true)}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        aria-pressed={paused}
        className="marquee__toggle absolute -bottom-9 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/80 text-ink-soft transition-colors hover:text-accent-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
      </button>
    </div>
  );
}
