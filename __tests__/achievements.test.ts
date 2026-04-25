import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  checkNewAchievements,
  type UserStats,
} from '@/lib/achievements';

describe('Achievements', () => {
  const emptyStats: UserStats = {
    evolvedSkillCount: 0,
    highestSkillLevel: 0,
    totalCourses: 0,
    focusSessionsCompleted: 0,
    currentStreak: 0,
    quizzesCompleted: 0,
  };

  it('returns no achievements for empty stats', () => {
    const result = checkNewAchievements(emptyStats, []);
    expect(result).toHaveLength(0);
  });

  it('unlocks first_evolved when a skill reaches max', () => {
    const stats: UserStats = { ...emptyStats, evolvedSkillCount: 1 };
    const result = checkNewAchievements(stats, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('first_evolved');
  });

  it('unlocks path_pioneer when first course is generated', () => {
    const stats: UserStats = { ...emptyStats, totalCourses: 1 };
    const result = checkNewAchievements(stats, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('path_pioneer');
  });

  it('does not re-unlock already unlocked achievements', () => {
    const stats: UserStats = { ...emptyStats, totalCourses: 1 };
    const result = checkNewAchievements(stats, ['path_pioneer']);
    const ids = result.map((a) => a.id);
    expect(ids).not.toContain('path_pioneer');
  });

  it('unlocks week_streak at 7 days', () => {
    const stats: UserStats = { ...emptyStats, currentStreak: 7 };
    const result = checkNewAchievements(stats, []);
    const ids = result.map((a) => a.id);
    expect(ids).toContain('week_streak');
  });

  it('has at least 10 defined achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
  });
});
