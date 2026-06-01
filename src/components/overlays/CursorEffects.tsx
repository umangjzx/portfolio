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

  const isTouch = usePortfolioStore((s) => s.isTouch);

  const applyMagneticPull = useCallback(() => {
    const { x, y } = mousePos.current;
    magneticElements.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { translateX, translateY } = computeMagneticPull(x, y, centerX, centerY);

      el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      el.style.transition = 'transform 150ms ease-out';
    });
  }, []);

  // Animation loop for smooth ring trailing
  useEffect(() => {
    if (isTouchDevice.current || isTouch) return;

    let animFrame: number;
    const loop = () => {
      // Linear interpolation for smooth trailing
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.2;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.2;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHoveringInteractive.current ? 1.5 : 1})`;
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
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(${isHoveringInteractive.current ? 0 : 1})`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
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
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] transition-transform duration-100 ease-out"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
      />
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{ 
          border: '2px solid rgba(139, 92, 246, 0.6)',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)',
          transition: 'transform 0.1s ease-out, opacity 0.2s ease' 
        }}
      />
    </>
  );
}
