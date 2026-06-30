-- CodeByte Curriculum Schema
-- Run this in Supabase SQL Editor

-- 1. Modules
CREATE TABLE IF NOT EXISTS cb_modules (
  id SERIAL PRIMARY KEY,
  module_number INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons
CREATE TABLE IF NOT EXISTS cb_lessons (
  id SERIAL PRIMARY KEY,
  module_id INT NOT NULL REFERENCES cb_modules(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'theory',
  introduction TEXT NOT NULL,
  learning_content TEXT NOT NULL,
  interesting_facts TEXT,
  real_world TEXT,
  key_takeaways TEXT[] NOT NULL DEFAULT '{}',
  challenge TEXT,
  common_mistakes TEXT,
  best_practices TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, lesson_number)
);

-- 3. Quiz questions
CREATE TABLE IF NOT EXISTS cb_quiz_questions (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES cb_lessons(id) ON DELETE CASCADE,
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq',
  correct_answer TEXT NOT NULL,
  code_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, question_number)
);

-- 4. Quiz options
CREATE TABLE IF NOT EXISTS cb_quiz_options (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL REFERENCES cb_quiz_questions(id) ON DELETE CASCADE,
  option_label TEXT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Exercises (fill-blank, write-code, predict-output, debugging, mini-project, bonus)
CREATE TABLE IF NOT EXISTS cb_exercises (
  id SERIAL PRIMARY KEY,
  lesson_id INT NOT NULL REFERENCES cb_lessons(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  exercise_number INT NOT NULL,
  title TEXT,
  instructions TEXT NOT NULL,
  starter_code TEXT,
  expected_output TEXT,
  solution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, exercise_type, exercise_number)
);

-- Enable RLS
ALTER TABLE cb_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE cb_exercises ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read modules" ON cb_modules FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON cb_lessons FOR SELECT USING (true);
CREATE POLICY "Public read quiz_questions" ON cb_quiz_questions FOR SELECT USING (true);
CREATE POLICY "Public read quiz_options" ON cb_quiz_options FOR SELECT USING (true);
CREATE POLICY "Public read exercises" ON cb_exercises FOR SELECT USING (true);
