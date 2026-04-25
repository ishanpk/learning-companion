import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skill } from './types';
import { getUserId, saveToFirestore, PersistedData } from './firebaseSync';

export const defaultSkills: Skill[] = [
  { id: '1', name: 'Pattern Recognition', category: 'ML Core', level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: '🧠', description: 'Master of identifying complex patterns in data' },
  { id: '2', name: 'Neural Architecture', category: 'Deep Learning', level: 15, maxLevel: 15, xp: 500, xpToNext: 500, isEvolved: true, icon: '🔮', description: 'Expert in designing neural network structures' },
  { id: '3', name: 'Data Preprocessing', category: 'ML Core', level: 12, maxLevel: 15, xp: 380, xpToNext: 450, isEvolved: false, icon: '📊', description: 'Skilled at preparing data for model training' },
  { id: '4', name: 'TypeScript Generics', category: 'Programming', level: 10, maxLevel: 15, xp: 280, xpToNext: 350, isEvolved: false, icon: '⚡', description: 'Proficient with advanced type patterns' },
  { id: '5', name: 'API Design', category: 'System Design', level: 8, maxLevel: 15, xp: 190, xpToNext: 280, isEvolved: false, icon: '🔗', description: 'Building RESTful and GraphQL APIs' },
  { id: '6', name: 'Caching Strategies', category: 'System Design', level: 6, maxLevel: 15, xp: 120, xpToNext: 200, isEvolved: false, icon: '💾', description: 'Optimizing performance with caching' },
  { id: '7', name: 'React Patterns', category: 'Frontend', level: 14, maxLevel: 15, xp: 460, xpToNext: 500, isEvolved: false, icon: '⚛️', description: 'Advanced React component patterns' },
  { id: '8', name: 'Database Optimization', category: 'Backend', level: 4, maxLevel: 15, xp: 80, xpToNext: 150, isEvolved: false, icon: '🗄️', description: 'Query optimization and indexing' },
];

interface SkillState {
  isLoaded: boolean;
  skills: Skill[];
  loadFromFirestore: () => Promise<void>;
  updateSkillXp: (skillId: string, xpGained: number) => void;
}

export const useSkillStore = create<SkillState>((set, get) => ({
  isLoaded: false,
  skills: defaultSkills,

  loadFromFirestore: async () => {
    try {
      const userId = getUserId();
      const snap = await getDoc(doc(db, 'studypal_users', userId));
      if (snap.exists()) {
        const data = snap.data() as Partial<PersistedData>;
        if (data.skills) {
          set({ skills: data.skills });
        }
      } else {
        // First visit: seed defaults
        await saveToFirestore({ skills: defaultSkills });
      }
      set({ isLoaded: true });
    } catch (err) {
      console.error('[Firestore] Skill load error:', err);
      set({ isLoaded: true });
    }
  },

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
}));
