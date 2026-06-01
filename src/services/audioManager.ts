/**
 * AudioManagerService
 *
 * Manages Web Audio API context initialization and mute state.
 * Initializes audio context on first user interaction.
 * Persists mute/unmute preference in localStorage.
 * Gracefully handles unsupported environments (SSR, restricted browsers).
 *
 * Validates: Requirements 17.1, 17.3, 17.4
 */

export interface AudioManagerService {
  initialize(): Promise<boolean>;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
  isSupported(): boolean;
}

const STORAGE_KEY = 'portfolio-audio-muted';

function getStoredMutePreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return true; // Default to muted on first visit
    return stored === 'true';
  } catch {
    return true; // Default to muted if localStorage is unavailable
  }
}

function persistMutePreference(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

function detectAudioSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

function createAudioManager(): AudioManagerService {
  let muted: boolean = getStoredMutePreference();
  let supported: boolean = detectAudioSupport();
  let audioContext: AudioContext | null = null;
  let initialized = false;

  return {
    async initialize(): Promise<boolean> {
      if (initialized) return supported;

      if (!supported) {
        initialized = true;
        return false;
      }

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

        if (!AudioCtx) {
          supported = false;
          initialized = true;
          return false;
        }

        audioContext = new AudioCtx();

        // Resume context to handle autoplay policy restrictions
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        initialized = true;
        return true;
      } catch {
        // Browser restriction or other failure
        supported = false;
        audioContext = null;
        initialized = true;
        return false;
      }
    },

    setMuted(value: boolean): void {
      muted = value;
      persistMutePreference(value);
    },

    isMuted(): boolean {
      return muted;
    },

    isSupported(): boolean {
      return supported;
    },
  };
}

// Export as singleton instance
export const audioManager = createAudioManager();
