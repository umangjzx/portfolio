import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Trophy, ScrollText, Cpu, ChevronDown } from 'lucide-react';
import { BUILDER_STATS } from '../../data/stats';

const ICONS: Record<string, typeof Rocket> = {
  rocket: Rocket,
  trophy: Trophy,
  scroll: ScrollText,
  cpu: Cpu,
};

/**
 * Builder Stats widget — replaces the meaningless XP/Level bar with real,
 * meaningful numbers (projects shipped, podiums, papers, technologies).
 * Collapses to a compact pill that expands on click/hover.
 */
export function LevelIndicator() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-4 top-4 z-50 hidden sm:block"
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Builder stats"
        className="flex items-center gap-2.5 rounded-2xl border border-line bg-white/85 px-4 py-2.5 backdrop-blur-xl transition-shadow hover:shadow-lg"
        style={{ boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo/10">
          <Rocket size={15} className="text-indigo" />
        </span>
        <span className="text-sm font-semibold text-ink">Builder Stats</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-ink-muted">
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-60 rounded-2xl border border-line bg-white/95 p-3 backdrop-blur-xl"
            style={{ boxShadow: '0 16px 40px rgba(15,23,42,0.12)' }}
          >
            <div className="grid grid-cols-2 gap-2">
              {BUILDER_STATS.map((stat) => {
                const Icon = ICONS[stat.icon ?? 'rocket'] ?? Rocket;
                return (
                  <div key={stat.id} className="rounded-xl border border-line bg-slate-50/70 p-3">
                    <Icon size={15} className="text-violet" />
                    <div className="mt-1.5 font-display text-xl font-semibold text-ink tabular-nums">
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-[11px] leading-tight text-ink-muted">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LevelIndicator;
