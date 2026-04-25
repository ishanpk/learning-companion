/**
 * Achievement / Milestone System
 * Tracks gamification milestones tied to skill levels, streaks, and courses.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'skill' | 'streak' | 'course' | 'timer';
  condition: (stats: UserStats) => boolean;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: number;
}

export interface UserStats {
  /** Total skills at max level */
  evolvedSkillCount: number;
  /** Highest skill level across all skills */
  highestSkillLevel: number;
  /** Total generated courses */
  totalCourses: number;
  /** Total completed focus sessions */
  focusSessionsCompleted: number;
  /** Current daily study streak */
  currentStreak: number;
  /** Total quizzes completed */
  quizzesCompleted: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Skill milestones
  {
    id: 'first_evolved',
    title: 'First Ascension',
    description: 'Evolve your first skill to max level',
    icon: '⭐',
    category: 'skill',
    condition: (s) => s.evolvedSkillCount >= 1,
  },
  {
    id: 'dual_master',
    title: 'Dual Master',
    description: 'Evolve 2 skills to max level',
    icon: '🌟',
    category: 'skill',
    condition: (s) => s.evolvedSkillCount >= 2,
  },
  {
    id: 'skill_collector',
    title: 'Skill Collector',
    description: 'Reach level 5 on any skill',
    icon: '🎯',
    category: 'skill',
    condition: (s) => s.highestSkillLevel >= 5,
  },
  {
    id: 'skill_adept',
    title: 'Adept Learner',
    description: 'Reach level 10 on any skill',
    icon: '🏅',
    category: 'skill',
    condition: (s) => s.highestSkillLevel >= 10,
  },

  // Course milestones
  {
    id: 'path_pioneer',
    title: 'Path Pioneer',
    description: 'Generate your first AI learning path',
    icon: '🚀',
    category: 'course',
    condition: (s) => s.totalCourses >= 1,
  },
  {
    id: 'curriculum_builder',
    title: 'Curriculum Builder',
    description: 'Generate 5 learning paths',
    icon: '📚',
    category: 'course',
    condition: (s) => s.totalCourses >= 5,
  },

  // Timer milestones
  {
    id: 'first_focus',
    title: 'First Focus',
    description: 'Complete your first 25-minute focus session',
    icon: '⏱️',
    category: 'timer',
    condition: (s) => s.focusSessionsCompleted >= 1,
  },
  {
    id: 'deep_focus',
    title: 'Deep Focus',
    description: 'Complete 10 focus sessions',
    icon: '🧘',
    category: 'timer',
    condition: (s) => s.focusSessionsCompleted >= 10,
  },

  // Streak milestones
  {
    id: 'week_streak',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    category: 'streak',
    condition: (s) => s.currentStreak >= 7,
  },
  {
    id: 'fortnight_streak',
    title: 'Unstoppable',
    description: 'Maintain a 14-day study streak',
    icon: '💎',
    category: 'streak',
    condition: (s) => s.currentStreak >= 14,
  },

  // Quiz milestones
  {
    id: 'quiz_novice',
    title: 'Quiz Novice',
    description: 'Complete your first quiz',
    icon: '✅',
    category: 'course',
    condition: (s) => s.quizzesCompleted >= 1,
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Complete 25 quizzes',
    icon: '🏆',
    category: 'course',
    condition: (s) => s.quizzesCompleted >= 25,
  },
];

/**
 * Checks which achievements are newly unlocked given current stats
 * and the list of already-unlocked achievement IDs.
 */
export function checkNewAchievements(
  stats: UserStats,
  alreadyUnlocked: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.includes(a.id) && a.condition(stats)
  );
}
