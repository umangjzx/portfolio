import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AudioToggle } from './AudioToggle';

// Mock the audioManager service
vi.mock('../../services/audioManager', () => ({
  audioManager: {
    initialize: vi.fn().mockResolvedValue(true),
    setMuted: vi.fn(),
    isMuted: vi.fn().mockReturnValue(true),
    isSupported: vi.fn().mockReturnValue(true),
  },
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      ...props
    }: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('AudioToggle', () => {
  let localStorageMock: Record<string, string>;

  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should render the mute toggle button', () => {
    render(<AudioToggle />);
    const button = screen.getByRole('button', { name: /unmute audio/i });
    expect(button).toBeInTheDocument();
  });

  it('should have correct aria-label when muted', () => {
    render(<AudioToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Unmute audio');
  });

  it('should toggle mute state on click', async () => {
    render(<AudioToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      // After clicking, the label should change to "Mute audio"
      expect(button).toHaveAttribute('aria-label', 'Mute audio');
    });
  });

  it('should render with fixed positioning classes', () => {
    render(<AudioToggle />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('fixed');
    expect(button.className).toContain('bottom-6');
    expect(button.className).toContain('left-6');
  });

  it('should have z-50 for visibility on all sections', () => {
    render(<AudioToggle />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('z-50');
  });

  it('should initialize audio context on first user interaction', async () => {
    const { audioManager } = await import('../../services/audioManager');
    render(<AudioToggle />);

    // Simulate a user interaction (click on document)
    fireEvent.click(document);

    await waitFor(() => {
      expect(audioManager.initialize).toHaveBeenCalled();
    });
  });

  it('should hide toggle when audio is not supported after initialization', async () => {
    // Override the mock to return false (unsupported)
    const { audioManager } = await import('../../services/audioManager');
    vi.mocked(audioManager.initialize).mockResolvedValue(false);

    const { container } = render(<AudioToggle />);

    // Trigger initialization
    fireEvent.click(document);

    await waitFor(() => {
      expect(container.querySelector('button')).toBeNull();
    });
  });
});
