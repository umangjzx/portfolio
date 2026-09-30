/**
 * Design tokens for the portfolio — premium light theme.
 *
 * Palette (2026 founder/AI-builder aesthetic):
 *   Primary   #625fbf  Indigo
 *   Secondary #8583d0  Violet
 *   Accent    #3f3d8c  Cyan
 *   Surface   #FAFAFA  Background
 *   Ink       #0F172A  Text
 *
 * Shape is kept backwards-compatible (colors.primary/secondary/accent.*,
 * gradient.*, glassmorphism.*, typography.*, animation.*) so existing
 * components keep type-checking while we migrate.
 */

export const THEME = {
  colors: {
    primary: '#625fbf', // Indigo
    secondary: '#8583d0', // Violet
    accent: {
      cyan: '#3f3d8c',
      pink: '#aeade2',
      purple: '#8583d0',
      blue: '#625fbf',
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
      primary: 'linear-gradient(135deg, #625fbf, #8583d0)',
      accent: 'linear-gradient(135deg, #8583d0, #3f3d8c)',
      warm: 'linear-gradient(135deg, #625fbf, #3f3d8c)',
      glow: 'linear-gradient(135deg, #8583d0, #625fbf)',
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
  indigo: '#625fbf',
  violet: '#8583d0',
  cyan: '#3f3d8c',
  pink: '#aeade2',
  emerald: '#10B981',
  amber: '#F59E0B',
  bg: '#FAFAFA',
  ink: '#0F172A',
  slate600: '#475569',
  slate400: '#94A3B8',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
} as const;
