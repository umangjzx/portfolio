import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Search, Brain, Rocket, RefreshCw, FlaskConical,
  Layers, BarChart3, Sparkles, CheckCircle2, Zap,
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PipelineStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: typeof Search;
  color: string;
  tint: string;
  gradient: string;
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
      'Start with the human problem. Talk to stakeholders, define the metric that matters, map the data landscape.',
    icon: Search,
    color: '#6366F1',
    tint: 'rgba(99,102,241,0.12)',
    gradient: 'linear-gradient(135deg, #6366F1, #818CF8)',
    tools: ['User Interviews', 'EDA', 'Jupyter', 'SQL'],
    deliverables: ['Problem statement', 'Success metric', 'Data audit'],
    duration: '1–3 days',
  },
  {
    id: 'model',
    phase: '02',
    title: 'Model & Experiment',
    description:
      'Rapid iteration: baseline → ensemble → evaluate. Track experiments, pick the architecture that ships.',
    icon: Brain,
    color: '#8B5CF6',
    tint: 'rgba(139,92,246,0.12)',
    gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
    tools: ['PyTorch', 'Scikit-learn', 'LangChain', 'W&B'],
    deliverables: ['Trained model', 'Evaluation report', 'Architecture decision'],
    duration: '3–7 days',
  },
  {
    id: 'build',
    phase: '03',
    title: 'Build & Ship',
    description:
      'Models are useless in notebooks. Full stack: APIs, real-time pipelines, and polished interfaces.',
    icon: Rocket,
    color: '#06B6D4',
    tint: 'rgba(6,182,212,0.12)',
    gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
    tools: ['FastAPI', 'React', 'Docker', 'Vercel'],
    deliverables: ['Production API', 'Frontend UI', 'CI/CD pipeline'],
    duration: '5–14 days',
  },
  {
    id: 'iterate',
    phase: '04',
    title: 'Measure & Iterate',
    description:
      'Ship, observe, improve. Instrument everything, monitor drift, close the feedback loop.',
    icon: RefreshCw,
    color: '#EC4899',
    tint: 'rgba(236,72,153,0.12)',
    gradient: 'linear-gradient(135deg, #EC4899, #F472B6)',
    tools: ['Monitoring', 'A/B Tests', 'User Feedback', 'Retrain'],
    deliverables: ['Impact report', 'V2 roadmap', 'Continuous improvement'],
    duration: 'Ongoing',
  },
];

const PRINCIPLES = [
  { icon: BarChart3, label: 'Metric-driven', desc: 'Every decision ties to a measurable outcome.', color: '#6366F1' },
  { icon: Layers, label: 'Full-stack thinking', desc: 'Data → Model → API → UI — I own the whole loop.', color: '#8B5CF6' },
  { icon: FlaskConical, label: 'Experiment fast', desc: 'Fail cheap, learn quick, ship the winner.', color: '#06B6D4' },
  { icon: Sparkles, label: 'User-first', desc: 'A model is only as good as the decision it changes.', color: '#EC4899' },
];

/** Auto-advancing interval (ms) */
const AUTO_ADVANCE_MS = 4000;

