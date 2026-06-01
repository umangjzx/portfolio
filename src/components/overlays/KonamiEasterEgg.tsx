import { useEffect, useRef } from 'react';
import { KonamiDetector } from '../../services/konamiDetector';
import { usePortfolioStore } from '../../store/portfolioStore';

/**
 * ASCII art and styled console message logged on page load.
 * Requirement 14.3: Log styled developer console messages with ASCII art.
 */
function logConsoleEasterEgg(): void {
  const asciiArt = `
 ██╗   ██╗███╗   ███╗ █████╗ ███╗   ██╗ ██████╗ 
 ██║   ██║████╗ ████║██╔══██╗████╗  ██║██╔════╝ 
 ██║   ██║██╔████╔██║███████║██╔██╗ ██║██║  ███╗
 ██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║██║   ██║
 ╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║╚██████╔╝
  ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
`;

  console.log(
    `%c${asciiArt}`,
    'color: #00F5FF; font-family: monospace; font-size: 10px; line-height: 1.2;'
  );
  console.log(
    '%c🚀 Umang Jaiswal | Entrepreneur • Developer • AI Builder',
    'color: #8B5CF6; font-size: 16px; font-weight: bold; padding: 8px 0;'
  );
  console.log(
    '%c💡 Hint: Try the Konami Code (↑↑↓↓←→←→BA) for a surprise!',
    'color: #EC4899; font-size: 12px; font-style: italic;'
  );
  console.log(
    '%c⚡ Built with React + TypeScript + Vite + Three.js + Framer Motion',
    'color: #06B6D4; font-size: 11px;'
  );
}

/**
 * KonamiEasterEgg Component
 *
 * Integrates the Konami Detector service with a global keydown listener.
 * - On first activation: toggles cyberpunk mode ON (neon-dominant colors, CRT scanlines,
 *   chromatic aberration, increased glow)
 * - On second activation: restores default theme
 * - Logs styled console messages with ASCII art on page load
 *
 * Requirements: 14.1, 14.2, 14.3, 14.4
 */
export default function KonamiEasterEgg() {
  const detectorRef = useRef<KonamiDetector>(new KonamiDetector());
  const toggleCyberpunkMode = usePortfolioStore((s) => s.toggleCyberpunkMode);
  const isCyberpunkMode = usePortfolioStore((s) => s.isCyberpunkMode);

  // Log ASCII art on mount (page load) — Requirement 14.3
  useEffect(() => {
    logConsoleEasterEgg();
  }, []);

  // Global keydown listener for Konami code detection — Requirements 14.1, 14.2
  useEffect(() => {
    const detector = detectorRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      const activated = detector.handleKeyDown(event.key);
      if (activated) {
        toggleCyberpunkMode();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleCyberpunkMode]);

  // Apply/remove cyberpunk mode class on <html> element — Requirement 14.4
  useEffect(() => {
    const root = document.documentElement;
    if (isCyberpunkMode) {
      root.classList.add('cyberpunk-mode');
    } else {
      root.classList.remove('cyberpunk-mode');
    }
    return () => {
      root.classList.remove('cyberpunk-mode');
    };
  }, [isCyberpunkMode]);

  // Render CRT scanline overlay when cyberpunk mode is active — Requirement 14.4
  if (!isCyberpunkMode) return null;

  return (
    <div
      className="cyberpunk-overlay"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* CRT Scanlines */}
      <div
        className="crt-scanlines"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 3px)',
          animation: 'scanline-scroll 8s linear infinite',
        }}
      />
      {/* Chromatic Aberration Edges */}
      <div
        className="chromatic-aberration"
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow:
            'inset 3px 0 6px rgba(255, 0, 100, 0.3), inset -3px 0 6px rgba(0, 245, 255, 0.3)',
        }}
      />
      {/* Increased Glow Vignette */}
      <div
        className="neon-glow-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow:
            'inset 0 0 120px rgba(0, 245, 255, 0.08), inset 0 0 60px rgba(139, 92, 246, 0.06)',
        }}
      />
    </div>
  );
}
