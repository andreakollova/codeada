export type ByteMood = 'happy' | 'celebrating' | 'sleepy' | 'worried' | 'proud' | 'low_battery';

export type ExerciseType = 'explain' | 'mcq' | 'fill' | 'write';

export type ItemType = 'hat' | 'glasses' | 'accessory' | 'antenna' | 'aura';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  element?: string; // fire, water, earth, air, galaxy, golden, void
}

export interface ByteEquipment {
  hat?: string;
  glasses?: string;
  accessory?: string;
  antenna?: string;
  aura?: string;
}

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
  exercises: Exercise[];
  status?: 'locked' | 'active' | 'completed';
}

export interface Unit {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isCheckpoint?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons?: Lesson[];
  units: Unit[];
}

export interface UserState {
  userId: string | null;
  name: string | null;
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
  ownedItems: string[];
  equipment: ByteEquipment;
  selectedTopics: string[];
  coffees: number;
  favDrink: 'coffee' | 'tea' | 'energy' | 'juice' | 'water' | null;
  wrongQuestionIds: number[];
}

export interface GlossaryEntry {
  id: string;
  term: string;
  category: 'skratka' | 'symbol' | 'koncept' | 'nastroj';
  short: string;
  explanation: string;
  example?: string;
}

export interface ProjectTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

// === Interactive Projects ===

export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ProjectStepType = 'theory' | 'quiz' | 'fill' | 'write';

export interface ProjectHint {
  text: string;
  code?: string;
}

export interface ProjectTest {
  description: string;
  code: string;
  expected: string;
}

export interface ProjectErrorMessage {
  pattern: string; // regex or keyword to match against student code/output
  message: string;
  suggestion?: string;
}

export interface ProjectQuizOption {
  text: string;
  correct: boolean;
}

export interface ProjectStep {
  id: string;
  type: ProjectStepType;
  title: string;
  // Theory
  theoryContent?: string; // markdown
  // Quiz
  quizQuestion?: string;
  quizOptions?: ProjectQuizOption[];
  quizExplanation?: string;
  // Fill code
  fillCode?: string; // code with ___ blanks
  fillBlanks?: { id: string; answer: string; alternatives?: string[] }[];
  // Write code
  prompt?: string;
  starterCode?: string;
  solution?: string;
  tests?: ProjectTest[];
  hints?: ProjectHint[];
  errorMessages?: ProjectErrorMessage[];
  // Preview state after completing this step
  previewState?: string; // key that tells preview which parts to unlock
  // XP
  xp: number;
}

export interface ProjectSection {
  id: string;
  title: string;
  steps: ProjectStep[];
}

export interface InteractiveProject {
  id: string;
  title: string;
  subtitle: string;
  description: string; // markdown — what you'll build
  difficulty: ProjectDifficulty;
  estimatedMinutes: number;
  skills: string[]; // what you'll learn
  icon: string;
  color: string; // theme color
  totalSteps: number;
  sections: ProjectSection[];
  finalCode: string; // complete solution
  downloadUrl?: string; // ZIP on Supabase Storage
}
