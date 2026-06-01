import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Compass, Layers, Lightbulb, TrendingUp } from 'lucide-react';
import TiltCard from '../ui/TiltCard';
import SectionHeading from '../ui/SectionHeading';
import { STORY, PROFILE } from '../../data/profile';

const CHAPTERS = [
  { key: 'journey', icon: Compass, accent: '#6366F1', tint: 'rgba(99,102,241,0.10)' },
  { key: 'strengths', icon: Layers, accent: '#8B5CF6', tint: 'rgba(139,92,246,0.10)' },
  { key: 'philosophy', icon: Lightbulb, accent: '#06B6D4', tint: 'rgba(6,182,212,0.10)' },
  { key: 'impact', icon: TrendingUp, accent: '#EC4899', tint: 'rgba(236,72,153,0.10)' },
] as const;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 md:px-12 lg:px-24"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-start gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Left — narrative anchor */}
        <motion.div style={{ y: yText }} className="lg:sticky lg:top-32">
          {/* Profile photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-2 border-white shadow-[0_8px_32px_rgba(99,102,241,0.15)] ring-1 ring-gray-100">
                <img
                  src={PROFILE.photoUrl}
                  alt={PROFILE.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-80 -z-10" />
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 opacity-60 -z-10" />
            </div>
          </motion.div>

          <SectionHeading
            eyebrow="About"
            title={
              <>
                I turn <span className="text-gradient">messy data</span> into intelligent products.
              </>
            }
            description="I'm Umang Jaiswal — an AI/ML engineer who works the full stack of intelligence, from raw data to the interface a human actually touches."
          />

          <div className="mt-10 flex flex-col gap-4">
            {[
              ['8.01', 'CGPA · M.Sc. (Integrated)'],
              ['11+', 'Products shipped end to end'],
              ['6', 'Awards & publications'],
            ].map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-4">
                <span className="font-display text-3xl font-semibold text-gradient tabular-nums">{value}</span>
                <span className="text-sm text-ink-soft">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {PROFILE.location}
          </p>
        </motion.div>

        {/* Right — story chapters as 3D glass cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CHAPTERS.map(({ key, icon: Icon, accent, tint }, i) => {
            const chapter = STORY[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                className={i % 2 === 1 ? 'sm:mt-10' : ''}
              >
                <TiltCard spotlightColor={tint} className="h-full">
                  <div
                    className="flex h-full flex-col rounded-3xl border border-line bg-white/75 p-8 backdrop-blur-xl"
                    style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.06)' }}
                  >
                    <div
                      className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background: tint, color: accent }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-3 font-display text-xl font-semibold text-ink">{chapter.title}</h3>
                    <p className="text-[15px] leading-relaxed text-ink-soft">{chapter.body}</p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
