'use client';

import { useEffect } from 'react';
import { useSkillStore } from '@/store/useSkillStore';
import { useCourseStore } from '@/store/useCourseStore';
import { useLoadoutStore } from '@/store/useLoadoutStore';

/**
 * Client-side component that initialises Firebase data sync on mount.
 * Placed inside RootLayout so it runs once for the entire app.
 */
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const loadSkills = useSkillStore((s) => s.loadFromFirestore);
  const loadCourses = useCourseStore((s) => s.loadFromFirestore);
  const loadLoadout = useLoadoutStore((s) => s.loadFromFirestore);

  useEffect(() => {
    loadSkills();
    loadCourses();
    loadLoadout();
  }, [loadSkills, loadCourses, loadLoadout]);

  return <>{children}</>;
}
