import { motion } from 'framer-motion';
import { Cpu, TrendingUp, FileText, Trophy, Rocket } from 'lucide-react';

const METRICS = [
  { icon: Cpu, value: '14', label: 'AI Agents in Pipeline', accent: '#6366F1' },
  { icon: TrendingUp, value: '$139K+', label: 'Revenue at Risk Identified', accent: '#06B6D4' },
  { icon: FileText, value: '2', label: 'Research Papers Published', accent: '#8B5CF6' },
  { icon: Trophy, value: '4', label: 'Hackathon Podiums', accent: '#EC4899' },
  { icon: Rocket, value: '11+', label: 'Products Shipped', accent: '#14B8A6' },
] as const;

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ResultsBanner() {
  return (
    <section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-24">
      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 text-center sm:mb-14"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-500 sm:text-xs">
            Results that matter
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl md:text-4xl">
            Numbers I've <span className="text-gradient">driven</span>
          </h2>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5 lg:gap-8">
          {METRICS.map(({ icon: Icon, value, label, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
              className="group flex flex-col items-center rounded-2xl border border-line bg-white/70 p-5 text-center backdrop-blur-md transition-shadow hover:shadow-lg sm:rounded-3xl sm:p-7"
              style={{ boxShadow: '0 4px 20px rgba(15,23,42,0.04)' }}
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${accent}14`, color: accent }}
              >
                <Icon size={20} />
              </div>
              <span
                className="font-display text-3xl font-bold tabular-nums sm:text-4xl"
                style={{ color: accent }}
              >
                {value}
              </span>
              <span className="mt-2 text-xs leading-tight text-ink-soft sm:text-sm">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
