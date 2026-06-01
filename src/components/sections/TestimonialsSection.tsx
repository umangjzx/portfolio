import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/testimonials';
import type { Testimonial } from '../../types';
import SectionHeading from '../ui/SectionHeading';

function Avatar({ t, size = 56 }: { t: Testimonial; size?: number }) {
  if (t.avatarUrl) {
    return (
      <img
        src={t.avatarUrl}
        alt={t.author}
        className="rounded-2xl object-cover"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }
  const initials = t.author
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <div
      className="flex items-center justify-center rounded-2xl font-display text-lg font-semibold text-white"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${t.accent ?? '#6366F1'}, #8B5CF6)` }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback((next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, [index]);

  const current = TESTIMONIALS[index];

  return (
    <section ref={sectionRef} id="testimonials" className="relative overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1100px]">
        <SectionHeading
          eyebrow="Collaborations"
          align="center"
          title={
            <>
              What collaborators <span className="text-gradient">actually say</span>
            </>
          }
          description="Project-anchored feedback from advisors, co-founders, and judges I've built alongside — tied to real work, not generic praise."
        />

        {/* Featured quote */}
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="relative overflow-hidden rounded-[2rem] border border-line bg-white/85 p-8 backdrop-blur-xl md:p-12"
            style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.08)' }}
          >
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-50 blur-3xl"
              style={{ background: `radial-gradient(circle, ${current.accent ?? '#6366F1'}40, transparent 70%)` }}
            />
            <Quote size={40} style={{ color: current.accent ?? '#6366F1' }} className="opacity-30" />

            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {current.context && (
                  <span
                    className="mt-4 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: `${current.accent ?? '#6366F1'}14`, color: current.accent ?? '#6366F1' }}
                  >
                    {current.context}
                  </span>
                )}
                <p className="mt-5 font-display text-2xl font-medium leading-snug text-ink md:text-[1.7rem]">
                  "{current.quote}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <Avatar t={current} />
                  <div>
                    <p className="font-semibold text-ink">{current.author}</p>
                    <p className="text-sm text-ink-soft">
                      {current.role}
                      {current.company ? ` · ${current.company}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => go(index - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft transition-all hover:border-indigo hover:text-indigo"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => go(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === index ? 28 : 8,
                    background: i === index ? (current.accent ?? '#6366F1') : '#CBD5E1',
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => go(index + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft transition-all hover:border-indigo hover:text-indigo"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* logo / context strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-80">
          {Array.from(new Set(TESTIMONIALS.map((t) => t.company).filter(Boolean))).map((company) => (
            <span key={company} className="font-display text-sm font-medium tracking-tight text-ink-muted">
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
