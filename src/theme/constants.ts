/**
 * Design tokens for the portfolio — premium light theme.
 *
 * Palette (2026 founder/AI-builder aesthetic):
 *   Primary   #6366F1  Indigo
 *   Secondary #8B5CF6  Violet
 *   Accent    #06B6D4  Cyan
 *   Surface   #FAFAFA  Background
 *   Ink       #0F172A  Text
 *
 * Shape is kept backwards-compatible (colors.primary/secondary/accent.*,
 * gradient.*, glassmorphism.*, typography.*, animation.*) so existing
 * components keep type-checking while we migrate.
 */

export const THEME = {
  colors: {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Violet
    accent: {
      cyan: '#06B6D4',
      pink: '#EC4899',
      purple: '#8B5CF6',
      blue: '#6366F1',
      glassWhite: 'rgba(255, 255, 255, 0.72)',
    },
    background: '#FAFAFA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: {
      primary: '#0F172A', // Slate-900 ink
      secondary: '#475569', // Slate-600
      muted: '#94A3B8', // Slate-400
    },
    error: '#EF4444',
    success: '#10B981',
    gradient: {
      primary: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      accent: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
      warm: 'linear-gradient(135deg, #6366F1, #06B6D4)',
      glow: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    },
  },
  glassmorphism: {
    blur: '20px',
    borderOpacity: 0.08,
    gradientOpacity: 0.72,
  },
  typography: {
    fontFamily: "'Satoshi', 'Inter', sans-serif",
    display: "'Clash Display', 'Satoshi', sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    weights: {
      heading: 700,
      subheading: 600,
      body: 400,
    },
  },
  animation: {
    scrollDuration: 1.2,
    scrollEasing: [0.25, 0.0, 0.35, 1.0],
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
} as const;

/** Brand palette as plain hex strings for convenient reuse. */
export const PALETTE = {
  indigo: '#6366F1',
  violet: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#EC4899',
  emerald: '#10B981',
  amber: '#F59E0B',
  bg: '#FAFAFA',
  ink: '#0F172A',
  slate600: '#475569',
  slate400: '#94A3B8',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
} as const;
