import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react';
import { computeTilt } from '../../utils/computations';

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** max tilt scale factor; 1 = default 15deg from computeTilt */
  intensity?: number;
  /** show a cursor-tracking spotlight glow */
  spotlight?: boolean;
  spotlightColor?: string;
  /** light the card border with a cursor-following accent arc */
  glowBorder?: boolean;
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

/**
 * 3D tilt card with optional cursor spotlight and border glow (a conic
 * accent arc masked to a 1px ring, pointing at the cursor — adapted from
 * Aceternity's "Glowing Effect", which reads better on light surfaces than a
 * filled spotlight). Uses the shared, unit-tested
 * computeTilt() so geometry stays consistent and verifiable. Disables tilt
 * under prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  className = '',
  style,
  intensity = 1,
  spotlight = true,
  spotlightColor = 'rgba(98, 95, 191,0.14)',
  glowBorder = true,
  onClick,
  role,
  ariaLabel,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, lightX: 50, lightY: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const t = computeTilt(e.clientX, e.clientY, el.getBoundingClientRect());
      setTilt({
        rotateX: t.rotateX * intensity,
        rotateY: t.rotateY * intensity,
        lightX: t.lightX,
        lightY: t.lightY,
      });
    },
    [intensity]
  );

  // Clickable cards must also work from the keyboard.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onClick) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  // Angle from card centre to cursor; 0deg = straight up.
  const glowAngle = (Math.atan2(tilt.lightY - 50, tilt.lightX - 50) * 180) / Math.PI + 90;

  const reset = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, lightX: 50, lightY: 50 });
  }, []);

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <div
        ref={ref}
        role={role ?? (onClick ? 'button' : undefined)}
        tabIndex={onClick ? 0 : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        className="relative h-full w-full rounded-3xl transition-[box-shadow,transform] duration-300 ease-out will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-4"
        style={{
          transformStyle: 'preserve-3d',
          transform: hovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          ...style,
        }}
      >
        {spotlight && hovered && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(420px circle at ${tilt.lightX}% ${tilt.lightY}%, ${spotlightColor}, transparent 60%)`,
            }}
          />
        )}
        {children}
        {glowBorder && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-3xl p-px transition-opacity duration-500"
            style={{
              opacity: hovered ? 1 : 0,
              background: `conic-gradient(from ${glowAngle - 50}deg, transparent 0deg, var(--color-accent-500) 50deg, transparent 100deg)`,
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)',
            }}
          />
        )}
      </div>
    </div>
  );
}
