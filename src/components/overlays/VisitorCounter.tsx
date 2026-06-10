import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

/**
 * Visitor Counter — a subtle indicator showing the visit count.
 * Uses localStorage to simulate visits (increment per session).
 * In production, swap with a real API (e.g., Supabase or Vercel Analytics).
 */

const STORAGE_KEY = 'portfolio-visit-count';
const SESSION_KEY = 'portfolio-session-counted';

function getVisitCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

function incrementVisitCount(): number {
  try {
    const sessionCounted = sessionStorage.getItem(SESSION_KEY);
    const current = getVisitCount();
    if (!sessionCounted) {
      const next = current + 1;
      localStorage.setItem(STORAGE_KEY, String(next));
      sessionStorage.setItem(SESSION_KEY, 'true');
      return next;
    }
    return current;
  } catch {
    return 1;
  }
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const visits = incrementVisitCount();
    setCount(visits);
  }, []);

  if (count === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-md sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:px-4 sm:py-2 print:hidden"
    >
      <Eye size={12} className="text-indigo-400" />
      <span className="text-[11px] text-ink-muted sm:text-xs">
        Visit #{count.toLocaleString()}
      </span>
    </motion.div>
  );
}

export default VisitorCounter;
