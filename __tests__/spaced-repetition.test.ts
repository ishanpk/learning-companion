import { describe, it, expect } from 'vitest';
import {
  createReviewCard,
  updateReviewCard,
  getDueCards,
  getNextReviewLabel,
} from '@/lib/spaced-repetition';

describe('Spaced Repetition', () => {
  it('creates a review card that is due immediately', () => {
    const card = createReviewCard('test-1');
    expect(card.id).toBe('test-1');
    expect(card.streak).toBe(0);
    expect(card.intervalIndex).toBe(0);
    expect(card.nextReview).toBeLessThanOrEqual(Date.now());
  });

  it('advances interval on correct answer', () => {
    const card = createReviewCard('test-1');
    const updated = updateReviewCard(card, true);
    expect(updated.streak).toBe(1);
    expect(updated.intervalIndex).toBe(1);
    expect(updated.nextReview).toBeGreaterThan(Date.now());
  });

  it('resets interval on incorrect answer', () => {
    let card = createReviewCard('test-1');
    card = updateReviewCard(card, true); // advance to index 1
    card = updateReviewCard(card, true); // advance to index 2
    const reset = updateReviewCard(card, false);
    expect(reset.streak).toBe(0);
    expect(reset.intervalIndex).toBe(0);
  });

  it('caps interval at max', () => {
    let card = createReviewCard('test-1');
    for (let i = 0; i < 20; i++) {
      card = updateReviewCard(card, true);
    }
    // Should cap at index 4 (30 days)
    expect(card.intervalIndex).toBeLessThanOrEqual(4);
  });

  it('getDueCards returns only overdue cards', () => {
    const dueCard = createReviewCard('due');
    const futureCard = { ...createReviewCard('future'), nextReview: Date.now() + 999999 };
    const result = getDueCards([dueCard, futureCard]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('due');
  });

  it('getNextReviewLabel returns "Due now" for past cards', () => {
    const card = createReviewCard('test');
    expect(getNextReviewLabel(card)).toBe('Due now');
  });
});
