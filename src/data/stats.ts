import type { StatConfig, BuilderStat } from '../types';

/** Legacy counter config (still consumed by AILaboratory animated counters). */
export const STATS: StatConfig[] = [
  { id: 'projects', label: 'Projects Completed', targetValue: 11, suffix: '+' },
  { id: 'technologies', label: 'Technologies Mastered', targetValue: 25, suffix: '+' },
  { id: 'publications', label: 'Publications', targetValue: 2 },
  { id: 'hackathons', label: 'Hackathon Awards', targetValue: 4 },
];

/** Builder Stats — the meaningful gamification system (real numbers). */
export const BUILDER_STATS: BuilderStat[] = [
  { id: 'projects', label: 'Projects Shipped', value: 11, suffix: '+', icon: 'rocket' },
  { id: 'hackathons', label: 'Hackathon Podiums', value: 4, icon: 'trophy' },
  { id: 'papers', label: 'Research Papers', value: 2, icon: 'scroll' },
  { id: 'technologies', label: 'Technologies', value: 25, suffix: '+', icon: 'cpu' },
];
