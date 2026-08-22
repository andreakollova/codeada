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
        // Only show "Programovanie" (id=51) and any newly created modules
        // Hide old Python course modules (id <= 48)
        const { data, error } = await sb
          .from('cb_modules')
          .select('*')
          .gt('id', 48)
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

        // Ensure array columns are proper postgres arrays (only when present)
        if ('key_takeaways' in lesson && (lesson.key_takeaways === undefined || lesson.key_takeaways === null)) {
          lesson.key_takeaways = '{}';
        }
        if ('key_takeaways_sk' in lesson && (lesson.key_takeaways_sk === undefined || lesson.key_takeaways_sk === null)) {
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

      case 'parseQuestions': {
        const { text } = body;
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You parse quiz questions from pasted text into structured JSON. The text may contain section headers (like "Kvízové otázky", "Select the correct answer", "Fill in the code", "01.", "02." etc.) — IGNORE all headers, only extract actual questions.

Each question has:
- question_text: the question text (without number prefix like "Otázka 1" or "Question 1")
- question_type: "multiple_choice" if has A/B/C/D options, "fill_code" if has ___ blank to fill and NO A/B/C/D options
- code_snippet: Python code shown with the question. ALWAYS normalize any sequence of underscores (__________, _____, etc.) to exactly three: ___. Include ALL code lines (variable assignments, if statements, print statements). NEVER leave empty if the question contains code.
- correct_answer: For multiple_choice: the letter A/B/C/D. For fill_code: the ACTUAL VALUE to fill in the blank (e.g. "print", "6", "temperature > 30"), NEVER a letter.
- explanation: the explanation text (without "Vysvetlenie:" or "Explanation:" prefix)
- options: array of {label: "A"/"B"/"C"/"D", text: "option text"} — empty array for fill_code

Return JSON: {"questions": [...]}

CRITICAL RULES:
- Extract ALL questions. Do not skip any. Each "Správna odpoveď:" or "Correct answer:" marks one question.
- For fill_code: correct_answer must be the actual code/value (like "print", "6", "len"), NEVER a letter.
- If a question has code AND A/B/C/D options → it's "multiple_choice" with code_snippet, NOT fill_code.`
              },
              { role: 'user', content: text }
            ]
          })
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`OpenAI error: ${err}`);
        }

        const gptData = await res.json();
        const reply = gptData.choices?.[0]?.message?.content || '{}';
        const parsed = JSON.parse(reply);
        return Response.json({ data: parsed.questions || [] });
      }

      case 'generateFact': {
        const { sectionTitle, sectionContent } = body;
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.8,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `Si autor vzdelávacieho obsahu o programovaní pre začiatočníkov. Vygeneruj jeden zaujímavý fun fact k danej téme/sekcii.

PRAVIDLÁ:
- Krátky výstižný nadpis (max 10 slov)
- Detail: 2-3 vety, zaujímavý, pravdivý, overiteľný fakt
- Môže byť z histórie, zo života, zo sveta technológií, zaujímavá štatistika
- Nie príliš všeobecný — konkrétny, prekvapivý
- Správna slovenčina, dobrý slovosled, bez anglicizmov kde nie sú nutné
- Vhodný pre úplných začiatočníkov v programovaní

PRÍKLAD ŠTÝLU:
Nadpis: "Prvý program vznikol skôr než moderný počítač"
Detail: "Ada Lovelace v roku 1843 publikovala algoritmus určený pre Analytical Engine Charlesa Babbagea. Samotný stroj pritom počas jej života nebol dokončený. Myšlienka zapisovať postup, ktorý má stroj automaticky vykonať, tak existovala dávno pred dnešnými elektronickými počítačmi."

Vráť JSON: {"title": "...", "detail": "..."}`
              },
              { role: 'user', content: `Sekcia: ${sectionTitle}\n\nObsah:\n${(sectionContent || '').substring(0, 500)}` }
            ]
          })
        });

        if (!res.ok) throw new Error('OpenAI error: ' + await res.text());
        const gptData = await res.json();
        const reply = gptData.choices?.[0]?.message?.content || '{}';
        return Response.json({ data: JSON.parse(reply) });
      }

      case 'translate': {
        const { texts } = body; // { key: skText, ... }
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

        const entries = Object.entries(texts).filter(([, v]) => typeof v === 'string' && (v as string).trim());
        if (entries.length === 0) return Response.json({ data: {} });

        const prompt = entries.map(([key, val]) => `[${key}]\n${val}`).join('\n\n---\n\n');

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            temperature: 0.3,
            messages: [
              {
                role: 'system',
                content: `You are a professional translator. Translate the following Slovak texts to English. Keep all markdown formatting (##, ###, **, -, code blocks, ___) exactly as-is. Keep variable names, function names, and code unchanged. Only translate the natural language parts. Return ONLY the translations in the same [key] format, nothing else.`
              },
              { role: 'user', content: prompt }
            ]
          })
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`OpenAI error: ${err}`);
        }

        const gptData = await res.json();
        const reply = gptData.choices?.[0]?.message?.content || '';

        // Parse response back into key-value pairs
        const result: Record<string, string> = {};
        const parts = reply.split(/\n*---\n*/);
        for (const part of parts) {
          const match = part.match(/^\[(\w+)\]\n([\s\S]*)/);
          if (match) {
            result[match[1]] = match[2].trim();
          }
        }

        return Response.json({ data: result });
      }

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err: any) {
    console.error('Builder API error:', err);
    return Response.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
