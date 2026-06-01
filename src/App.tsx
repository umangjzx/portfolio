import { useState, useCallback, lazy, Suspense, Component, type ReactNode, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Hooks
import { useScrollEngine } from './hooks/useScrollEngine';
import { usePerformance } from './hooks/usePerformance';
import { checkIsMobile } from './hooks/useIsMobile';

// Lightweight loading fallback (small footprint, no Three.js)
import SectionLoader from './components/SectionLoader';

// Eagerly loaded components (small, needed immediately or always visible)
import IntroLoader from './components/sections/IntroLoader';

// Global Background
const ParticleSwirl = lazy(() => import('./components/canvas/ParticleSwirl'));

// Lazy-loaded section components (heavy, below the fold or use Three.js/R3F)
const HeroSection = lazy(() => import('./components/sections/HeroSection'));
const SkillsGalaxy = lazy(() => import('./components/sections/SkillsGalaxy'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));
const ProjectUniverse = lazy(() => import('./components/sections/ProjectUniverse'));
const ExperienceTimeline = lazy(() => import('./components/sections/ExperienceTimeline'));
const GitHubCenter = lazy(() => import('./components/sections/GitHubCenter'));
const AILaboratory = lazy(() => import('./components/sections/AILaboratory'));
const ContactPortal = lazy(() => import('./components/sections/ContactPortal'));

// Lazy-loaded overlay components (not critical for initial render)
const AIAssistant = lazy(() => import('./components/overlays/AIAssistant').then(m => ({ default: m.AIAssistant })));
const CursorEffects = lazy(() => import('./components/overlays/CursorEffects'));
const AudioToggle = lazy(() => import('./components/overlays/AudioToggle').then(m => ({ default: m.AudioToggle })));
const CommandPalette = lazy(() => import('./components/overlays/CommandPalette').then(m => ({ default: m.CommandPalette })));
const KonamiEasterEgg = lazy(() => import('./components/overlays/KonamiEasterEgg'));
const LevelIndicator = lazy(() => import('./components/overlays/LevelIndicator').then(m => ({ default: m.LevelIndicator })));
const AchievementManager = lazy(() => import('./components/overlays/AchievementManager').then(m => ({ default: m.AchievementManager })));
const DeveloperTerminal = lazy(() => import('./components/overlays/DeveloperTerminal').then(m => ({ default: m.DeveloperTerminal })));

// Error Boundary to prevent crashes from propagating
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const isMobile = useMemo(() => checkIsMobile(), []);

  // Initialize Lenis scroll engine
  useScrollEngine();

  // Initialize GPU detection and set performance tier
  usePerformance();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-gray-900 font-sans overflow-x-hidden">
      <Suspense fallback={null}>
        <ParticleSwirl />
      </Suspense>

      {/* Skip to main content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          border: '1px solid rgba(139, 92, 246, 0.5)',
          color: '#a78bfa',
        }}
      >
        Skip to main content
      </a>

      {/* Intro Loader - shown until loading completes */}
      <AnimatePresence mode="wait">
        {!introComplete && (
          <motion.div
            key="intro-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isMobile ? 0.25 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100]"
            role="status"
            aria-label="Loading portfolio"
          >
            <IntroLoader onComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - rendered after intro completes */}
      <AnimatePresence>
        {introComplete && (
          <motion.main
            id="main-content"
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0.1 : 0.2 }}
            aria-label="Portfolio content"
          >
            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <HeroSection isVisible={introComplete} />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <AboutSection />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <SkillsGalaxy />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <ProjectUniverse />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <GitHubCenter />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <ExperienceTimeline />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <AILaboratory />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<SectionLoader />}>
              <Suspense fallback={<SectionLoader />}>
                <ContactPortal />
              </Suspense>
            </ErrorBoundary>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Overlay components - each in its own boundary so one failure doesn't crash all */}
      <ErrorBoundary>
        <Suspense fallback={null}>
          <CursorEffects />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <aside aria-label="Interactive tools">
            <AIAssistant />
            <AudioToggle />
          </aside>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <KonamiEasterEgg />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <LevelIndicator />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <AchievementManager />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <DeveloperTerminal />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
