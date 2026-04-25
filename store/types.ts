export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  maxLevel: number;
  xp: number;
  xpToNext: number;
  isEvolved: boolean;
  icon: string;
  description: string;
}

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  content: string;
  quiz: GeneratedQuizQuestion[];
}

export interface GeneratedCourse {
  id: string;
  courseTitle: string;
  modules: GeneratedModule[];
  createdAt: number;
}

export interface ReviewCard {
  id: string; // Unique ID (e.g. `courseId:moduleIndex:quizIndex`)
  lastReviewed: number;
  nextReview: number;
  streak: number;
  intervalIndex: number;
  // Metadata for display
  question?: string;
  options?: string[];
  correctAnswer?: string;
  topic?: string;
}
