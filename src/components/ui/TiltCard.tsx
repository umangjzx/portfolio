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
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

/**
 * 3D tilt card with optional cursor spotlight. Uses the shared, unit-tested
 * computeTilt() so geometry stays consistent and verifiable. Disables tilt
 * under prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  className = '',
  style,
  intensity = 1,
  spotlight = true,
  spotlightColor = 'rgba(99,102,241,0.14)',
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

  const reset = useCallback(() => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, lightX: 50, lightY: 50 });
  }, []);

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        className="relative h-full w-full rounded-3xl transition-[box-shadow,transform] duration-300 ease-out will-change-transform"
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
      </div>
    </div>
  );
}
