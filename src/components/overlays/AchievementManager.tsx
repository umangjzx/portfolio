import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { Trophy } from 'lucide-react';

export function AchievementManager() {
  const achievements = usePortfolioStore((s) => s.achievements);
  const [toasts, setToasts] = useState<string[]>([]);
  const [prevAchievements, setPrevAchievements] = useState<string[]>([]);

  useEffect(() => {
    const newOnes = achievements.filter(a => !prevAchievements.includes(a));
    if (newOnes.length > 0) {
      setToasts(prev => [...prev, ...newOnes]);
      setPrevAchievements(achievements);
      newOnes.forEach(id => {
        setTimeout(() => setToasts(prev => prev.filter(t => t !== id)), 4500);
      });
    }
  }, [achievements, prevAchievements]);

  return (
    <div className="fixed bottom-24 right-5 z-[60] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(id => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 48, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl pointer-events-auto"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              maxWidth: '300px',
            }}
          >
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              <Trophy size={22} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
                Achievement Unlocked
              </p>
              <p className="text-sm font-bold text-gray-900">{id}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AchievementManager;
