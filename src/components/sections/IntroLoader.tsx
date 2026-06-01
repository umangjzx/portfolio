import { useState, useEffect, useRef, lazy, Suspense, useMemo, Component, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '../../store/portfolioStore';
import { PROFILE } from '../../data/profile';

// Heavy 3D scene loaded on demand so it never bloats the initial bundle.
const CinematicIntro = lazy(() => import('../canvas/CinematicIntro'));

/** Error boundary that catches WebGL / Three.js crashes and triggers fallback. */
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface IntroLoaderProps {
  onComplete: () => void;
}

/** Seconds the 3D timeline runs (kept in sync with TIMELINE in CinematicIntro). */
const SEQUENCE = {
  GATHER_END: 1.6,
  FORM_START: 1.5,
  CHARGE_START: 3.4,
  PUSH_START: 3.9,
  FLASH_START: 5.0,
  TOTAL: 5.6,
};

/** Detects whether WebGL is usable; if not we fall back to a 2D reveal. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function IntroLoader({ onComplete }: IntroLoaderProps) {
  const { setLoadingComplete, gpuTier } = usePortfolioStore();

  // Story phase drives the DOM overlay (subtitle, HUD, flash) in lockstep
  // with the 3D timeline. We tick a master clock on mount.
  const [elapsed, setElapsed] = useState(0);
  const finishedRef = useRef(false);
  const startRef = useRef<number | null>(null);

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const webglOk = useMemo(() => detectWebGL(), []);
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );
  // Skip the heavy 3D intro entirely on mobile — use the fast 2D reveal instead.
  // This eliminates the biggest source of lag and gives a snappy first impression.
  const [sceneFailed, setSceneFailed] = useState(false);
  const cinematic = webglOk && !sceneFailed && !isMobile;
  const quality: 'high' | 'low' = gpuTier === 'high' && !reducedMotion ? 'high' : 'low';

  const finish = useRef(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    // Immediately hand off — the App wrapper handles the fade transition.
    // No flash needed since the background is already white (#fafafa).
    setLoadingComplete();
    onComplete();
  }).current;

  // Master clock — advances the DOM overlay and triggers the flash.
  useEffect(() => {
    if (!cinematic) return; // 2D fallback runs its own simplified timeline
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const t = (now - startRef.current) / 1000;
      setElapsed(t);
      if (t >= SEQUENCE.FLASH_START && !finishedRef.current) finish();
      if (t < SEQUENCE.TOTAL + 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cinematic, finish]);

  // Reduced-motion / no-WebGL / mobile: a calm, fast 2D reveal then continue.
  useEffect(() => {
    if (cinematic) return;
    // On mobile, finish faster (1.2s) for a snappy feel
    const t = setTimeout(finish, isMobile ? 1200 : 2200);
    return () => clearTimeout(t);
  }, [cinematic, finish, isMobile]);

  // Safety timeout: if the 3D scene hasn't fired onDone after 8s (slow device), force complete.
  useEffect(() => {
    if (!cinematic) return;
    const t = setTimeout(finish, 8000);
    return () => clearTimeout(t);
  }, [cinematic, finish]);

  const showSubtitle = elapsed >= SEQUENCE.CHARGE_START - 0.4 && elapsed < SEQUENCE.FLASH_START;
  const showHud = elapsed < SEQUENCE.PUSH_START;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ background: '#fafafa' }}
    >
      {cinematic ? (
            <>
              {/* ── 3D cinematic scene ── */}
              <SceneBoundary onError={() => { setSceneFailed(true); finish(); }}>
                <Suspense fallback={null}>
                  <CinematicIntro quality={quality} onDone={finish} />
                </Suspense>
              </SceneBoundary>

              {/* ── film grain + scanline atmosphere ── */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(99,102,241,0.15) 3px)',
                }}
              />

              {/* ── cinematic letterbox bars ── */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-20"
                style={{ background: 'linear-gradient(to bottom, #f1f5f9, transparent)' }}
                initial={{ height: '12vh' }}
                animate={{ height: elapsed >= SEQUENCE.PUSH_START ? '0vh' : '8vh' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
                style={{ background: 'linear-gradient(to top, #f1f5f9, transparent)' }}
                initial={{ height: '12vh' }}
                animate={{ height: elapsed >= SEQUENCE.PUSH_START ? '0vh' : '8vh' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />

              {/* ── cinematic subtitle (role line) ── */}
              <div className="pointer-events-none absolute inset-x-0 bottom-[16vh] z-30 flex justify-center px-6">
                <AnimatePresence>
                  {showSubtitle && (
                    <motion.p
                      key="subtitle"
                      className="text-center font-mono text-xs uppercase tracking-[0.45em] text-indigo-600 sm:text-sm"
                      initial={{ opacity: 0, y: 18, letterSpacing: '0.7em' }}
                      animate={{ opacity: 1, y: 0, letterSpacing: '0.45em' }}
                      exit={{ opacity: 0, filter: 'blur(8px)' }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {PROFILE.roles.join('  •  ')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* ── corner HUD (Iron-Man-style boot readout) ── */}
              <AnimatePresence>
                {showHud && (
                  <motion.div
                    key="hud"
                    className="pointer-events-none absolute inset-0 z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute left-6 top-[10vh] font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-500/70">
                      <div>◢ system.init</div>
                      <div className="mt-1 text-violet-500/60">
                        particles ················ {elapsed < SEQUENCE.FORM_START ? 'gathering' : 'locked'}
                      </div>
                      <div className="mt-1 text-cyan-600/60">
                        core ····················· {elapsed < SEQUENCE.GATHER_END ? 'igniting' : 'stable'}
                      </div>
                    </div>
                    <div className="absolute right-6 top-[10vh] text-right font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-500/70">
                      <div>render • {quality === 'high' ? 'ultra' : 'lite'}</div>
                      <div className="mt-1 text-violet-500/60">depth • parallax</div>
                    </div>
                    <div className="absolute bottom-[10vh] left-6 font-mono text-[10px] uppercase tracking-[0.25em] text-indigo-400/50">
                      umang.jaiswal // portfolio.exe
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── white-out handled by App's exit animation ── */}
            </>
          ) : (
            /* ── 2D fallback (no WebGL / scene crashed / mobile) ── */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <motion.h1
                className="font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: isMobile ? 0.6 : 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-gradient">{PROFILE.firstName}</span>{' '}
                <span className="text-ink">{PROFILE.lastName}</span>
              </motion.h1>
              <motion.p
                className="mt-5 font-mono text-xs uppercase tracking-[0.4em] text-ink-soft sm:text-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isMobile ? 0.3 : 0.6, duration: 0.5 }}
              >
                {PROFILE.roles.join('  •  ')}
              </motion.p>
            </div>
          )}
    </div>
  );
}
