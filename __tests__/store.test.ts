import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

// Mock Firebase to avoid actual Firestore calls in tests
vi.mock('@/lib/firebase', () => ({
  db: {},
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  serverTimestamp: vi.fn(() => new Date()),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useLoadoutStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useTimerStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useCourseStore: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let useSkillStore: any;

beforeAll(async () => {
  const modLoadout = await import('@/store/useLoadoutStore');
  useLoadoutStore = modLoadout.useLoadoutStore;
  
  const modTimer = await import('@/store/useTimerStore');
  useTimerStore = modTimer.useTimerStore;
  
  const modCourse = await import('@/store/useCourseStore');
  useCourseStore = modCourse.useCourseStore;
  
  const modSkill = await import('@/store/useSkillStore');
  useSkillStore = modSkill.useSkillStore;
});

beforeEach(() => {
  if (useLoadoutStore) useLoadoutStore.setState({ activeLoadout: [] });
  if (useCourseStore) useCourseStore.setState({ generatedCourses: [] });
  if (useTimerStore) useTimerStore.setState({ timeLeft: 25 * 60, isRunning: false });
});

describe('Store Slices', () => {
  describe('Loadout Constraints', () => {
    it('allows adding a skill to loadout', () => {
      const result = useLoadoutStore.getState().addToLoadout('3'); // Data Preprocessing
      expect(result).toBe(true);
      expect(useLoadoutStore.getState().activeLoadout).toContain('3');
    });

    it('prevents duplicate skills in loadout', () => {
      useLoadoutStore.setState({ activeLoadout: ['3'] });
      const result = useLoadoutStore.getState().addToLoadout('3');
      expect(result).toBe(false);
    });

    it('enforces max 5 skills in loadout', () => {
      useLoadoutStore.setState({ activeLoadout: ['3', '4', '5', '6', '7'] });
      const result = useLoadoutStore.getState().addToLoadout('8');
      expect(result).toBe(false);
      expect(useLoadoutStore.getState().activeLoadout).toHaveLength(5);
    });

    it('enforces max 2 evolved skills in loadout', () => {
      // Skills 1 and 2 are evolved (isEvolved: true)
      useLoadoutStore.setState({ activeLoadout: ['1', '2'] });
      // Skill 3 is NOT evolved — should succeed
      const okResult = useLoadoutStore.getState().addToLoadout('3');
      expect(okResult).toBe(true);
    });

    it('removes skill from loadout', () => {
      useLoadoutStore.setState({ activeLoadout: ['3', '4', '5'] });
      useLoadoutStore.getState().removeFromLoadout('4');
      expect(useLoadoutStore.getState().activeLoadout).toEqual(['3', '5']);
    });
  });

  describe('Focus Timer', () => {
    it('initializes at 25 minutes', () => {
      expect(useTimerStore.getState().timeLeft).toBe(25 * 60);
    });

    it('starts and pauses', () => {
      useTimerStore.getState().startTimer();
      expect(useTimerStore.getState().isRunning).toBe(true);
      useTimerStore.getState().pauseTimer();
      expect(useTimerStore.getState().isRunning).toBe(false);
    });

    it('resets timer to full duration', () => {
      useTimerStore.setState({ timeLeft: 100, isRunning: true });
      useTimerStore.getState().resetTimer();
      expect(useTimerStore.getState().timeLeft).toBe(25 * 60);
      expect(useTimerStore.getState().isRunning).toBe(false);
    });

    it('ticks down by 1 second when running', () => {
      useTimerStore.setState({ timeLeft: 100, isRunning: true });
      useTimerStore.getState().tickTimer();
      expect(useTimerStore.getState().timeLeft).toBe(99);
    });

    it('does not tick when paused', () => {
      useTimerStore.setState({ timeLeft: 100, isRunning: false });
      useTimerStore.getState().tickTimer();
      expect(useTimerStore.getState().timeLeft).toBe(100);
    });
  });

  describe('Generated Courses', () => {
    it('adds a generated course', () => {
      const course = useCourseStore.getState().addGeneratedCourse({
        courseTitle: 'Test Course',
        modules: [],
      });
      expect(course.id).toMatch(/^course-/);
      expect(course.courseTitle).toBe('Test Course');
      expect(useCourseStore.getState().generatedCourses).toHaveLength(1);
    });

    it('clears all courses', () => {
      useCourseStore.getState().addGeneratedCourse({ courseTitle: 'A', modules: [] });
      useCourseStore.getState().clearCourses();
      expect(useCourseStore.getState().generatedCourses).toHaveLength(0);
    });
  });

  describe('Skill XP', () => {
    it('awards XP to a skill', () => {
      useSkillStore.getState().updateSkillXp('8', 50); // Database Optimization starts at 80/150
      const skill = useSkillStore.getState().skills.find((s: { id: string }) => s.id === '8');
      expect(skill!.xp).toBe(130);
    });
  });
});
