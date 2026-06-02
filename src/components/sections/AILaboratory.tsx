import { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, FlaskConical, Cpu, ArrowUpRight } from 'lucide-react';
import { LAB_EXPERIMENTS } from '../../data/lab';
import { STATS } from '../../data/stats';
import type { LabExperiment, LabStatus } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';
import { computeCounterValue } from '../../utils/computations';

const STATUS_META: Record<LabStatus, { label: string; color: string; pulse: boolean }> = {
  live: { label: 'Live', color: '#10B981', pulse: true },
  'in-progress': { label: 'In Progress', color: '#F59E0B', pulse: true },
  research: { label: 'Research', color: '#8B5CF6', pulse: false },
  shipped: { label: 'Shipped', color: '#6366F1', pulse: false },
  archived: { label: 'Archived', color: '#94A3B8', pulse: false },
};

/** Small animated counter using the shared, unit-tested computeCounterValue. */
function Counter({ target, suffix, run }: { target: number; suffix?: string; run: boolean }) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    const DURATION = 1800;
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const elapsed = t - start;
      setValue(computeCounterValue(target, elapsed, DURATION));
      if (elapsed < DURATION) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  return (
    <span className="font-display text-3xl font-semibold text-gradient tabular-nums sm:text-4xl md:text-5xl">
      {value}
      {suffix && <span className="text-2xl md:text-3xl">{suffix}</span>}
    </span>
  );
}

/** Animated sparkline that periodically refreshes its data. */
function Sparkline({ color, seed }: { color: string; seed: number }) {
  const [data, setData] = useState<number[]>(() => Array.from({ length: 10 }, (_, i) => 30 + Math.sin(i + seed) * 18 + Math.random() * 14));

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => [...prev.slice(1), 20 + Math.random() * 60]);
    }, 1600 + seed * 200);
    return () => clearInterval(id);
  }, [seed]);

  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - v}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-12 w-full">
      <polyline
        points={`0,100 ${points} 100,100`}
        fill={`${color}14`}
        stroke="none"
        style={{ transition: 'all 0.8s ease-out' }}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ transition: 'all 0.8s ease-out' }}
      />
    </svg>
  );
}

function ExperimentCard({ exp, index }: { exp: LabExperiment; index: number }) {
  const status = STATUS_META[exp.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
    >
      <TiltCard spotlightColor={`${status.color}1f`} className="h-full">
        <div
          className="flex h-full flex-col rounded-3xl border border-line bg-white/80 p-7 backdrop-blur-xl"
          style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                {status.pulse && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: status.color }} />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: status.color }} />
              </span>
              <span style={{ color: status.color }}>{status.label}</span>
            </span>
            <span className="font-mono text-xs text-ink-muted">{exp.category}</span>
          </div>

          <h3 className="font-display text-xl font-semibold text-ink">{exp.title}</h3>
          <p className="mt-2 flex-grow text-sm leading-relaxed text-ink-soft">{exp.description}</p>

          {/* progress tracker */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-ink-muted">Progress</span>
              <span className="font-semibold text-ink">{exp.progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: `${exp.progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                style={{ background: `linear-gradient(90deg, ${status.color}, #8B5CF6)` }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {exp.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-md border border-line bg-white/60 px-2 py-0.5 text-[11px] text-ink-soft">{t}</span>
              ))}
            </div>
            {exp.metric && (
              <div className="text-right">
                <div className="font-display text-base font-semibold" style={{ color: status.color }}>{exp.metric.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-ink-muted">{exp.metric.label}</div>
              </div>
            )}
          </div>

          {exp.link && (
            <a
              href={exp.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo transition-colors hover:text-violet"
            >
              View experiment <ArrowUpRight size={15} />
            </a>
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function AILaboratory() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.05, once: true });

  const liveCount = useMemo(
    () => LAB_EXPERIMENTS.filter((e) => e.status === 'live' || e.status === 'in-progress').length,
    []
  );

  return (
    <section ref={sectionRef} id="ai-lab" className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24">
      {/* faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Build & Ship"
            title={
              <>
                What I'm <span className="text-gradient">working on</span>
              </>
            }
            description="Active projects, published papers, and prototypes I'm building — real work with real progress."
          />
          <div className="flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-ink-soft">{liveCount} active experiments</span>
          </div>
        </div>

        {/* live telemetry strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const colors = ['#6366F1', '#8B5CF6', '#06B6D4', '#EC4899'];
            return (
              <div
                key={stat.id}
                className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-6 backdrop-blur-xl"
                style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
              >
                <Counter target={stat.targetValue} suffix={stat.suffix} run={inView} />
                <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
                <div className="mt-3 opacity-70">
                  <Sparkline color={colors[i % colors.length]} seed={i + 1} />
                </div>
              </div>
            );
          })}
        </div>

        {/* feature panels: neural activity + capabilities */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            className="relative overflow-hidden rounded-3xl border border-line bg-white/80 p-7 backdrop-blur-xl lg:col-span-2"
            style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Activity size={18} className="text-indigo" />
              <h3 className="font-display text-lg font-semibold text-ink">Activity Pulse</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ['Commits', '#6366F1', 1],
                ['Research', '#8B5CF6', 2],
                ['Deployments', '#06B6D4', 3],
              ].map(([label, color, seed]) => (
                <div key={label as string} className="rounded-2xl border border-line bg-slate-50/60 p-4">
                  <p className="mb-2 text-xs font-medium text-ink-soft">{label as string}</p>
                  <Sparkline color={color as string} seed={seed as number} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-3xl border border-line bg-white/80 p-7 backdrop-blur-xl"
            style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-violet" />
              <h3 className="font-display text-lg font-semibold text-ink">What I Build</h3>
            </div>
            <ul className="space-y-3">
              {['Multi-agent AI pipelines', 'Predictive ML models', 'Full-stack web applications', 'Research & publications'].map((c, i) => (
                <li key={c} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: ['#6366F114', '#8B5CF614', '#06B6D414', '#EC489914'][i], color: ['#6366F1', '#8B5CF6', '#06B6D4', '#EC4899'][i] }}>
                    <FlaskConical size={13} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* experiments grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LAB_EXPERIMENTS.map((exp, i) => (
            <ExperimentCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
