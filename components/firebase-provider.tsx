'use client';

import { useEffect } from 'react';
import { useStudyStore } from '@/store/useStudyStore';

/**
 * Client-side component that initialises Firebase data sync on mount.
 * Placed inside RootLayout so it runs once for the entire app.
 */
export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const loadFromFirestore = useStudyStore((s) => s.loadFromFirestore);

  useEffect(() => {
    loadFromFirestore();
  }, [loadFromFirestore]);

  return <>{children}</>;
}