function StepDetail({ step }: { step: PipelineStep }) {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, x: 40, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -40, scale: 0.97 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="relative overflow-hidden rounded-2xl border sm:rounded-3xl"
      style={{
        borderColor: `${step.color}30`,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: `0 16px 48px ${step.color}15, 0 4px 12px rgba(0,0,0,0.04)`,
      }}
    >
      {/* Colored top accent bar */}
      <div className="h-1" style={{ background: step.gradient }} />

      {/* Animated glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-30 blur-3xl"
        style={{ background: step.color }}
      />

      <div className="p-5 sm:p-8">
        <div className="flex items-start gap-4">
          <motion.div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: step.gradient }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <step.icon size={24} className="text-white" />
          </motion.div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h4 className="font-display text-lg font-semibold text-ink sm:text-2xl">{step.title}</h4>
              <span
                className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold"
                style={{ background: step.tint, color: step.color }}
              >
                {step.duration}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="rounded-xl p-4" style={{ background: `${step.color}06`, border: `1px solid ${step.color}18` }}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>Tools</p>
            <div className="flex flex-wrap gap-1.5">
              {step.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-md px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${step.color}12`, color: step.color, border: `1px solid ${step.color}25` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-4" style={{ background: `${step.color}06`, border: `1px solid ${step.color}18` }}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>Output</p>
            <ul className="space-y-1.5">
              {step.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2 text-xs text-ink-soft">
                  <CheckCircle2 size={12} style={{ color: step.color }} className="flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.1, once: true });
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance pipeline steps
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PIPELINE.length);
    }, AUTO_ADVANCE_MS);
  }, []);

  useEffect(() => {
    if (isInView && !paused) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView, paused, startTimer]);

  const handleStepClick = (i: number) => {
    setActiveStep(i);
    setPaused(true);
    // Resume auto-advance after 8s of inactivity
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPaused(false);
    }, 8000) as unknown as ReturnType<typeof setInterval>;
  };

  const progress = ((activeStep + 1) / PIPELINE.length) * 100;

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden px-4 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24"
    >
      {/* Colorful animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-[20%] -left-[10%] h-[50vh] w-[50vh] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-[15%] -right-[10%] h-[45vh] w-[45vh] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)' }}
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] h-[30vh] w-[30vh] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #06B6D4, transparent 70%)' }}
          animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
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
          description="From messy data to production intelligence — my repeatable 4-phase pipeline for shipping AI products."
        />

        {/* ─── Animated Pipeline ─── */}
        <div className="mt-10 sm:mt-14">
          {/* Pipeline nodes — horizontal on desktop */}
          <div className="relative">
            {/* Progress track (desktop) */}
            <div className="hidden sm:block absolute inset-x-0 top-[26px] h-1.5 rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4, #EC4899)' }}
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              />
              {/* Glowing dot at end of progress */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full"
                style={{
                  background: PIPELINE[activeStep].color,
                  boxShadow: `0 0 12px ${PIPELINE[activeStep].color}80, 0 0 24px ${PIPELINE[activeStep].color}40`,
                }}
                animate={{ left: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              />
            </div>

            {/* Progress track (mobile — vertical) */}
            <div className="sm:hidden absolute left-[22px] top-0 bottom-0 w-1.5 rounded-full bg-gray-100">
              <motion.div
                className="w-full rounded-full"
                style={{ background: 'linear-gradient(180deg, #6366F1, #8B5CF6, #06B6D4, #EC4899)' }}
                animate={{ height: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              />
            </div>

            {/* Step nodes */}
            <div className="relative flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-0 sm:pt-0">
              {PIPELINE.map((step, i) => {
                const Icon = step.icon;
                const isActive = i === activeStep;
                const isPast = i < activeStep;

                return (
                  <motion.button
                    key={step.id}
                    onClick={() => handleStepClick(i)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                    className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2"
                    aria-label={`Phase ${step.phase}: ${step.title}`}
                  >
                    {/* Node */}
                    <motion.div
                      className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-500"
                      style={{
                        background: isActive ? step.gradient : isPast ? step.tint : 'white',
                        border: `2px solid ${isActive ? step.color : isPast ? `${step.color}60` : '#e2e8f0'}`,
                        boxShadow: isActive
                          ? `0 8px 28px ${step.color}40, 0 0 0 4px ${step.color}15`
                          : 'none',
                      }}
                      animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
                    >
                      <Icon
                        size={22}
                        className={isActive ? 'text-white' : ''}
                        style={{ color: isActive ? 'white' : isPast ? step.color : '#94a3b8' }}
                      />
                    </motion.div>

                    {/* Label */}
                    <div className="text-left sm:text-center sm:mt-3">
                      <span
                        className="block font-mono text-[10px] uppercase tracking-widest transition-colors"
                        style={{ color: isActive ? step.color : '#94a3b8' }}
                      >
                        Phase {step.phase}
                      </span>
                      <span
                        className="block text-xs font-bold transition-colors sm:text-sm"
                        style={{ color: isActive ? step.color : '#64748b' }}
                      >
                        {step.title}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Auto-advance indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {PIPELINE.map((step, i) => (
              <motion.div
                key={step.id}
                className="h-1.5 rounded-full overflow-hidden"
                style={{
                  width: i === activeStep ? 32 : 8,
                  background: i === activeStep ? 'transparent' : i < activeStep ? step.color : '#e2e8f0',
                }}
                animate={{ width: i === activeStep ? 32 : 8 }}
                transition={{ duration: 0.3 }}
              >
                {i === activeStep && (
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: step.gradient }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: paused ? 0 : AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                    key={`progress-${activeStep}-${paused}`}
                  />
                )}
              </motion.div>
            ))}
            {!paused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-2"
              >
                <Zap size={12} className="text-ink-muted animate-pulse" />
              </motion.div>
            )}
          </div>

          {/* Step detail panel */}
          <div className="mt-6 sm:mt-8">
            <AnimatePresence mode="wait">
              <StepDetail step={PIPELINE[activeStep]} />
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Principles strip — colorful ─── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-12 sm:mt-14"
        >
          <h3 className="mb-5 font-display text-lg font-semibold text-ink sm:text-xl">Guiding Principles</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {PRINCIPLES.map((p, i) => (
              <TiltCard key={p.label} spotlightColor={`${p.color}15`} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="flex h-full items-start gap-3 rounded-2xl border bg-white/80 p-4 backdrop-blur-xl sm:flex-col sm:gap-0 sm:p-5"
                  style={{
                    borderColor: `${p.color}20`,
                    boxShadow: `0 4px 16px ${p.color}08`,
                  }}
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl sm:mb-3"
                    style={{ background: `${p.color}12`, color: p.color }}
                  >
                    <p.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-ink sm:text-base">{p.label}</h4>
                    <p className="mt-0.5 text-xs text-ink-soft leading-relaxed sm:text-sm">{p.desc}</p>
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
