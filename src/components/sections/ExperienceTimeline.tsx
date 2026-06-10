import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase, GraduationCap, Award, FlaskConical, Rocket, ChevronLeft, ChevronRight, Sparkles, Users,
} from 'lucide-react';
import { MILESTONES } from '../../data/milestones';
import type { TimelineMilestone } from '../../types';
import SectionHeading from '../ui/SectionHeading';

const TYPE_META: Record<NonNullable<TimelineMilestone['type']>, { icon: typeof Briefcase; color: string; label: string }> = {
  work: { icon: Briefcase, color: '#6366F1', label: 'Work' },
  education: { icon: GraduationCap, color: '#06B6D4', label: 'Education' },
  award: { icon: Award, color: '#F59E0B', label: 'Award' },
  research: { icon: FlaskConical, color: '#8B5CF6', label: 'Research' },
  project: { icon: Rocket, color: '#EC4899', label: 'Project' },
  leadership: { icon: Users, color: '#10B981', label: 'Leadership' },
};

function meta(m: TimelineMilestone) {
  return TYPE_META[m.type ?? 'work'];
}

export default function ExperienceTimeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(MILESTONES.length - 1, index));
    setActive(clamped);
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.children[clamped] as HTMLElement | undefined;
    if (card) {
      scroller.scrollTo({ left: card.offsetLeft - 32, behavior: 'smooth' });
    }
  }, []);

  const onScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // find the card whose center is closest to the scroller's left+offset
    const ref = scroller.scrollLeft + scroller.clientWidth * 0.3;
    let best = 0;
    let bestDist = Infinity;
    Array.from(scroller.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const center = el.offsetLeft + el.clientWidth / 2;
      const dist = Math.abs(center - ref);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const progress = ((active + 1) / MILESTONES.length) * 100;

  return (
    <section id="experience" className="relative overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-24">
        <SectionHeading
          eyebrow="Career Timeline"
          title={
            <>
              The road so <span className="text-gradient">far</span>
            </>
          }
          description="Scroll horizontally through the journey. Click any milestone to expand its impact, the skills used, and the achievements."
        />

        {/* year nav + progress */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {MILESTONES.map((m, i) => (
              <button
                key={m.id}
                onClick={() => scrollTo(i)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                  active === i
                    ? 'border-transparent text-white shadow-md'
                    : 'border-line bg-white/70 text-ink-soft hover:border-indigo/40'
                }`}
                style={active === i ? { background: meta(m).color } : {}}
              >
                {m.date}
              </button>
            ))}
          </div>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <button
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft transition-all hover:border-indigo hover:text-indigo disabled:opacity-40"
              aria-label="Previous milestone"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollTo(active + 1)}
              disabled={active === MILESTONES.length - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/70 text-ink-soft transition-all hover:border-indigo hover:text-indigo disabled:opacity-40"
              aria-label="Next milestone"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* progress rail */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          />
        </div>
      </div>

      {/* horizontal scroller */}
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:mt-10 sm:gap-6 sm:px-6 sm:pb-8 md:px-12 lg:px-24"
      >
        {MILESTONES.map((m, i) => {
          const { icon: Icon, color, label } = meta(m);
          const isActive = active === i;
          return (
            <motion.article
              key={m.id}
              onClick={() => scrollTo(i)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex w-[80vw] flex-shrink-0 cursor-pointer snap-start flex-col rounded-2xl border p-5 sm:w-[420px] sm:rounded-3xl sm:p-8"
              style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                borderColor: isActive ? `${color}55` : 'rgba(15,23,42,0.07)',
                boxShadow: isActive ? `0 24px 60px ${color}22` : '0 8px 28px rgba(15,23,42,0.05)',
                transition: 'box-shadow 0.4s, border-color 0.4s',
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: `${color}16`, color }}
                >
                  <Icon size={22} />
                </span>
                <span
                  className="rounded-full px-3 py-1 font-mono text-xs font-semibold"
                  style={{ background: `${color}14`, color }}
                >
                  {m.date} · {label}
                </span>
              </div>

              <h3 className="font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">{m.title}</h3>
              {m.company && (
                <p className="mt-1.5 text-sm font-medium" style={{ color }}>
                  {m.role ? `${m.role} · ` : ''}{m.company}
                </p>
              )}
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{m.description}</p>

              {/* Expandable content — no height animation to prevent scroll jank */}
              {isActive && (
                <div className="mt-5">
                  {m.impact && (
                    <div className="flex items-start gap-2 rounded-2xl border border-line bg-slate-50/70 p-4">
                      <Sparkles size={16} style={{ color }} className="mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-ink">{m.impact}</p>
                    </div>
                  )}

                  {m.achievements && m.achievements.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {m.achievements.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-soft">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: color }} />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}

                  {m.skills && m.skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span key={s} className="rounded-md border border-line bg-white px-2.5 py-1 text-xs text-ink-soft">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!isActive && (
                <p className="mt-5 font-mono text-xs uppercase tracking-widest text-ink-muted">Click to expand →</p>
              )}
            </motion.article>
          );
        })}
        {/* trailing spacer so last card can center */}
        <div className="w-6 flex-shrink-0 md:w-12 lg:w-24" aria-hidden />
      </div>
    </section>
  );
}
