import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GeneratedCourse } from './types';
import { getUserId, saveToFirestore, PersistedData } from './firebaseSync';

interface CourseState {
  isLoaded: boolean;
  generatedCourses: GeneratedCourse[];
  selectedCourseId: string | null;
  loadFromFirestore: () => Promise<void>;
  addGeneratedCourse: (course: Omit<GeneratedCourse, 'id' | 'createdAt'>) => GeneratedCourse;
  selectCourse: (id: string | null) => void;
  clearCourses: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  isLoaded: false,
  generatedCourses: [],
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

  selectCourse: (id) => {
    set({ selectedCourseId: id });
  },

  clearCourses: () => {
    set({ generatedCourses: [], selectedCourseId: null });
    saveToFirestore({ generatedCourses: [] });
  },
}));
