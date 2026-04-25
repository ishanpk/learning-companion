/**
 * Spaced Repetition Scheduling System
 * Implements a simplified SM-2 algorithm for quiz review scheduling.
 *
 * Intervals: 1 day → 3 days → 7 days → 14 days → 30 days
 */

export interface ReviewCard {
  /** Unique ID (e.g. `courseId:moduleIndex:quizIndex`) */
  id: string;
  /** Unix timestamp of last review */
  lastReviewed: number;
  /** Unix timestamp when the next review is due */
  nextReview: number;
  /** How many consecutive correct answers (0-5) */
  streak: number;
  /** Current interval index (maps to INTERVALS array) */
  intervalIndex: number;
}

/** Intervals in milliseconds: 1d, 3d, 7d, 14d, 30d */
const INTERVALS = [
  1 * 24 * 60 * 60 * 1000,   // 1 day
  3 * 24 * 60 * 60 * 1000,   // 3 days
  7 * 24 * 60 * 60 * 1000,   // 7 days
  14 * 24 * 60 * 60 * 1000,  // 14 days
  30 * 24 * 60 * 60 * 1000,  // 30 days
];

/**
 * Creates a new review card due immediately.
 */
export function createReviewCard(id: string): ReviewCard {
  return {
    id,
    lastReviewed: 0,
    nextReview: Date.now(), // due now
    streak: 0,
    intervalIndex: 0,
  };
}

/**
 * Updates a card after the user answers a quiz question.
 * Correct answers advance the interval; incorrect answers reset.
 */
export function updateReviewCard(card: ReviewCard, correct: boolean): ReviewCard {
  const now = Date.now();

  if (correct) {
    const newIndex = Math.min(card.intervalIndex + 1, INTERVALS.length - 1);
    return {
      ...card,
      lastReviewed: now,
      nextReview: now + INTERVALS[newIndex],
      streak: card.streak + 1,
      intervalIndex: newIndex,
    };
  }

  // Incorrect: reset to first interval
  return {
    ...card,
    lastReviewed: now,
    nextReview: now + INTERVALS[0],
    streak: 0,
    intervalIndex: 0,
  };
}

/**
 * Returns cards that are due for review (nextReview <= now).
 */
export function getDueCards(cards: ReviewCard[]): ReviewCard[] {
  const now = Date.now();
  return cards
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}

/**
 * Returns a human-readable string for when the next review is due.
 */
export function getNextReviewLabel(card: ReviewCard): string {
  const diff = card.nextReview - Date.now();
  if (diff <= 0) return 'Due now';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `In ${hours}h`;

  const days = Math.floor(hours / 24);
  return `In ${days}d`;
}
