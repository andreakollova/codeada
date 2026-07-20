'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore, t } from '@/store/localeStore';
import { ArrowRight, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Byte from '@/components/Byte';
import { getSupabase } from '@/lib/supabase';

interface PracticeQuestion {
  id: number;
  question_text: string;
  question_text_sk: string;
  question_type: string;
  correct_answer: string;
  explanation: string;
  explanation_sk: string;
  options: { option_label: string; option_text: string; option_text_sk: string; is_correct: boolean }[];
}

export default function PracticePage() {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { wrongQuestionIds, removeWrongQuestion, equipment, setByteMood, byteMood } = useUserStore();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wrongQuestionIds?.length) { setLoading(false); return; }
    const sb = getSupabase()!;
    sb.from('cb_quiz_questions').select('*, options:cb_quiz_options(*)').in('id', wrongQuestionIds).then(({ data }) => {
      setQuestions((data || []) as PracticeQuestion[]);
      setLoading(false);
    });
  }, [wrongQuestionIds]);

  const q = questions[index];
  const done = index >= questions.length;

  const handleAnswer = (label: string) => {
    if (state !== 'idle') return;
    setSelected(label);
    const correct = q.question_type === 'true_false'
      ? (label === 'T' && q.correct_answer === 'True') || (label === 'F' && q.correct_answer === 'False')
      : label === q.correct_answer;
    setState(correct ? 'correct' : 'wrong');
    setByteMood(correct ? 'celebrating' : 'worried');
    setTimeout(() => setByteMood('happy'), 1500);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 500);
  };

  const next = () => {
    setState('idle');
    setSelected(null);
    setIndex(i => i + 1);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>...</p>
    </div>
  );

  if (!wrongQuestionIds?.length || questions.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Byte mood="happy" size={80} equipment={equipment} />
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginTop: 16 }}>
        {locale === 'sk' ? 'Nemáš žiadne chyby!' : 'No mistakes to practice!'}
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginTop: 8 }}>
        {locale === 'sk' ? 'Keď v kvíze odpovieš zle, otázka sa tu objaví.' : 'When you answer wrong in a quiz, the question will appear here.'}
      </p>
      <button onClick={() => router.push('/')} style={{ marginTop: 24, padding: '12px 24px', borderRadius: 10, background: '#EDEDED', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        {locale === 'sk' ? 'Späť' : 'Back'}
      </button>
    </div>
  );

  if (done) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Byte mood="celebrating" size={80} equipment={equipment} />
      <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginTop: 16 }}>
        {locale === 'sk' ? 'Precvičené!' : 'Practice done!'}
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginTop: 8, textAlign: 'center' }}>
        {locale === 'sk' ? 'Skvelá práca. Otázky ktoré si zodpovedal/a správne môžeš odstrániť.' : 'Great job. You can remove questions you answered correctly.'}
      </p>
      <button onClick={() => router.push('/')} style={{ marginTop: 24, padding: '12px 24px', borderRadius: 10, background: '#EDEDED', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
        {locale === 'sk' ? 'Hotovo' : 'Done'}
      </button>
    </div>
  );

  const options = q.question_type === 'true_false'
    ? [{ option_label: 'T', option_text: 'True', option_text_sk: 'Pravda', is_correct: q.correct_answer === 'True' },
       { option_label: 'F', option_text: 'False', option_text_sk: 'Nepravda', is_correct: q.correct_answer === 'False' }]
    : (q.options || []).sort((a, b) => a.option_label.localeCompare(b.option_label));

  const correctOpt = options.find(o => o.is_correct);
  const expl = locale === 'sk' ? q.explanation_sk : q.explanation;

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #111' }}>
        <button onClick={() => router.push('/')} style={{ color: '#777', cursor: 'pointer', padding: 4, background: 'none', border: 'none' }}>
          <X size={20} />
        </button>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#111', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: '#ef4444', borderRadius: 2 }} animate={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', padding: '0 20px 120px' }}>
        {/* Intro text on first question */}
        {index === 0 && (
          <p style={{ fontSize: 12, color: '#888', marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
            {locale === 'sk' ? 'Toto sú otázky, na ktoré si odpovedal/a nesprávne. Skús to znova!' : 'These are questions you answered incorrectly. Try again!'}
          </p>
        )}

        {/* Byte */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16, paddingBottom: 4 }}>
          <motion.div
            animate={
              state === 'correct' ? { y: [0, -12, 0], rotate: [0, 10, -10, 0] }
              : state === 'wrong' ? { x: [-4, 4, -4, 4, 0] }
              : { y: [0, -5, 0] }
            }
            transition={state === 'idle' ? { repeat: Infinity, duration: 3 } : { duration: 0.5 }}
          >
            <Byte mood={state === 'correct' ? 'celebrating' : state === 'wrong' ? 'worried' : byteMood} size={56} equipment={equipment} />
          </motion.div>
        </div>

        {/* Counter */}
        <p style={{ fontSize: 9, fontWeight: 800, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          {locale === 'sk' ? 'OTÁZKA' : 'QUESTION'} {index + 1} {locale === 'sk' ? 'Z' : 'OF'} {questions.length}
        </p>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#EDEDED', lineHeight: 1.4, marginBottom: 16 }}>
              {locale === 'sk' ? q.question_text_sk : q.question_text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {options.map(opt => {
                const isSelected = selected === opt.option_label;
                const isCorrect = opt.is_correct;
                const bg = state !== 'idle'
                  ? isCorrect ? 'rgba(74,222,128,0.1)' : isSelected ? 'rgba(239,68,68,0.1)' : '#0a0a0a'
                  : '#0a0a0a';
                const border = state !== 'idle'
                  ? isCorrect ? 'rgba(74,222,128,0.4)' : isSelected ? 'rgba(239,68,68,0.4)' : '#1a1a1a'
                  : '#1a1a1a';
                return (
                  <button
                    key={opt.option_label}
                    onClick={() => handleAnswer(opt.option_label)}
                    disabled={state !== 'idle'}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                      background: bg, border: `1px solid ${border}`, borderRadius: 12,
                      cursor: state === 'idle' ? 'pointer' : 'default', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, background: '#161616', border: '1px solid #2a2a2a',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      fontSize: 12, fontWeight: 700, color: '#888',
                    }}>
                      {opt.option_label}
                    </div>
                    <span style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>
                      {locale === 'sk' ? opt.option_text_sk : opt.option_text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Result */}
            {state !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 16, padding: '14px 16px', borderRadius: 12,
                  background: state === 'correct' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${state === 'correct' ? 'rgba(74,222,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <p style={{ fontSize: 14, fontWeight: 700, color: state === 'correct' ? '#4ade80' : '#ef4444', margin: '0 0 6px' }}>
                  {state === 'correct' ? (locale === 'sk' ? 'Správne!' : 'Correct!') : (locale === 'sk' ? 'Nesprávne' : 'Incorrect')}
                </p>
                {correctOpt && (
                  <p style={{ fontSize: 13, color: '#bbb', margin: '0 0 4px' }}>
                    <strong style={{ color: '#fff' }}>{locale === 'sk' ? correctOpt.option_text_sk : correctOpt.option_text}</strong>
                  </p>
                )}
                {expl && <p style={{ fontSize: 13, color: '#888', margin: 0, lineHeight: 1.5 }}>{expl}</p>}

                {/* Remove from list option */}
                {state === 'correct' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => { removeWrongQuestion(q.id); next(); }}
                      style={{ padding: '8px 14px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <Trash2 size={12} />
                      {locale === 'sk' ? 'Odstrániť z listu' : 'Remove from list'}
                    </button>
                    <button
                      onClick={next}
                      style={{ padding: '8px 14px', borderRadius: 8, background: '#1C1C1C', border: '1px solid #2a2a2a', color: '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {locale === 'sk' ? 'Nechať' : 'Keep'}
                    </button>
                  </div>
                )}
                {state === 'wrong' && (
                  <button
                    onClick={next}
                    style={{ marginTop: 12, padding: '10px 20px', borderRadius: 10, background: '#EDEDED', color: '#000', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {locale === 'sk' ? 'Ďalšia' : 'Next'} <ArrowRight size={14} />
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
