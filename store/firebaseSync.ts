import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skill, GeneratedCourse } from './types';

// We use a single anonymous user ID stored in localStorage for simplicity
export function getUserId(): string {
  if (typeof window === 'undefined') return 'ssr-placeholder';
  let id = localStorage.getItem('sp_userId');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('sp_userId', id);
  }
  return id;
}

export interface PersistedData {
  skills?: Skill[];
  activeLoadout?: string[];
  generatedCourses?: GeneratedCourse[];
}

/**
 * Saves the given user data to Firestore under the user's document.
 */
export async function saveToFirestore(data: Partial<PersistedData>) {
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
