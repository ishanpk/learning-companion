import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Skill, GeneratedCourse, ReviewCard } from './types';

// Priorities: Firebase Auth UID > localStorage ID
export function getUserId(): string {
  if (typeof window === 'undefined') return 'ssr-placeholder';
  
  // Use Firebase Auth if signed in
  const currentUser = auth.currentUser;
  if (currentUser) return currentUser.uid;

  let id = localStorage.getItem('sp_userId');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('sp_userId', id);
  }
  return id;
}

export interface PersistedData {
  skills?: Skill[];
  activeLoadout?: string[];
  generatedCourses?: GeneratedCourse[];
  reviewCards?: ReviewCard[];
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
