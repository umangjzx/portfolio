import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
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

interface Placed extends SkillPlanet {
  x: number;
  y: number;
  clusterAngle: number;
}

const SIZE = 760;
const CENTER = SIZE / 2;

export default function SkillsGalaxy(_props: SkillsGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SkillPlanet | null>(null);
  const [activeCluster, setActiveCluster] = useState<SkillClusterId | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const addXP = usePortfolioStore((s) => s.addXP);
  const grantedRef = useRef(false);

  // Lay skills out grouped by cluster around the core.
  const placed = useMemo<Placed[]>(() => {
    const byCluster: Record<string, SkillPlanet[]> = {};
    SKILLS.forEach((s) => {
      const c = s.cluster ?? 'ai-ml';
      (byCluster[c] ??= []).push(s);
    });

    const clusterIds = SKILL_CLUSTERS.map((c) => c.id);
    const result: Placed[] = [];

    clusterIds.forEach((cid, ci) => {
      const group = byCluster[cid] ?? [];
      // each cluster occupies an angular sector
      const sectorCenter = (ci / clusterIds.length) * Math.PI * 2 - Math.PI / 2;
      group.forEach((skill, si) => {
        const ring = si % 2 === 0 ? 0.62 : 0.92; // two depth rings per sector
        const spread = ((si - (group.length - 1) / 2) / Math.max(group.length, 1)) * 0.7;
        const angle = sectorCenter + spread;
        const radius = CENTER * ring;
        result.push({
          ...skill,
          clusterAngle: sectorCenter,
          x: CENTER + Math.cos(angle) * radius * 0.82,
          y: CENTER + Math.sin(angle) * radius * 0.82,
        });
      });
    });
    return result;
  }, []);

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

  // close panel on escape
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  const dimmed = (s: Placed) => activeCluster !== null && s.cluster !== activeCluster;

  const selectedProjects = selected
    ? PROJECTS.filter((p) => (selected.projects ?? []).includes(p.id))
    : [];

  return (
    <section id="skills" className="relative w-full overflow-hidden px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Skill Ecosystem"
          align="center"
          title={
            <>
              Explore the <span className="text-gradient">tech universe</span>
            </>
          }
          description="A living map centered on an AI core. Filter by cluster, then click any node to see proficiency, tools, and the projects that use it."
        />

        {/* Cluster legend / filter */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => setActiveCluster(null)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              activeCluster === null
                ? 'border-indigo bg-indigo text-white shadow-[0_6px_20px_rgba(99,102,241,0.3)]'
                : 'border-line bg-white/70 text-ink-soft hover:border-indigo/40'
            }`}
          >
            All
          </button>
          {SKILL_CLUSTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCluster(activeCluster === c.id ? null : c.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                activeCluster === c.id
                  ? 'border-transparent text-white shadow-md'
                  : 'border-line bg-white/70 text-ink-soft hover:border-indigo/40'
              }`}
              style={activeCluster === c.id ? { background: c.color } : {}}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: activeCluster === c.id ? '#fff' : c.color }} />
              {c.label}
            </button>
          ))}
        </div>

        {/* The network */}
        <div className="relative mt-12 flex items-center justify-center">
          <div
            ref={containerRef}
            className="relative aspect-square w-full max-w-[760px]"
            style={{ maxHeight: '76vh' }}
          >
            {/* connection lines */}
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx={CENTER} cy={CENTER} r={CENTER * 0.75} fill="url(#coreGlow)" />
              <circle cx={CENTER} cy={CENTER} r={CENTER * 0.5} fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="1" strokeDasharray="3 10" />
              <circle cx={CENTER} cy={CENTER} r={CENTER * 0.74} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="2 12" />
              {placed.map((s) => {
                const isDim = dimmed(s);
                const isActive = hovered === s.id || selected?.id === s.id;
                return (
                  <line
                    key={`l-${s.id}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={s.x}
                    y2={s.y}
                    stroke={s.color}
                    strokeWidth={isActive ? 2 : 1}
                    strokeOpacity={isDim ? 0.05 : isActive ? 0.6 : 0.18}
                    style={{ transition: 'stroke-opacity 0.3s, stroke-width 0.3s' }}
                  />
                );
              })}
            </svg>

            {/* central AI core */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                width: '20%',
                aspectRatio: '1',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(99,102,241,0.25)',
                boxShadow: '0 12px 50px rgba(99,102,241,0.18), 0 0 0 10px rgba(99,102,241,0.04)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-center leading-tight">
                <div className="font-display text-base font-semibold text-gradient sm:text-lg">UMANG</div>
                <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.25em] text-ink-muted sm:text-[9px]">AI Core</div>
              </div>
            </motion.div>

            {/* skill nodes */}
            {placed.map((s, i) => {
              const isDim = dimmed(s);
              const nodeSize = 13 + (s.proficiency / 100) * 6; // % of container
              return (
                <motion.button
                  key={s.id}
                  className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
                  style={{
                    left: `${(s.x / SIZE) * 100}%`,
                    top: `${(s.y / SIZE) * 100}%`,
                    width: `${nodeSize}%`,
                    aspectRatio: '1',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: `1.5px solid ${s.color}`,
                    boxShadow: `0 6px 20px ${s.color}22`,
                    opacity: isDim ? 0.22 : 1,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: isDim ? 0.22 : 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.02 * i, type: 'spring', stiffness: 180, damping: 16 }}
                  whileHover={{ scale: 1.16 }}
                  onHoverStart={() => setHovered(s.id)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={() => handleSelect(s)}
                  aria-label={`${s.name}, ${s.proficiency}% proficiency`}
                >
                  <span
                    className="px-1 text-center font-semibold leading-none text-ink"
                    style={{ fontSize: 'clamp(8px, 1.1vw, 13px)' }}
                  >
                    {s.name.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
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
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
                      <Wrench size={13} /> Tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selected.tools.map((t) => (
                        <span key={t} className="rounded-lg border border-line bg-slate-50 px-3 py-1 text-sm text-ink-soft">
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
