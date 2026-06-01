import type { AITopic, AIResponse } from '../types';
import { AI_KNOWLEDGE } from '../data/ai-knowledge';

const FALLBACK_MESSAGE =
  'I can answer questions about: skills, projects, contact information, and experience. What would you like to know?';

export interface AIResponderService {
  respond(question: string): AIResponse;
  getAvailableTopics(): AITopic[];
}

function createAIResponder(): AIResponderService {
  function respond(question: string): AIResponse {
    const lowerQuestion = question.toLowerCase();

    // Count keyword matches for each topic
    let bestTopic: (typeof AI_KNOWLEDGE)[number] | null = null;
    let bestMatchCount = 0;

    for (const entry of AI_KNOWLEDGE) {
      const matchCount = entry.keywords.filter((keyword) =>
        lowerQuestion.includes(keyword.toLowerCase())
      ).length;

      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestTopic = entry;
      }
    }

    if (bestTopic && bestMatchCount > 0) {
      const randomIndex = Math.floor(Math.random() * bestTopic.responses.length);
      return {
        content: bestTopic.responses[randomIndex],
        topic: bestTopic.topic,
      };
    }

    return {
      content: FALLBACK_MESSAGE,
      topic: 'fallback',
    };
  }

  function getAvailableTopics(): AITopic[] {
    return ['skills', 'projects', 'contact', 'experience'];
  }

  return { respond, getAvailableTopics };
}

export const aiResponder = createAIResponder();
