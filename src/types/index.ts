export type ByteMood = 'happy' | 'celebrating' | 'sleepy' | 'worried' | 'proud' | 'low_battery';

export type ExerciseType = 'explain' | 'mcq' | 'fill' | 'write';

export interface TestCase {
  input?: string;
  expected: string;
  description?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  conceptId: string;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: string;
  blanks?: { id: string; options: string[]; correct: string }[];
  testCases?: TestCase[];
  explanation?: string;
  xp: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  icon: string;
  exercises: Exercise[];
  status?: 'locked' | 'active' | 'completed';
}

export interface Unit {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
  isCheckpoint?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  units: Unit[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserState {
  userId: string | null;
  xp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActiveDate: string | null;
  byteMood: ByteMood;
  byteBattery: number;
  completedLessons: string[];
  badges: string[];
  weeklyXp: number;
  weekStartDate: string | null;
}
