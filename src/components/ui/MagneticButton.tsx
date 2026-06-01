import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react';
import { motion } from 'framer-motion';

export interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  download?: boolean;
  /** magnetic pull strength in px */
  strength?: number;
}

/**
 * A button/link with a magnetic hover (it leans toward the cursor) plus a
 * sheen sweep. Respects prefers-reduced-motion by simply not translating.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  external,
  className = '',
  ariaLabel,
  download,
  strength = 14,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      setOffset({
        x: (relX / rect.width) * strength * 2,
        y: (relY / rect.height) * strength * 2,
      });
    },
    [strength]
  );

  const reset = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  const base =
    'group relative inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-semibold text-[15px] overflow-hidden transition-shadow duration-300 select-none whitespace-nowrap';

  const variants: Record<string, string> = {
    primary: 'text-white',
    secondary: 'text-ink border border-line bg-white/80 backdrop-blur-md hover:border-indigo',
    ghost: 'text-ink-soft hover:text-ink',
  };

  const style: CSSProperties =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6 55%, #06B6D4)',
          boxShadow: '0 10px 30px rgba(99,102,241,0.32)',
        }
      : {};

  const inner = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      animate={{ x: offset.x * 0.35, y: offset.y * 0.35 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.span>
  );

  const sheen =
    variant === 'primary' ? (
      <span className="pointer-events-none absolute inset-0 z-0 -translate-x-[120%] skew-x-12 bg-white/25 transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
    ) : null;

  const motionProps = {
    ref: ref as never,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    animate: { x: offset.x, y: offset.y },
    transition: { type: 'spring' as const, stiffness: 200, damping: 15 },
    whileTap: { scale: 0.96 },
    className: `${base} ${variants[variant]} ${className}`,
    style,
    'aria-label': ariaLabel,
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {sheen}
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type="button" onClick={onClick}>
      {sheen}
      {inner}
    </motion.button>
  );
}
