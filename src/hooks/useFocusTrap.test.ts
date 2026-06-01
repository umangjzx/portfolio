import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    button1 = document.createElement('button');
    button1.textContent = 'First';
    button2 = document.createElement('button');
    button2.textContent = 'Last';
    input = document.createElement('input');
    input.type = 'text';

    container.appendChild(button1);
    container.appendChild(input);
    container.appendChild(button2);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  it('returns a ref object', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('does not trap focus when inactive', () => {
    const { result } = renderHook(() => useFocusTrap(false));
    // Assign the container to the ref
    Object.defineProperty(result.current, 'current', {
      value: container,
      writable: true,
    });

    // Body overflow should not be changed
    expect(document.body.style.overflow).toBe('');
  });

  it('sets body overflow to hidden when active', async () => {
    const { result } = renderHook(() => useFocusTrap(true));
    // Simulate ref assignment
    Object.defineProperty(result.current, 'current', {
      value: container,
      writable: true,
    });

    // Re-render with active state to trigger the effect
    const { rerender } = renderHook(
      ({ isActive }) => {
        const ref = useFocusTrap(isActive);
        Object.defineProperty(ref, 'current', {
          value: container,
          writable: true,
          configurable: true,
        });
        return ref;
      },
      { initialProps: { isActive: true } }
    );

    // Wait for the effect
    await new Promise((r) => setTimeout(r, 60));
    expect(document.body.style.overflow).toBe('hidden');

    // Cleanup: deactivate
    rerender({ isActive: false });
  });

  it('calls onEscape when Escape key is pressed', async () => {
    const onEscape = vi.fn();

    renderHook(() => {
      const ref = useFocusTrap(true, { onEscape });
      Object.defineProperty(ref, 'current', {
        value: container,
        writable: true,
        configurable: true,
      });
      return ref;
    });

    await new Promise((r) => setTimeout(r, 60));

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.dispatchEvent(event);

    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});
