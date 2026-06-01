import type { Command } from '../types';

/**
 * FuzzySearchService - Implements fuzzy matching for the Command Palette.
 * Matches query characters in order within command labels and keywords,
 * scoring based on consecutive matches, position, and exact substring bonuses.
 */

export interface FuzzySearchService {
  search(query: string, commands: Command[]): Command[];
}

/**
 * Compute a fuzzy match score for a query against a target string.
 * Returns -1 if no match, otherwise a positive relevance score.
 *
 * Scoring factors:
 * - Consecutive character matches get bonus points
 * - Earlier first-match position scores higher
 * - Exact substring match gets a large bonus
 */
function fuzzyScore(query: string, target: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerTarget = target.toLowerCase();

  // Exact substring match bonus
  const exactSubstringBonus = lowerTarget.includes(lowerQuery) ? 100 : 0;

  // Check if query characters appear in order within target
  let queryIndex = 0;
  let firstMatchPosition = -1;
  let consecutiveCount = 0;
  let maxConsecutive = 0;
  let lastMatchIndex = -2; // Initialize to impossible value
  let score = 0;

  for (let i = 0; i < lowerTarget.length && queryIndex < lowerQuery.length; i++) {
    if (lowerTarget[i] === lowerQuery[queryIndex]) {
      if (firstMatchPosition === -1) {
        firstMatchPosition = i;
      }

      // Track consecutive matches
      if (i === lastMatchIndex + 1) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        consecutiveCount = 1;
      }

      lastMatchIndex = i;
      queryIndex++;
    }
  }

  // If not all query characters were matched, no match
  if (queryIndex < lowerQuery.length) {
    return -1;
  }

  // Position bonus: earlier matches score higher (max 50 points)
  const positionScore = Math.max(0, 50 - firstMatchPosition * 5);

  // Consecutive bonus: reward sequential character matches
  const consecutiveScore = maxConsecutive * 20;

  score = positionScore + consecutiveScore + exactSubstringBonus;

  return score;
}

/**
 * Compute the best fuzzy score for a query against a command,
 * checking both the label and all keywords.
 */
function scoreCommand(query: string, command: Command): number {
  const labelScore = fuzzyScore(query, command.label);

  let bestKeywordScore = -1;
  for (const keyword of command.keywords) {
    const keywordScore = fuzzyScore(query, keyword);
    if (keywordScore > bestKeywordScore) {
      bestKeywordScore = keywordScore;
    }
  }

  // Return the best score from label or keywords
  // Give label matches a slight bonus since they're more relevant
  const adjustedLabelScore = labelScore >= 0 ? labelScore + 10 : -1;

  return Math.max(adjustedLabelScore, bestKeywordScore);
}

class FuzzySearchServiceImpl implements FuzzySearchService {
  /**
   * Search commands using fuzzy matching.
   * - If query is empty, return all commands.
   * - Otherwise, return only matching commands sorted by relevance (highest first).
   */
  search(query: string, commands: Command[]): Command[] {
    if (!query || query.trim() === '') {
      return [...commands];
    }

    const trimmedQuery = query.trim();

    const scored: Array<{ command: Command; score: number }> = [];

    for (const command of commands) {
      const score = scoreCommand(trimmedQuery, command);
      if (score >= 0) {
        scored.push({ command, score });
      }
    }

    // Sort by score descending (highest relevance first)
    scored.sort((a, b) => b.score - a.score);

    return scored.map((entry) => entry.command);
  }
}

export const fuzzySearchService: FuzzySearchService = new FuzzySearchServiceImpl();
