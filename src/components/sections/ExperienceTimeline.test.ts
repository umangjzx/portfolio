import { describe, it, expect } from 'vitest';
import { computeTimelineIllumination } from '../../utils/computations';

describe('computeTimelineIllumination', () => {
  const viewportHeight = 1000;

  it('returns empty arrays for no nodes', () => {
    const result = computeTimelineIllumination([], 0, viewportHeight);
    expect(result.illuminated).toEqual([]);
    expect(result.progressFill).toBe(0);
  });

  it('returns all dimmed when no nodes have scrolled past 75% threshold', () => {
    // Nodes at positions 1000, 2000, 3000 — scroll at 0
    // Threshold = 0 + 1000 * 0.75 = 750
    // All nodes are above threshold (positions > 750)
    const nodePositions = [1000, 2000, 3000];
    const result = computeTimelineIllumination(nodePositions, 0, viewportHeight);
    expect(result.illuminated).toEqual([false, false, false]);
    expect(result.progressFill).toBe(0);
  });

  it('illuminates nodes that have scrolled past 75% threshold', () => {
    // Nodes at positions 500, 1000, 1500
    // Scroll at 800, threshold = 800 + 1000 * 0.75 = 1550
    // Node at 500 < 1550 → illuminated
    // Node at 1000 < 1550 → illuminated
    // Node at 1500 < 1550 → illuminated
    const nodePositions = [500, 1000, 1500];
    const result = computeTimelineIllumination(nodePositions, 800, viewportHeight);
    expect(result.illuminated).toEqual([true, true, true]);
    expect(result.progressFill).toBe(1);
  });

  it('partially illuminates nodes based on scroll position', () => {
    // Nodes at positions 500, 1000, 1500, 2000, 2500
    // Scroll at 500, threshold = 500 + 1000 * 0.75 = 1250
    // Node at 500 < 1250 → illuminated
    // Node at 1000 < 1250 → illuminated
    // Node at 1500 >= 1250 → not illuminated
    // Node at 2000 >= 1250 → not illuminated
    // Node at 2500 >= 1250 → not illuminated
    const nodePositions = [500, 1000, 1500, 2000, 2500];
    const result = computeTimelineIllumination(nodePositions, 500, viewportHeight);
    expect(result.illuminated).toEqual([true, true, false, false, false]);
    expect(result.progressFill).toBe(2 / 5);
  });

  it('computes progressFill as ratio of illuminated to total nodes', () => {
    const nodePositions = [100, 200, 300, 400, 500];
    // Scroll at 0, threshold = 750
    // Nodes at 100, 200, 300, 400, 500 — all < 750 → all illuminated
    const result = computeTimelineIllumination(nodePositions, 0, viewportHeight);
    expect(result.progressFill).toBe(1);
  });

  it('handles node exactly at threshold boundary (not illuminated)', () => {
    // Node at exactly the threshold position should NOT be illuminated
    // threshold = scrollPosition + viewportHeight * 0.75
    // If scroll = 0, viewport = 1000, threshold = 750
    // Node at 750 is NOT < 750, so not illuminated
    const nodePositions = [750];
    const result = computeTimelineIllumination(nodePositions, 0, viewportHeight);
    expect(result.illuminated).toEqual([false]);
    expect(result.progressFill).toBe(0);
  });

  it('handles node just below threshold (illuminated)', () => {
    // Node at 749 < 750 → illuminated
    const nodePositions = [749];
    const result = computeTimelineIllumination(nodePositions, 0, viewportHeight);
    expect(result.illuminated).toEqual([true]);
    expect(result.progressFill).toBe(1);
  });

  it('handles single node illuminated', () => {
    const nodePositions = [100];
    const result = computeTimelineIllumination(nodePositions, 0, viewportHeight);
    expect(result.illuminated).toEqual([true]);
    expect(result.progressFill).toBe(1);
  });
});
