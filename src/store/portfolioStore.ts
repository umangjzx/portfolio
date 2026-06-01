import { create } from 'zustand';
import type { GPUTier, MousePosition } from '../types';

/**
 * Global state store for the Futuristic Portfolio application.
 * Manages scroll state, GPU tier, theme mode, audio state, cursor position,
 * loading state, AI assistant state, and command palette state.
 */
export interface PortfolioStore {
  // Scroll state
  scrollPosition: number;
  currentSection: string;
  setScrollPosition: (position: number) => void;
  setCurrentSection: (section: string) => void;

  // Performance
  gpuTier: GPUTier;
  setGpuTier: (tier: GPUTier) => void;

  // Theme
  isCyberpunkMode: boolean;
  toggleCyberpunkMode: () => void;

  // Audio
  isMuted: boolean;
  isAudioSupported: boolean;
  setMuted: (muted: boolean) => void;
  setAudioSupported: (supported: boolean) => void;

  // Cursor
  cursorPosition: MousePosition;
  isTouch: boolean;
  setCursorPosition: (position: MousePosition) => void;
  setIsTouch: (isTouch: boolean) => void;

  // Intro
  isLoading: boolean;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  setLoadingComplete: () => void;

  // AI Assistant
  isAIOpen: boolean;
  toggleAI: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;

  // Developer Terminal
  isTerminalOpen: boolean;
  toggleTerminal: () => void;

  // Game State
  xp: number;
  level: number;
  achievements: string[];
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
}

const AUDIO_MUTED_KEY = 'portfolio-audio-muted';

/**
 * Reads the persisted audio muted preference from localStorage.
 * Defaults to true (muted) per requirement 17.3.
 */
function getPersistedMutedState(): boolean {
  try {
    const stored = localStorage.getItem(AUDIO_MUTED_KEY);
    if (stored === null) return true; // Default muted on first visit
    return stored === 'true';
  } catch {
    return true; // Default muted if localStorage unavailable
  }
}

/**
 * Persists the audio muted preference to localStorage.
 */
function persistMutedState(muted: boolean): void {
  try {
    localStorage.setItem(AUDIO_MUTED_KEY, String(muted));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  // Scroll state
  scrollPosition: 0,
  currentSection: 'hero',
  setScrollPosition: (position) => set({ scrollPosition: position }),
  setCurrentSection: (section) => set({ currentSection: section }),

  // Performance
  gpuTier: 'low' as GPUTier,
  setGpuTier: (tier) => set({ gpuTier: tier }),

  // Theme
  isCyberpunkMode: false,
  toggleCyberpunkMode: () =>
    set((state) => ({ isCyberpunkMode: !state.isCyberpunkMode })),

  // Audio - persisted to localStorage per requirement 17.3
  isMuted: getPersistedMutedState(),
  isAudioSupported: false,
  setMuted: (muted) => {
    persistMutedState(muted);
    set({ isMuted: muted });
  },
  setAudioSupported: (supported) => set({ isAudioSupported: supported }),

  // Cursor
  cursorPosition: { x: 0, y: 0, normalizedX: 0, normalizedY: 0 },
  isTouch: false,
  setCursorPosition: (position) => set({ cursorPosition: position }),
  setIsTouch: (isTouch) => set({ isTouch }),

  // Intro
  isLoading: true,
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setLoadingComplete: () => set({ isLoading: false, loadingProgress: 100 }),

  // AI Assistant
  isAIOpen: false,
  toggleAI: () => set((state) => ({ isAIOpen: !state.isAIOpen })),

  // Command Palette
  isCommandPaletteOpen: false,
  toggleCommandPalette: () =>
    set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

  // Developer Terminal
  isTerminalOpen: false,
  toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),

  // Game State
  xp: 0,
  level: 1,
  achievements: [],
  addXP: (amount) =>
    set((state) => {
      const newXP = state.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
      return { xp: newXP, level: newLevel };
    }),
  unlockAchievement: (id) =>
    set((state) => {
      if (!state.achievements.includes(id)) {
        return { achievements: [...state.achievements, id] };
      }
      return state;
    }),
}));
