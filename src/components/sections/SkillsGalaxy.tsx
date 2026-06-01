import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Wrench, Layers3, Cpu } from 'lucide-react';
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
      <div className="mx-auto max-w-6xl">
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

        {/* Cluster filter */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCluster(null)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              activeCluster === null
                ? 'border-indigo bg-indigo text-white shadow-[0_4px_16px_rgba(99,102,241,0.25)]'
                : 'border-line bg-white text-ink-soft hover:border-indigo/40 hover:text-ink'
            }`}
          >
            All
          </button>
          {SKILL_CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(activeCluster === c.id ? null : c.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeCluster === c.id
                  ? 'border-transparent text-white shadow-md'
                  : 'border-line bg-white text-ink-soft hover:border-indigo/40 hover:text-ink'
              }`}
              style={activeCluster === c.id ? { background: c.color } : {}}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: activeCluster === c.id ? '#fff' : c.color }}
              />
              {c.label}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <motion.div
          className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <motion.button
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.4, delay: i * 0.02, ease: EASE }}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(skill)}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-lg hover:border-transparent"
                style={{
                  '--skill-color': skill.color,
                } as React.CSSProperties}
                aria-label={`${skill.name}, ${skill.proficiency}% proficiency`}
              >
                {/* Colored accent bar */}
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: skill.color }}
                />

                {/* Icon circle */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${skill.color}12`, border: `1.5px solid ${skill.color}30` }}
                >
                  <Cpu size={20} style={{ color: skill.color }} />
                </div>

                {/* Name */}
                <span className="text-sm font-semibold text-ink leading-tight">
                  {skill.name}
                </span>

                {/* Proficiency bar */}
                <div className="w-full">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.02, ease: EASE }}
                      style={{ background: skill.color }}
                    />
                  </div>
                  <span className="mt-1 block text-[10px] font-medium text-ink-muted">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Years badge */}
                {skill.years && (
                  <span className="absolute right-2.5 top-2.5 rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-semibold text-ink-muted">
                    {skill.years}y
                  </span>
                )}
              </motion.button>
            ))}
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
                  style={{ background: `${selected.color}18`, border: `1px solid ${selected.color}40` }}
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
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
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
