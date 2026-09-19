export interface Lesson {
  id: number;
  title: string;
  objectives: string;
  contentHtml: string;
  orderIndex: number;
  progress?: {
    status: 'complete' | 'not started';
    lastAccessed: string;
  } | null;
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  allowedAttempts: number;
}

export interface Question {
  id: number;
  quizId: number;
  type: string;
  prompt: string;
  options: Option[];
  objective?: string;
  difficulty?: number;
  hint?: string;
  explanation?: string;
  explanationAr?: string;
}

export interface Option {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface QuizSubmissionResult {
  score: number;
  passed: boolean;
  results: {
    questionId: number;
    isCorrect: boolean;
    correctOptionId?: number;
    correctText?: string;
  }[];
}
