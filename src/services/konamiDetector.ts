/**
 * Konami Code Detector Service
 *
 * Tracks keyboard input and detects the Konami code sequence:
 * Up, Up, Down, Down, Left, Right, Left, Right, B, A
 *
 * Returns true only when the last 10 keys exactly match the sequence.
 * Any incorrect key resets the detection state.
 */

const KONAMI_SEQUENCE: readonly string[] = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

export class KonamiDetector {
  private buffer: string[] = [];

  /**
   * Handle a key press event.
   * @param key - The key value from KeyboardEvent.key
   * @returns true if the Konami code sequence has been completed
   */
  handleKeyDown(key: string): boolean {
    const nextIndex = this.buffer.length;

    // Check if the pressed key matches the expected next key in the sequence
    if (key === KONAMI_SEQUENCE[nextIndex]) {
      this.buffer.push(key);

      // Check if the full sequence has been entered
      if (this.buffer.length === KONAMI_SEQUENCE.length) {
        this.buffer = [];
        return true;
      }

      return false;
    }

    // Key doesn't match — reset the buffer
    this.buffer = [];

    // After resetting, check if this key could be the start of a new sequence
    if (key === KONAMI_SEQUENCE[0]) {
      this.buffer.push(key);
    }

    return false;
  }

  /**
   * Reset the detection state, clearing the input buffer.
   */
  reset(): void {
    this.buffer = [];
  }
}
