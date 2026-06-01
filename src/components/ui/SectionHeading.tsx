import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  dot?: boolean;
}

/**
 * Consistent section header: pill eyebrow → display title → subdued description.
 * Animates in once on scroll.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dot = true,
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${alignment} max-w-3xl`}
    >
      <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft backdrop-blur-md">
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-indigo animate-pulse" />}
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </motion.div>
  );
}
