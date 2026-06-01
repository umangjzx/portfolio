import { motion } from 'framer-motion';

/**
 * SectionLoader - A lightweight loading fallback for lazy-loaded sections.
 * Minimal, clean placeholder that blends with the white portfolio theme.
 */
export default function SectionLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Subtle spinner */}
        <motion.div
          className="w-6 h-6 rounded-full border-2 border-indigo/20 border-t-indigo"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
}
