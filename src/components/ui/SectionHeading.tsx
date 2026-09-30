import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLineReveal } from '../../hooks/useLineReveal';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  dot?: boolean;
}

/**
 * Consistent section header: pill eyebrow → display title → subdued description.
 * Eyebrow/description fade up; the title reveals line-by-line via GSAP SplitText.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dot = true,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  const titleRef = useRef<HTMLHeadingElement>(null);
  useLineReveal(titleRef);

  return (
    <div className={`flex flex-col ${alignment} max-w-3xl`}>
      <motion.span
        {...fadeUp}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft backdrop-blur-md"
      >
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-indigo animate-pulse" />}
        {eyebrow}
      </motion.span>
      <h2
        ref={titleRef}
        className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {description && (
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
          className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-ink-soft"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
