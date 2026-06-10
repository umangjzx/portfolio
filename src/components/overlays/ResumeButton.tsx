import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { PROFILE } from '../../data/profile';

/**
 * Floating resume download button — always visible in bottom-right corner.
 * One-click download so recruiters never have to hunt for it.
 */
export function ResumeButton() {
  return (
    <motion.a
      href={PROFILE.resumeUrl}
      download
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download résumé (PDF)"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-line bg-white/90 px-4 py-3 font-medium text-ink shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-indigo-300 hover:shadow-xl sm:px-5 sm:py-3.5"
      style={{ boxShadow: '0 8px 32px rgba(99,102,241,0.12)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <Download size={16} className="text-indigo-500" />
      <span className="text-sm sm:text-base">Résumé</span>
    </motion.a>
  );
}

export default ResumeButton;
