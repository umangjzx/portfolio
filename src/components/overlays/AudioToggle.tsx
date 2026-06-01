import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../../services/audioManager';
import { usePortfolioStore } from '../../store/portfolioStore';

export function AudioToggle() {
  const isMuted = usePortfolioStore((s) => s.isMuted);
  const isAudioSupported = usePortfolioStore((s) => s.isAudioSupported);
  const setMuted = usePortfolioStore((s) => s.setMuted);
  const setAudioSupported = usePortfolioStore((s) => s.setAudioSupported);

  const [initialized, setInitialized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const initAttempted = useRef(false);

  const handleFirstInteraction = useCallback(async () => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const success = await audioManager.initialize();
    setInitialized(true);

    if (success) {
      setAudioSupported(true);
    } else {
      setAudioSupported(false);
      setHidden(true);
    }
  }, [setAudioSupported]);

  useEffect(() => {
    if (initAttempted.current) return;
    const events = ['click', 'touchstart', 'keydown'] as const;
    const handler = () => {
      handleFirstInteraction();
      events.forEach((evt) => document.removeEventListener(evt, handler));
    };
    events.forEach((evt) => document.addEventListener(evt, handler, { once: false }));
    return () => events.forEach((evt) => document.removeEventListener(evt, handler));
  }, [handleFirstInteraction]);

  const handleToggle = useCallback(() => {
    if (!initialized && !initAttempted.current) handleFirstInteraction();
    const newMuted = !isMuted;
    setMuted(newMuted);
    audioManager.setMuted(newMuted);
  }, [initialized, isMuted, setMuted, handleFirstInteraction]);

  if (hidden || (initialized && !isAudioSupported)) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={handleToggle}
        className="fixed bottom-6 left-4 sm:left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 focus:outline-none"
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={isMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isMuted ? <MutedIcon /> : <UnmutedIcon />}
      </motion.button>
    </AnimatePresence>
  );
}

function MutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function UnmutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export default AudioToggle;
