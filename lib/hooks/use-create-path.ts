import { useState } from 'react';
import { useCourseStore } from '@/store/useCourseStore';
import { trackEvent } from '@/lib/analytics';

/**
 * Custom hook to manage the creation of a new learning path via Gemini AI.
 * Handles loading states, error handling, and store updates.
 */
export function useCreatePath() {
  const [isGenerating, setIsGenerating] = useState(false);
  const addGeneratedCourse = useCourseStore((s) => s.addGeneratedCourse);

  const createPath = async (topic: string, onSuccess: () => void) => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || "Failed to generate path");
      }

      const data = await res.json();

      // Update Store & Analytics
      addGeneratedCourse({
        courseTitle: data.courseTitle,
        modules: data.modules,
      });

      trackEvent({ name: 'learning_path_generated', topic: topic.trim() });
      
      onSuccess();
    } catch (err: any) {
      console.error("[useCreatePath] Error:", err);
      // In a real app, we'd use a toast notification here
      alert(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, createPath };
}
