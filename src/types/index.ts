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
