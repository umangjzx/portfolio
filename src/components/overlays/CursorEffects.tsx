import { useEffect, useRef, useCallback } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { detectTouchDevice } from '../../services/mouseTracker';

import { computeMagneticPull } from '../../utils/computations';

export default function CursorEffects() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isTouchDevice = useRef(detectTouchDevice());
  const magneticElements = useRef<HTMLElement[]>([]);
  const isHoveringInteractive = useRef(false);
  const lastFrameTime = useRef(0);

  const isTouch = usePortfolioStore((s) => s.isTouch);

  const applyMagneticPull = useCallback(() => {
    const { x, y } = mousePos.current;
    magneticElements.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { translateX, translateY } = computeMagneticPull(x, y, centerX, centerY);

      el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }, []);

  // Animation loop — optimized for 120Hz+ with frame-rate independent lerping
  useEffect(() => {
    if (isTouchDevice.current || isTouch) return;

    let animFrame: number;
    lastFrameTime.current = performance.now();

    const loop = (now: number) => {
      // Frame-rate independent interpolation (smooth at 60Hz, 120Hz, 144Hz, 240Hz)
      const dt = Math.min((now - lastFrameTime.current) / 1000, 0.05); // cap at 50ms
      lastFrameTime.current = now;
      
      // Use exponential decay for frame-rate independent smoothing
      // Factor of 12 gives ~83ms response time (butter-smooth trailing)
      const lerpFactor = 1 - Math.exp(-12 * dt);

      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${isHoveringInteractive.current ? 1.5 : 1})`;
        cursorRingRef.current.style.opacity = isHoveringInteractive.current ? '0.3' : '0.7';
      }

      applyMagneticPull();
      animFrame = requestAnimationFrame(loop);
    };
    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [applyMagneticPull, isTouch]);

  useEffect(() => {
    if (isTouchDevice.current || isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        // Dot follows instantly — use translate3d for GPU compositing
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${isHoveringInteractive.current ? 0 : 1})`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouch]);

  useEffect(() => {
    if (isTouchDevice.current || isTouch) return;

    const collectElements = () => {
      const selectors = 'a, button, [role="button"], input, textarea, [data-magnetic]';
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors));
      magneticElements.current = elements;

      elements.forEach(el => {
        el.addEventListener('mouseenter', () => isHoveringInteractive.current = true);
        el.addEventListener('mouseleave', () => isHoveringInteractive.current = false);
      });
    };

    collectElements();
    const observer = new MutationObserver(collectElements);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isTouch]);

  useEffect(() => {
    if (isTouchDevice.current || isTouch) return;

    document.body.style.cursor = 'none';
    return () => { document.body.style.cursor = ''; };
  }, [isTouch]);

  // Conditional render AFTER all hooks
  if (isTouchDevice.current || isTouch) return null;

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999]"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          contain: 'layout style size',
        }}
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ 
          border: '2px solid rgba(139, 92, 246, 0.6)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          contain: 'layout style size',
        }}
      />
    </>
  );
}
