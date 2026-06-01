import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowUpRight, Target, Lightbulb, Cpu, TrendingUp, GraduationCap, ExternalLink,
} from 'lucide-react';
import { PROJECTS } from '../../data/projects';
import type { Project } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';
import { GithubIcon } from '../ui/BrandIcons';
import { usePortfolioStore } from '../../store/portfolioStore';

/** Bento span pattern — featured projects get larger tiles. */
function spanFor(p: Project, i: number): string {
  if (p.featured && i === 0) return 'md:col-span-2 md:row-span-2';
  if (p.featured) return 'md:col-span-2';
  return '';
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (p: Project) => void }) {
  const [c1, c2] = project.accent ?? ['#6366F1', '#8B5CF6'];
  const big = project.featured && index === 0;

  return (
    <motion.div
      className={spanFor(project, index)}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.06 }}
    >
      <TiltCard spotlightColor={`${c1}26`} className="h-full" onClick={() => onOpen(project)}>
        <article
          className="group relative flex h-full min-h-[230px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-line p-7"
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(15,23,42,0.05)' }}
          aria-label={`Open case study: ${project.title}`}
        >
          {/* accent corner glow */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
            style={{ background: `radial-gradient(circle, ${c1}40, transparent 70%)` }}
          />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{ background: `${c1}14`, color: c1 }}
              >
                {project.category}
              </span>
              <span className="font-mono text-xs text-ink-muted">{project.year}</span>
            </div>

            <h3 className={`font-display font-semibold text-ink ${big ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
              {project.title}
            </h3>
            <p className={`mt-2 text-ink-soft ${big ? 'text-base' : 'text-sm'} leading-relaxed`}>
              {project.tagline}
            </p>

            {/* metrics preview for big card */}
            {big && project.metrics && (
              <div className="mt-7 flex flex-wrap gap-6">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl font-semibold" style={{ color: c1 }}>{m.value}</div>
                    <div className="text-xs text-ink-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, big ? 5 : 3).map((t) => (
                <span key={t} className="rounded-md border border-line bg-white/60 px-2 py-0.5 text-[11px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c2})`, color: '#fff' }}
            >
              <ArrowUpRight size={17} />
            </span>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [c1, c2] = project.accent ?? ['#6366F1', '#8B5CF6'];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const blocks = [
    { icon: Target, label: 'Problem', body: project.problem, color: '#EC4899' },
    { icon: Lightbulb, label: 'Solution', body: project.solution, color: '#6366F1' },
    { icon: TrendingUp, label: 'Impact', body: project.impact, color: '#10B981' },
  ].filter((b) => b.body);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
    >
      <motion.div
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-3xl bg-white"
        initial={{ scale: 0.94, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 260 }}
        style={{ boxShadow: '0 40px 100px rgba(15,23,42,0.25)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`${project.title} case study`}
      >
        {/* header banner */}
        <div className="relative overflow-hidden px-8 pt-10 pb-8 md:px-12" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/35"
            aria-label="Close case study"
          >
            <X size={18} />
          </button>
          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-3 text-sm text-white/80">
              <span className="rounded-full bg-white/20 px-3 py-1 font-medium">{project.category}</span>
              <span className="font-mono">{project.year}</span>
            </div>
            <h2 className="font-display text-4xl font-semibold text-white md:text-5xl">{project.title}</h2>
            <p className="mt-2 max-w-2xl text-lg text-white/90">{project.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105"
                >
                  <ExternalLink size={15} /> Live Demo
                </a>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                <GithubIcon size={15} /> Source
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* metrics row */}
          {project.metrics && (
            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-2xl border border-line bg-slate-50/70 p-5 text-center">
                  <div className="font-display text-2xl font-semibold" style={{ color: c1 }}>{m.value}</div>
                  <div className="mt-1 text-xs text-ink-soft">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* problem / solution / impact */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {blocks.map((b) => (
              <div key={b.label} className="rounded-2xl border border-line bg-white p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${b.color}16`, color: b.color }}>
                    <b.icon size={16} />
                  </span>
                  <h4 className="font-display text-base font-semibold text-ink">{b.label}</h4>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">{b.body}</p>
              </div>
            ))}
          </div>

          {/* architecture + lessons */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {project.architecture && (
              <div className="rounded-2xl border border-line bg-slate-50/60 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Cpu size={16} className="text-violet" />
                  <h4 className="font-display text-base font-semibold text-ink">Architecture</h4>
                </div>
                <ul className="space-y-3">
                  {project.architecture.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: c1 }} />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.lessons && (
              <div className="rounded-2xl border border-line bg-slate-50/60 p-6">
                <div className="mb-4 flex items-center gap-2">
                  <GraduationCap size={16} className="text-cyan" />
                  <h4 className="font-display text-base font-semibold text-ink">Lessons Learned</h4>
                </div>
                <ul className="space-y-3">
                  {project.lessons.map((l, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-ink-soft">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* full stack */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span key={t} className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink-soft">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectUniverse() {
  const [selected, setSelected] = useState<Project | null>(null);
  const addXP = usePortfolioStore((s) => s.addXP);
  const unlockAchievement = usePortfolioStore((s) => s.unlockAchievement);
  const [opened, setOpened] = useState<Set<string>>(new Set());

  const handleOpen = useCallback(
    (project: Project) => {
      setSelected(project);
      if (!opened.has(project.id)) {
        addXP(60);
        setOpened((prev) => {
          const next = new Set(prev).add(project.id);
          if (next.size === PROJECTS.length) unlockAchievement('Case Study Explorer');
          return next;
        });
      }
    },
    [opened, addXP, unlockAchievement]
  );

  return (
    <section id="projects" className="relative min-h-screen px-6 py-32 md:px-12 lg:px-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Flagship <span className="text-gradient">case studies</span>
            </>
          }
          description="Each one reads like a product launch — the problem, the solution, the architecture, and the measurable impact. Click any tile to open the full case study."
        />

        <div className="mt-16 grid auto-rows-[minmax(230px,auto)] grid-cols-1 gap-6 md:grid-cols-4">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <CaseStudyModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
