import { getSupabase } from './supabase';

export interface DbModule {
  id: number;
  module_number: number;
  title: string;
}

export interface DbLesson {
  id: number;
  module_id: number;
  lesson_number: number;
  title: string;
  lesson_type: string;
  introduction: string;
  learning_content: string;
  interesting_facts: string | null;
  real_world: string | null;
  key_takeaways: string[];
  challenge: string | null;
  common_mistakes: string | null;
  best_practices: string | null;
}

export interface DbQuizQuestion {
  id: number;
  lesson_id: number;
  question_number: number;
  question_text: string;
  question_type: string; // 'mcq' | 'true_false'
  correct_answer: string;
  code_snippet: string | null;
  options: DbQuizOption[];
}

export interface DbQuizOption {
  id: number;
  question_id: number;
  option_label: string;
  option_text: string;
  is_correct: boolean;
}

export interface DbLessonSummary {
  id: number;
  module_id: number;
  lesson_number: number;
  title: string;
  lesson_type: string;
}

export interface ModuleWithLessons extends DbModule {
  lessons: DbLessonSummary[];
}

// Cache to avoid re-fetching
let modulesCache: ModuleWithLessons[] | null = null;

export async function fetchModulesWithLessons(): Promise<ModuleWithLessons[]> {
  if (modulesCache) return modulesCache;

  const sb = getSupabase();
  if (!sb) return [];

  const [modRes, lesRes] = await Promise.all([
    sb.from('cb_modules').select('*').order('module_number'),
    sb.from('cb_lessons').select('id,module_id,lesson_number,title,lesson_type').order('module_id').order('lesson_number'),
  ]);

  if (modRes.error || lesRes.error) return [];

  const modules: DbModule[] = modRes.data;
  const lessons: DbLessonSummary[] = lesRes.data;

  modulesCache = modules.map(m => ({
    ...m,
    lessons: lessons.filter(l => l.module_id === m.id),
  }));

  return modulesCache;
}

export async function fetchLesson(id: number): Promise<DbLesson | null> {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from('cb_lessons')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function fetchQuizForLesson(lessonId: number): Promise<DbQuizQuestion[]> {
  const sb = getSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from('cb_quiz_questions')
    .select('*, options:cb_quiz_options(*)')
    .eq('lesson_id', lessonId)
    .order('question_number');

  if (error || !data) return [];
  return data;
}

export function invalidateCache() {
  modulesCache = null;
}
