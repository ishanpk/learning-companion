import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedCourse, ReviewCard } from './types';
import { getUserId, saveToFirestore, PersistedData } from './firebaseSync';
import { updateReviewCard as srUpdate } from '@/lib/spaced-repetition';

interface CourseState {
  isLoaded: boolean;
  generatedCourses: GeneratedCourse[];
  reviewCards: ReviewCard[];
  selectedCourseId: string | null;
  loadFromFirestore: () => Promise<void>;
  addGeneratedCourse: (course: Omit<GeneratedCourse, 'id' | 'createdAt'>) => GeneratedCourse;
  addReviewCard: (card: ReviewCard) => void;
  updateReviewCard: (cardId: string, correct: boolean) => void;
  selectCourse: (id: string | null) => void;
  clearCourses: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  isLoaded: false,
  generatedCourses: [],
  reviewCards: [],
  selectedCourseId: null,

  loadFromFirestore: async () => {
    try {
      const userId = getUserId();
      const snap = await getDoc(doc(db, 'studypal_users', userId));
      if (snap.exists()) {
        const data = snap.data() as Partial<PersistedData>;
        if (data.generatedCourses) {
          set({ generatedCourses: data.generatedCourses });
        }
        if (data.reviewCards) {
          set({ reviewCards: data.reviewCards });
        }
      }
      set({ isLoaded: true });
    } catch (err) {
      console.error('[Firestore] Course load error:', err);
      set({ isLoaded: true });
    }
  },

  addGeneratedCourse: (course) => {
    const newCourse: GeneratedCourse = {
      ...course,
      id: `course-${Date.now()}`,
      createdAt: Date.now(),
    };
    const newCourses = [newCourse, ...get().generatedCourses];
    set({ 
      generatedCourses: newCourses,
      selectedCourseId: newCourse.id // Automatically select the new course
    });
    saveToFirestore({ generatedCourses: newCourses });
    return newCourse;
  },

  addReviewCard: (card) => {
    const newCards = [...get().reviewCards, card];
    set({ reviewCards: newCards });
    saveToFirestore({ reviewCards: newCards });
  },

  updateReviewCard: (cardId, correct) => {
    const newCards = get().reviewCards.map(card => {
      if (card.id !== cardId) return card;
      return srUpdate(card, correct);
    });
    set({ reviewCards: newCards });
    saveToFirestore({ reviewCards: newCards });
  },

  selectCourse: (id) => {
    set({ selectedCourseId: id });
  },

  clearCourses: () => {
    set({ generatedCourses: [], selectedCourseId: null });
    saveToFirestore({ generatedCourses: [] });
  },
}));
