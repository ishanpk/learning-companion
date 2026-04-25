import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getUserId, saveToFirestore, PersistedData } from './firebaseSync';
import { useSkillStore } from './useSkillStore';

interface LoadoutState {
  isLoaded: boolean;
  activeLoadout: string[];
  loadFromFirestore: () => Promise<void>;
  addToLoadout: (skillId: string) => boolean;
  removeFromLoadout: (skillId: string) => void;
}

export const useLoadoutStore = create<LoadoutState>((set, get) => ({
  isLoaded: false,
  activeLoadout: [],

  loadFromFirestore: async () => {
    try {
      const userId = getUserId();
      const snap = await getDoc(doc(db, 'studypal_users', userId));
      if (snap.exists()) {
        const data = snap.data() as Partial<PersistedData>;
        if (data.activeLoadout) {
          set({ activeLoadout: data.activeLoadout });
        }
      }
      set({ isLoaded: true });
    } catch (err) {
      console.error('[Firestore] Loadout load error:', err);
      set({ isLoaded: true });
    }
  },

  addToLoadout: (skillId) => {
    const state = get();
    // Validate against skills from useSkillStore
    const skills = useSkillStore.getState().skills;
    const skill = skills.find((s) => s.id === skillId);
    
    if (!skill) return false;
    if (state.activeLoadout.includes(skillId)) return false;
    if (state.activeLoadout.length >= 5) return false;
    
    if (skill.isEvolved) {
      const evolvedCount = state.activeLoadout.filter(
        (id) => skills.find((s) => s.id === id)?.isEvolved
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
}));
