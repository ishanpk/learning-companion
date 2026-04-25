'use client';

import { useEffect } from 'react';
import { useSkillStore } from '@/store/useSkillStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useLoadoutStore } from '@/store/useLoadoutStore';

/**
 * Client-side component that initialises Firebase data sync on mount.
 * Placed inside RootLayout so it runs once for the entire app.
 */
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const loadSkills = useSkillStore((s) => s.loadFromFirestore);
  const loadCourses = useCourseStore((s) => s.loadFromFirestore);
  const loadLoadout = useLoadoutStore((s) => s.loadFromFirestore);

  useEffect(() => {
    // Phase 4: Ensure user is authenticated (Anonymously or via Google)
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth);
        } catch (err) {
          console.error('[Auth] Anonymous sign-in failed:', err);
        }
      } else {
        // Only load data once we have a valid UID
        console.log(`[Auth] User authenticated as: ${user.uid}`);
        loadSkills();
        loadCourses();
        loadLoadout();
      }
    });

    return () => unsubscribe();
  }, [loadSkills, loadCourses, loadLoadout]);

  return <>{children}</>;
}
