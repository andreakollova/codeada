import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'getModules': {
        const { data, error } = await sb
          .from('cb_modules')
          .select('*')
          .order('module_number', { ascending: true });
        if (error) throw error;
        return Response.json({ data });
      }

      case 'getLessons': {
        const { moduleId } = body;
        const { data, error } = await sb
          .from('cb_lessons')
          .select('id, module_id, lesson_number, title, title_sk, lesson_type, learning_content_sk')
          .eq('module_id', moduleId)
          .order('lesson_number', { ascending: true });
        if (error) throw error;
        const withMinis = (data || []).map((l: any) => {
          const content = l.learning_content_sk || '';
          const titles = (content.match(/^## .+$/gm) || []).map((h: string) => h.replace(/^## /, ''));
          const { learning_content_sk: _, ...rest } = l;
          return { ...rest, miniTitles: titles };
        });
        return Response.json({ data: withMinis });
      }

      case 'getLesson': {
        const { lessonId } = body;
        const { data, error } = await sb
          .from('cb_lessons')
          .select('*')
          .eq('id', lessonId)
          .single();
        if (error) throw error;
        return Response.json({ data });
      }

      case 'getQuestions': {
        const { lessonId } = body;
        const { data: questions, error } = await sb
          .from('cb_quiz_questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('question_number', { ascending: true });
        if (error) throw error;

        // Fetch options for all questions
        const questionIds = (questions || []).map((q: any) => q.id);
        let options: any[] = [];
        if (questionIds.length > 0) {
          const { data: opts, error: optErr } = await sb
            .from('cb_quiz_options')
            .select('*')
            .in('question_id', questionIds)
            .order('option_label', { ascending: true });
          if (optErr) throw optErr;
          options = opts || [];
        }

        // Attach options to questions
        const questionsWithOptions = (questions || []).map((q: any) => ({
          ...q,
          options: options.filter((o: any) => o.question_id === q.id),
        }));

        return Response.json({ data: questionsWithOptions });
      }

      case 'saveLesson': {
        const { lesson } = body;
        const isNew = !lesson.id;

        // Ensure array columns are proper postgres arrays
        if (lesson.key_takeaways === undefined || lesson.key_takeaways === null) {
          lesson.key_takeaways = '{}';
        }
        if (lesson.key_takeaways_sk === undefined || lesson.key_takeaways_sk === null) {
          lesson.key_takeaways_sk = '{}';
        }

        if (isNew) {
          const { data, error } = await sb
            .from('cb_lessons')
            .insert(lesson)
            .select()
            .single();
          if (error) throw error;
          return Response.json({ data });
        } else {
          const { id, ...updates } = lesson;
          const { data, error } = await sb
            .from('cb_lessons')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (error) throw error;
          return Response.json({ data });
        }
      }

      case 'deleteLesson': {
        const { lessonId } = body;

        // Delete options for questions of this lesson
        const { data: questions } = await sb
          .from('cb_quiz_questions')
          .select('id')
          .eq('lesson_id', lessonId);
        const qIds = (questions || []).map((q: any) => q.id);
        if (qIds.length > 0) {
          await sb.from('cb_quiz_options').delete().in('question_id', qIds);
        }

        // Delete questions
        await sb.from('cb_quiz_questions').delete().eq('lesson_id', lessonId);

        // Delete lesson
        const { error } = await sb.from('cb_lessons').delete().eq('id', lessonId);
        if (error) throw error;
        return Response.json({ ok: true });
      }

      case 'saveQuestion': {
        const { question, options } = body;
        const isNew = !question.id;

        let savedQuestion: any;

        if (isNew) {
          const { data, error } = await sb
            .from('cb_quiz_questions')
            .insert(question)
            .select()
            .single();
          if (error) throw error;
          savedQuestion = data;
        } else {
          const { id, ...updates } = question;
          const { data, error } = await sb
            .from('cb_quiz_questions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (error) throw error;
          savedQuestion = data;
        }

        // Handle options for MCQ
        if (options && options.length > 0) {
          // Delete existing options
          await sb.from('cb_quiz_options').delete().eq('question_id', savedQuestion.id);

          // Insert new options
          const optionsToInsert = options.map((o: any) => ({
            question_id: savedQuestion.id,
            option_label: o.option_label,
            option_text: o.option_text,
            option_text_sk: o.option_text_sk,
            is_correct: o.is_correct,
          }));
          const { error: optErr } = await sb
            .from('cb_quiz_options')
            .insert(optionsToInsert);
          if (optErr) throw optErr;
        }

        return Response.json({ data: savedQuestion });
      }

      case 'deleteQuestion': {
        const { questionId } = body;
        await sb.from('cb_quiz_options').delete().eq('question_id', questionId);
        const { error } = await sb.from('cb_quiz_questions').delete().eq('id', questionId);
        if (error) throw error;
        return Response.json({ ok: true });
      }

      case 'saveModule': {
        const { module } = body;
        const isNew = !module.id;

        if (isNew) {
          const { data, error } = await sb
            .from('cb_modules')
            .insert(module)
            .select()
            .single();
          if (error) throw error;
          return Response.json({ data });
        } else {
          const { id, ...updates } = module;
          const { data, error } = await sb
            .from('cb_modules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
          if (error) throw error;
          return Response.json({ data });
        }
      }

      case 'deleteModule': {
        const { moduleId } = body;
        // Get lessons for module
        const { data: lessons } = await sb
          .from('cb_lessons')
          .select('id')
          .eq('module_id', moduleId);
        const lessonIds = (lessons || []).map((l: any) => l.id);

        if (lessonIds.length > 0) {
          // Get questions for those lessons
          const { data: questions } = await sb
            .from('cb_quiz_questions')
            .select('id')
            .in('lesson_id', lessonIds);
          const qIds = (questions || []).map((q: any) => q.id);
          if (qIds.length > 0) {
            await sb.from('cb_quiz_options').delete().in('question_id', qIds);
          }
          await sb.from('cb_quiz_questions').delete().in('lesson_id', lessonIds);
          await sb.from('cb_lessons').delete().eq('module_id', moduleId);
        }

        const { error } = await sb.from('cb_modules').delete().eq('id', moduleId);
        if (error) throw error;
        return Response.json({ ok: true });
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Builder API error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
