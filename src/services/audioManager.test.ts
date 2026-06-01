import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need to test the factory function, so we re-import fresh each time
// by dynamically importing the module

describe('AudioManagerService', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
    });
  });

  // Helper to create a fresh audio manager instance
  async function createFreshManager() {
    // Reset module cache to get a fresh singleton
    vi.resetModules();
    const mod = await import('./audioManager');
    return mod.audioManager;
  }

  describe('isMuted', () => {
    it('should default to muted (true) on first visit when no localStorage value exists', async () => {
      const manager = await createFreshManager();
      expect(manager.isMuted()).toBe(true);
    });

    it('should read stored preference from localStorage', async () => {
      localStorageMock['portfolio-audio-muted'] = 'false';
      const manager = await createFreshManager();
      expect(manager.isMuted()).toBe(false);
    });

    it('should read stored muted=true from localStorage', async () => {
      localStorageMock['portfolio-audio-muted'] = 'true';
      const manager = await createFreshManager();
      expect(manager.isMuted()).toBe(true);
    });
  });

  describe('setMuted', () => {
    it('should update mute state to false', async () => {
      const manager = await createFreshManager();
      manager.setMuted(false);
      expect(manager.isMuted()).toBe(false);
    });

    it('should update mute state to true', async () => {
      const manager = await createFreshManager();
      manager.setMuted(false);
      manager.setMuted(true);
      expect(manager.isMuted()).toBe(true);
    });

    it('should persist preference to localStorage', async () => {
      const manager = await createFreshManager();
      manager.setMuted(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-audio-muted', 'false');
    });

    it('should persist muted=true to localStorage', async () => {
      const manager = await createFreshManager();
      manager.setMuted(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('portfolio-audio-muted', 'true');
    });
  });

  describe('isSupported', () => {
    it('should return true when AudioContext is available', async () => {
      vi.stubGlobal('AudioContext', vi.fn());
      const manager = await createFreshManager();
      expect(manager.isSupported()).toBe(true);
    });

    it('should return true when webkitAudioContext is available', async () => {
      // Remove standard AudioContext, provide webkit version
      const origAudioContext = (window as unknown as Record<string, unknown>).AudioContext;
      delete (window as unknown as Record<string, unknown>).AudioContext;
      vi.stubGlobal('webkitAudioContext', vi.fn());
      const manager = await createFreshManager();
      expect(manager.isSupported()).toBe(true);
      // Restore
      if (origAudioContext) {
        vi.stubGlobal('AudioContext', origAudioContext);
      }
    });

    it('should return false when neither AudioContext nor webkitAudioContext exists', async () => {
      const origAudioContext = (window as unknown as Record<string, unknown>).AudioContext;
      const origWebkit = (window as unknown as Record<string, unknown>).webkitAudioContext;
      delete (window as unknown as Record<string, unknown>).AudioContext;
      delete (window as unknown as Record<string, unknown>).webkitAudioContext;
      const manager = await createFreshManager();
      expect(manager.isSupported()).toBe(false);
      // Restore
      if (origAudioContext) vi.stubGlobal('AudioContext', origAudioContext);
      if (origWebkit) vi.stubGlobal('webkitAudioContext', origWebkit);
    });
  });

  describe('initialize', () => {
    it('should return true when AudioContext initializes successfully', async () => {
      const mockResume = vi.fn().mockResolvedValue(undefined);
      const MockAudioContext = vi.fn().mockImplementation(function () {
        return { state: 'suspended', resume: mockResume };
      });
      vi.stubGlobal('AudioContext', MockAudioContext);
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result = await manager.initialize();

      expect(result).toBe(true);
      expect(MockAudioContext).toHaveBeenCalled();
      expect(mockResume).toHaveBeenCalled();
    });

    it('should return true without calling resume if context is already running', async () => {
      const mockResume = vi.fn().mockResolvedValue(undefined);
      const MockAudioContext = vi.fn().mockImplementation(function () {
        return { state: 'running', resume: mockResume };
      });
      vi.stubGlobal('AudioContext', MockAudioContext);
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result = await manager.initialize();

      expect(result).toBe(true);
      expect(mockResume).not.toHaveBeenCalled();
    });

    it('should return false when AudioContext constructor throws', async () => {
      const MockAudioContext = vi.fn().mockImplementation(function () {
        throw new Error('Not allowed');
      });
      vi.stubGlobal('AudioContext', MockAudioContext);
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result = await manager.initialize();

      expect(result).toBe(false);
      expect(manager.isSupported()).toBe(false);
    });

    it('should return false when resume rejects', async () => {
      const MockAudioContext = vi.fn().mockImplementation(function () {
        return { state: 'suspended', resume: vi.fn().mockRejectedValue(new Error('Not allowed')) };
      });
      vi.stubGlobal('AudioContext', MockAudioContext);
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result = await manager.initialize();

      expect(result).toBe(false);
      expect(manager.isSupported()).toBe(false);
    });

    it('should return false in unsupported environments', async () => {
      delete (window as unknown as Record<string, unknown>).AudioContext;
      delete (window as unknown as Record<string, unknown>).webkitAudioContext;
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result = await manager.initialize();

      expect(result).toBe(false);
      expect(manager.isSupported()).toBe(false);
    });

    it('should only initialize once and return cached result on subsequent calls', async () => {
      const MockAudioContext = vi.fn().mockImplementation(function () {
        return { state: 'running', resume: vi.fn() };
      });
      vi.stubGlobal('AudioContext', MockAudioContext);
      vi.resetModules();

      const { audioManager: manager } = await import('./audioManager');
      const result1 = await manager.initialize();
      const result2 = await manager.initialize();

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(MockAudioContext).toHaveBeenCalledTimes(1);
    });
  });
});
