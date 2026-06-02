import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Wrench, Layers3, Cpu, Sparkles } from 'lucide-react';
import { SKILLS, SKILL_CLUSTERS } from '../../data/skills';
import { PROJECTS } from '../../data/projects';
import type { SkillPlanet, SkillClusterId } from '../../types';
import SectionHeading from '../ui/SectionHeading';
import { usePortfolioStore } from '../../store/portfolioStore';

export interface SkillsGalaxyProps {
  isVisible?: boolean;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SkillsGalaxy(_props: SkillsGalaxyProps) {
  const [selected, setSelected] = useState<SkillPlanet | null>(null);
  const [activeCluster, setActiveCluster] = useState<SkillClusterId | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const addXP = usePortfolioStore((s) => s.addXP);
  const grantedRef = useRef(false);

  const handleSelect = useCallback(
    (skill: SkillPlanet) => {
      setSelected(skill);
      if (!grantedRef.current) {
        addXP(30);
        grantedRef.current = true;
      }
    },
    [addXP]
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const filteredSkills = activeCluster
    ? SKILLS.filter((s) => s.cluster === activeCluster)
    : SKILLS;

  const selectedProjects = selected
    ? PROJECTS.filter((p) => (selected.projects ?? []).includes(p.id))
    : [];

  return (
    <section id="skills" className="relative w-full overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-20 -left-40 h-[600px] w-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 -right-40 h-[500px] w-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.06) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skill Ecosystem"
          align="center"
          title={
            <>
              My <span className="text-gradient">tech stack</span>
            </>
          }
          description="The tools and technologies I use to build intelligent products — from model to interface."
        />

        {/* Cluster filter — pill style with glow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2.5"
        >
          <button
            onClick={() => setActiveCluster(null)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
              activeCluster === null
                ? 'border-indigo/50 bg-gradient-to-r from-indigo to-violet text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)]'
                : 'border-line bg-white/80 text-ink-soft hover:border-indigo/40 hover:text-ink hover:shadow-md backdrop-blur-md'
            }`}
          >
            All
          </button>
          {SKILL_CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(activeCluster === c.id ? null : c.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeCluster === c.id
                  ? 'border-transparent text-white shadow-lg'
                  : 'border-line bg-white/80 text-ink-soft hover:border-indigo/40 hover:text-ink hover:shadow-md backdrop-blur-md'
              }`}
              style={
                activeCluster === c.id
                  ? { background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)`, boxShadow: `0 4px 20px ${c.color}40` }
                  : {}
              }
            >
              <span
                className="h-2.5 w-2.5 rounded-full transition-transform duration-300"
                style={{
                  background: activeCluster === c.id ? '#fff' : c.color,
                  transform: activeCluster === c.id ? 'scale(1.2)' : 'scale(1)',
                }}
              />
              {c.label}
            </button>
          ))}
        </motion.div>

        {/* Skills grid — hexagonal-inspired cards */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => {
              const isHovered = hoveredSkill === skill.id;
              return (
                <motion.button
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.45, delay: i * 0.025, ease: EASE }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelect(skill)}
                  onMouseEnter={() => setHoveredSkill(skill.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="group relative flex flex-col items-center gap-3.5 rounded-3xl border p-6 text-center transition-all duration-300"
                  style={{
                    '--skill-color': skill.color,
                    background: isHovered
                      ? `linear-gradient(135deg, ${skill.color}08, ${skill.color}14)`
                      : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderColor: isHovered ? `${skill.color}50` : 'rgba(0,0,0,0.06)',
                    boxShadow: isHovered
                      ? `0 20px 40px ${skill.color}18, 0 8px 16px rgba(0,0,0,0.04)`
                      : '0 4px 16px rgba(0,0,0,0.04)',
                  } as React.CSSProperties}
                  aria-label={`${skill.name}, ${skill.proficiency}% proficiency`}
                >
                  {/* Animated glow ring on hover */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${skill.color}15, transparent 70%)`,
                    }}
                  />

                  {/* Top accent line with gradient */}
                  <div
                    className="absolute inset-x-3 top-0 h-[2px] rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)` }}
                  />

                  {/* Icon with animated background */}
                  <div className="relative">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${skill.color}15, ${skill.color}08)`,
                        border: `1.5px solid ${skill.color}30`,
                        boxShadow: isHovered ? `0 4px 12px ${skill.color}20` : 'none',
                      }}
                    >
                      <Cpu size={22} style={{ color: skill.color }} />
                    </div>
                    {/* Sparkle on high-proficiency skills */}
                    {skill.proficiency >= 85 && (
                      <Sparkles
                        size={12}
                        className="absolute -right-1 -top-1 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ color: skill.color }}
                      />
                    )}
                  </div>

                  {/* Name */}
                  <span className="relative z-10 text-sm font-bold text-ink leading-tight">
                    {skill.name}
                  </span>

                  {/* Proficiency — circular indicator + bar */}
                  <div className="w-full relative z-10">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100/80">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.15 + i * 0.025, ease: EASE }}
                        style={{
                          background: `linear-gradient(90deg, ${skill.color}cc, ${skill.color})`,
                          boxShadow: `0 0 8px ${skill.color}40`,
                        }}
                      />
                    </div>
                    <span className="mt-1.5 block text-[11px] font-bold tabular-nums" style={{ color: skill.color }}>
                      {skill.proficiency}%
                    </span>
                  </div>

                  {/* Years badge — refined */}
                  {skill.years && (
                    <span
                      className="absolute right-3 top-3 rounded-lg px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        background: `${skill.color}10`,
                        color: `${skill.color}`,
                        border: `1px solid ${skill.color}20`,
                      }}
                    >
                      {skill.years}y
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-ink/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.aside
              className="fixed right-0 top-0 bottom-0 z-[100] flex w-full max-w-md flex-col overflow-y-auto bg-white/95 backdrop-blur-2xl"
              style={{ borderLeft: '1px solid rgba(15,23,42,0.08)', boxShadow: '-24px 0 60px rgba(15,23,42,0.12)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 240 }}
              role="dialog"
              aria-label={`${selected.name} details`}
            >
              {/* Color accent at top */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: `linear-gradient(90deg, ${selected.color}, #8B5CF6)` }}
              />

              <button
                onClick={() => setSelected(null)}
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-ink-soft transition-colors hover:bg-slate-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col p-10 pt-16">
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${selected.color}18, ${selected.color}08)`,
                    border: `1px solid ${selected.color}40`,
                    boxShadow: `0 4px 16px ${selected.color}15`,
                  }}
                >
                  <Cpu size={28} style={{ color: selected.color }} />
                </div>
                <h3 className="font-display text-3xl font-semibold text-ink">{selected.name}</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {SKILL_CLUSTERS.find((c) => c.id === selected.cluster)?.label ?? 'Core'} ·{' '}
                  {selected.years ?? 1}+ yrs
                </p>

                {/* proficiency */}
                <div className="mt-8">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-ink-soft">Proficiency</span>
                    <span className="font-bold text-ink">{selected.proficiency}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.proficiency}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      style={{ background: `linear-gradient(90deg, ${selected.color}, #8B5CF6)` }}
                    />
                  </div>
                </div>

                {/* tools */}
                {selected.tools && selected.tools.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      <Wrench size={13} /> Tools & Libraries
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tools.map((t) => (
                        <span key={t} className="rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-sm text-ink-soft">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* projects */}
                <div className="mt-8">
                  <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-muted">
                    <Layers3 size={13} /> Used in {selectedProjects.length} project{selectedProjects.length === 1 ? '' : 's'}
                  </p>
                  {selectedProjects.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {selectedProjects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelected(null);
                            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="group flex items-center justify-between rounded-xl border border-line bg-white p-4 text-left transition-all hover:border-indigo/40 hover:shadow-sm"
                        >
                          <div>
                            <p className="text-sm font-semibold text-ink">{p.title}</p>
                            <p className="text-xs text-ink-muted">{p.category}</p>
                          </div>
                          <ArrowUpRight size={16} className="text-ink-muted transition-colors group-hover:text-indigo" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-ink-muted">Part of my core toolkit across exploratory work.</p>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
