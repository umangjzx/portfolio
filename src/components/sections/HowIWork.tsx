import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Database, Brain, Rocket, RefreshCw, Search, FlaskConical,
  Layers, BarChart3, ArrowRight, Sparkles, CheckCircle2,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PipelineStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: typeof Database;
  color: string;
  tint: string;
  tools: string[];
  deliverables: string[];
  duration: string;
}

const PIPELINE: PipelineStep[] = [
  {
    id: 'discover',
    phase: '01',
    title: 'Discover & Define',
    description:
      'Start with the human problem. I talk to stakeholders, define the metric that matters, and map the data landscape before writing a single line of code.',
    icon: Search,
    color: '#6366F1',
    tint: 'rgba(99,102,241,0.10)',
    tools: ['User Interviews', 'EDA', 'Jupyter', 'SQL'],
    deliverables: ['Problem statement', 'Success metric', 'Data audit'],
    duration: '1–3 days',
  },
  {
    id: 'model',
    phase: '02',
    title: 'Model & Experiment',
    description:
      'Rapid iteration: baseline → ensemble → evaluate. I test multiple approaches, track experiments rigorously, and pick the architecture that balances accuracy with deployability.',
    icon: Brain,
    color: '#8B5CF6',
    tint: 'rgba(139,92,246,0.10)',
    tools: ['PyTorch', 'Scikit-learn', 'LangChain', 'W&B'],
    deliverables: ['Trained model', 'Evaluation report', 'Architecture decision'],
    duration: '3–7 days',
  },
  {
    id: 'build',
    phase: '03',
    title: 'Build & Ship',
    description:
      'Models are useless in notebooks. I build the full stack: APIs, real-time pipelines, and polished interfaces that humans actually use.',
    icon: Rocket,
    color: '#06B6D4',
    tint: 'rgba(6,182,212,0.10)',
    tools: ['FastAPI', 'React', 'Docker', 'Vercel'],
    deliverables: ['Production API', 'Frontend UI', 'CI/CD pipeline'],
    duration: '5–14 days',
  },
  {
    id: 'iterate',
    phase: '04',
    title: 'Measure & Iterate',
    description:
      'Ship, observe, improve. I instrument everything, monitor drift, and close the feedback loop so the product gets smarter over time.',
    icon: RefreshCw,
    color: '#EC4899',
    tint: 'rgba(236,72,153,0.10)',
    tools: ['Monitoring', 'A/B Tests', 'User Feedback', 'Retrain'],
    deliverables: ['Impact report', 'V2 roadmap', 'Continuous improvement'],
    duration: 'Ongoing',
  },
];

const PRINCIPLES = [
  { icon: BarChart3, label: 'Metric-driven', desc: 'Every decision ties to a measurable outcome.' },
  { icon: Layers, label: 'Full-stack thinking', desc: 'Data → Model → API → UI — I own the whole loop.' },
  { icon: FlaskConical, label: 'Experiment fast', desc: 'Fail cheap, learn quick, ship the winner.' },
  { icon: Sparkles, label: 'User-first', desc: 'A model is only as good as the decision it changes.' },
];

function StepDetail({ step }: { step: PipelineStep }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-xl sm:rounded-3xl sm:p-8"
      style={{ boxShadow: '0 12px 40px rgba(15,23,42,0.06)' }}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{ background: step.tint, color: step.color }}
        >
          <step.icon size={22} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h4 className="font-display text-xl font-semibold text-ink sm:text-2xl">{step.title}</h4>
            <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-[10px] text-ink-muted">
              {step.duration}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">{step.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tools */}
        <div className="rounded-xl border border-line bg-slate-50/60 p-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-ink-muted">Tools</p>
          <div className="flex flex-wrap gap-1.5">
            {step.tools.map((t) => (
              <span
                key={t}
                className="rounded-md border px-2.5 py-1 text-xs font-medium"
                style={{ borderColor: `${step.color}30`, color: step.color, background: `${step.color}08` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="rounded-xl border border-line bg-slate-50/60 p-4">
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-ink-muted">Deliverables</p>
          <ul className="space-y-1.5">
            {step.deliverables.map((d) => (
              <li key={d} className="flex items-center gap-2 text-xs text-ink-soft sm:text-sm">
                <CheckCircle2 size={13} style={{ color: step.color }} className="flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1, once: true });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:px-12 md:py-32 lg:px-24"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Process"
          title={
            <>
              How I <span className="text-gradient">work</span>
            </>
          }
          description="From messy data to production intelligence — my repeatable 4-phase pipeline for shipping AI products that make real decisions easier."
        />

        {/* ─── Visual Pipeline (horizontal on desktop, vertical on mobile) ─── */}
        <div className="mt-10 sm:mt-16">
          {/* Pipeline steps — interactive nav */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            {/* Connecting line (desktop) */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-0.5 -translate-y-1/2 sm:block">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-200 via-violet-200 via-cyan-200 to-pink-200" />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4, #EC4899)' }}
                animate={{ width: `${((activeStep + 1) / PIPELINE.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>

            {/* Connecting line (mobile — vertical) */}
            <div className="pointer-events-none absolute left-[23px] top-0 bottom-0 w-0.5 sm:hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-b from-indigo-200 via-violet-200 via-cyan-200 to-pink-200" />
              <motion.div
                className="absolute inset-x-0 top-0 rounded-full"
                style={{ background: 'linear-gradient(180deg, #6366F1, #8B5CF6, #06B6D4, #EC4899)' }}
                animate={{ height: `${((activeStep + 1) / PIPELINE.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>

            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  className="relative z-10 flex items-center gap-3 sm:flex-col sm:gap-2"
                  aria-label={`Phase ${step.phase}: ${step.title}`}
                >
                  {/* Node circle */}
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300"
                    style={{
                      borderColor: isActive ? step.color : isPast ? `${step.color}80` : 'rgba(0,0,0,0.08)',
                      background: isActive ? step.tint : isPast ? `${step.color}08` : 'white',
                      boxShadow: isActive ? `0 8px 24px ${step.color}30` : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: isActive || isPast ? step.color : '#94a3b8' }}
                    />
                  </div>

                  {/* Label */}
                  <div className="text-left sm:text-center">
                    <span
                      className="block font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: isActive ? step.color : '#94a3b8' }}
                    >
                      {step.phase}
                    </span>
                    <span
                      className="block text-xs font-semibold transition-colors duration-300 sm:text-sm"
                      style={{ color: isActive ? step.color : '#64748b' }}
                    >
                      {step.title}
                    </span>
                  </div>

                  {/* Arrow between nodes (mobile only) */}
                  {i < PIPELINE.length - 1 && (
                    <ArrowRight
                      size={14}
                      className="ml-auto text-ink-muted sm:hidden"
                      style={{ opacity: isPast ? 1 : 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Step detail panel */}
          <div className="mt-8 sm:mt-10">
            <AnimatePresence mode="wait">
              <StepDetail step={PIPELINE[activeStep]} />
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Principles strip ─── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-12 sm:mt-16"
        >
          <h3 className="mb-6 font-display text-lg font-semibold text-ink sm:text-xl">Guiding Principles</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <TiltCard key={p.label} spotlightColor="rgba(99,102,241,0.06)" className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-xl sm:flex-col sm:gap-0 sm:p-6"
                  style={{ boxShadow: '0 4px 16px rgba(15,23,42,0.04)' }}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 sm:mb-4">
                    <p.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-ink sm:text-base">{p.label}</h4>
                    <p className="mt-1 text-xs text-ink-soft leading-relaxed sm:text-sm">{p.desc}</p>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
