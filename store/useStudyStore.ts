'use client';

import { create } from 'zustand';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ---- Types ----
export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  isEvolved: boolean;
  icon: string;
  description: string;
}

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  content: string;
  quiz: GeneratedQuizQuestion[];
}

export interface GeneratedCourse {
  id: string;
  courseTitle: string;
  modules: GeneratedModule[];
  createdAt: number;
}

// ---- Default Data ----
const defaultSkills: Skill[] = [
  { id: '1', name: 'Pattern Recognition', category: 'ML Core', level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: '🧠', description: 'Master of identifying complex patterns in data' },
  { id: '2', name: 'Neural Architecture', category: 'Deep Learning', level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: '🔮', description: 'Expert in designing neural network structures' },
  { id: '3', name: 'Data Preprocessing', category: 'ML Core', level: 12, maxLevel: 15, xp: 380, xpToNext: 450, isEvolved: false, icon: '📊', description: 'Skilled at preparing data for model training' },
  { id: '4', name: 'TypeScript Generics', category: 'Programming', level: 10, maxLevel: 15, xp: 280, xpToNext: 350, isEvolved: false, icon: '⚡', description: 'Proficient with advanced type patterns' },
  { id: '5', name: 'API Design', category: 'System Design', level: 8, maxLevel: 15, xp: 190, xpToNext: 280, isEvolved: false, icon: '🔗', description: 'Building RESTful and GraphQL APIs' },
  { id: '6', name: 'Caching Strategies', category: 'System Design', level: 6, maxLevel: 15, xp: 120, xpToNext: 200, isEvolved: false, icon: '💾', description: 'Optimizing performance with caching' },
  { id: '7', name: 'React Patterns', category: 'Frontend', level: 14, maxLevel: 15, xp: 460, xpToNext: 500, isEvolved: false, icon: '⚛️', description: 'Advanced React component patterns' },
  { id: '8', name: 'Database Optimization', category: 'Backend', level: 4, maxLevel: 15, xp: 80, xpToNext: 150, isEvolved: false, icon: '🗄️', description: 'Query optimization and indexing' },
];

// ---- Firestore Helpers ----
// We use a single anonymous user ID stored in localStorage for simplicity
function getUserId(): string {
  if (typeof window === 'undefined') return 'ssr-placeholder';
  let id = localStorage.getItem('sp_userId');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('sp_userId', id);
  }
  return id;
}

/**
 * Saves the given user data to Firestore under the user's document.
 */
async function saveToFirestore(data: Partial<PersistedData>) {
  try {
    const userId = getUserId();
    await setDoc(
      doc(db, 'studypal_users', userId),
      { ...data, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (err) {
    console.error('[Firestore] Save error:', err);
  }
}

interface PersistedData {
  skills: Skill[];
  activeLoadout: string[];
  generatedCourses: GeneratedCourse[];
}

// ---- Store ----
interface StudyState extends PersistedData {
  // Firebase sync status
  isLoaded: boolean;
  loadFromFirestore: () => Promise<void>;

  // Focus Timer (not persisted)
  timeLeft: number;
  isRunning: boolean;
  focusTime: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;

  // Skill Loadout
  addToLoadout: (skillId: string) => boolean;
  removeFromLoadout: (skillId: string) => void;
  updateSkillXp: (skillId: string, xpGained: number) => void;

  // Generated Learning Paths
  addGeneratedCourse: (course: Omit<GeneratedCourse, 'id' | 'createdAt'>) => GeneratedCourse;
  clearCourses: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  // ---- Persisted State (loaded from Firestore) ----
  isLoaded: false,
  skills: defaultSkills,
  activeLoadout: [],
  generatedCourses: [],

  /**
   * Loads user data from Firestore on app init.
   * Falls back to defaults if no data exists yet.
   */
  loadFromFirestore: async () => {
    try {
      const userId = getUserId();
      const snap = await getDoc(doc(db, 'studypal_users', userId));
      if (snap.exists()) {
        const data = snap.data() as Partial<PersistedData>;
        set({
          skills: data.skills ?? defaultSkills,
          activeLoadout: data.activeLoadout ?? [],
          generatedCourses: data.generatedCourses ?? [],
          isLoaded: true,
        });
      } else {
        // First visit: seed defaults to Firestore
        await saveToFirestore({ skills: defaultSkills, activeLoadout: [], generatedCourses: [] });
        set({ isLoaded: true });
      }
    } catch (err) {
      console.error('[Firestore] Load error:', err);
      set({ isLoaded: true }); // Still mark loaded so UI unblocks
    }
  },

  // ---- Timer (ephemeral, not persisted) ----
  timeLeft: 25 * 60,
  isRunning: false,
  focusTime: 25 * 60,
  startTimer: () => set({ isRunning: true }),
  pauseTimer: () => set({ isRunning: false }),
  resetTimer: () => set((state) => ({ isRunning: false, timeLeft: state.focusTime })),
  tickTimer: () => set((state) => {
    if (!state.isRunning || state.timeLeft <= 0) return state;
    return { timeLeft: state.timeLeft - 1 };
  }),

  // ---- Skill Loadout ----
  addToLoadout: (skillId) => {
    const state = get();
    const skill = state.skills.find((s) => s.id === skillId);
    if (!skill) return false;
    if (state.activeLoadout.includes(skillId)) return false;
    if (state.activeLoadout.length >= 5) return false;
    if (skill.isEvolved) {
      const evolvedCount = state.activeLoadout.filter(
        (id) => state.skills.find((s) => s.id === id)?.isEvolved
      ).length;
      if (evolvedCount >= 2) return false;
    }
    const newLoadout = [...state.activeLoadout, skillId];
    set({ activeLoadout: newLoadout });
    saveToFirestore({ activeLoadout: newLoadout });
    return true;
  },

  removeFromLoadout: (skillId) => {
    const newLoadout = get().activeLoadout.filter((id) => id !== skillId);
    set({ activeLoadout: newLoadout });
    saveToFirestore({ activeLoadout: newLoadout });
  },

  /**
   * Awards XP to a skill and updates Firestore.
   */
  updateSkillXp: (skillId, xpGained) => {
    const newSkills = get().skills.map((skill) => {
      if (skill.id !== skillId) return skill;
      const newXp = Math.min(skill.xp + xpGained, skill.xpToNext);
      const leveled = newXp >= skill.xpToNext && skill.level < skill.maxLevel;
      const newLevel = leveled ? Math.min(skill.level + 1, skill.maxLevel) : skill.level;
      const isEvolved = newLevel >= skill.maxLevel;
      return { ...skill, xp: newXp, level: newLevel, isEvolved };
    });
    set({ skills: newSkills });
    saveToFirestore({ skills: newSkills });
  },

  // ---- Generated Courses ----
  addGeneratedCourse: (course) => {
    const newCourse: GeneratedCourse = {
      ...course,
      id: `course-${Date.now()}`,
      createdAt: Date.now(),
    };
    const newCourses = [newCourse, ...get().generatedCourses];
    set({ generatedCourses: newCourses });
    saveToFirestore({ generatedCourses: newCourses });
    return newCourse;
  },

  clearCourses: () => {
    set({ generatedCourses: [] });
    saveToFirestore({ generatedCourses: [] });
  },
}));
