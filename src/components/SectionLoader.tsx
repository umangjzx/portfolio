import { motion } from 'framer-motion';

/**
 * SectionLoader - A lightweight loading fallback for lazy-loaded sections.
 * Displays a minimal animated placeholder while heavy components load.
 */
export default function SectionLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Pulsing orb */}
        <motion.div
          className="w-8 h-8 rounded-full"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, #6366f1 100%)',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Loading text */}
        <span className="text-xs text-white/40 font-mono tracking-widest uppercase">
          Loading...
        </span>
      </motion.div>
    </div>
  );
}
