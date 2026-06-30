'use client';

import { useState } from 'react';
import { Exercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

type State = 'idle' | 'correct' | 'wrong';

export default function McqExercise({ exercise, onCorrect, onWrong }: { exercise: Exercise; onCorrect: () => void; onWrong: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>('idle');

  const pick = (opt: string) => {
    if (state !== 'idle') return;
    setSelected(opt);
    if (opt === exercise.correctAnswer) {
      setState('correct');
      setTimeout(onCorrect, 1100);
    } else {
      setState('wrong');
      onWrong();
    }
  };

  const isCode = (s: string) => s.includes('\n') || /^(const|let|def|async|import|<)/.test(s.trim());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Prompt */}
      {exercise.prompt.includes('\n') ? (
        <div>
          <h2 style={{ fontFamily: 'inherit', fontSize: 18, fontWeight: 800, color: '#EDEDED', marginBottom: 12 }}>
            {exercise.prompt.split('\n')[0]}
          </h2>
          <pre style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#EDEDED', overflow: 'auto', lineHeight: 1.7 }}>
            {exercise.prompt.split('\n').slice(1).join('\n').trim()}
          </pre>
        </div>
      ) : (
        <h2 style={{ fontFamily: 'inherit', fontSize: 18, fontWeight: 800, color: '#EDEDED', lineHeight: 1.3 }}>
          {exercise.prompt}
        </h2>
      )}

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exercise.options?.map(opt => {
          const sel = selected === opt;
          const correct = opt === exercise.correctAnswer;
          const showCorrect = state !== 'idle' && correct;
          const showWrong = state === 'wrong' && sel;

          return (
            <motion.button
              key={opt}
              onClick={() => pick(opt)}
              animate={showWrong ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
              transition={{ duration: 0.35 }}
              whileHover={state === 'idle' ? { borderColor: 'rgba(255,255,255,0.18)' } : {}}
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12, textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                background: showCorrect ? 'rgba(74,222,128,0.08)' : showWrong ? 'rgba(255,80,80,0.06)' : '#161616',
                border: `1px solid ${showCorrect ? 'rgba(74,222,128,0.5)' : showWrong ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: showCorrect ? '#4ade80' : showWrong ? '#ff9090' : '#A0A0A0',
                fontFamily: isCode(opt) ? 'JetBrains Mono, monospace' : 'DM Sans, sans-serif',
                fontSize: isCode(opt) ? 13 : 14,
                cursor: state !== 'idle' ? 'default' : 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `1.5px solid ${showCorrect ? '#4ade80' : showWrong ? '#ff6060' : 'rgba(255,255,255,0.12)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: showCorrect ? '#4ade80' : showWrong ? 'rgba(255,80,80,0.15)' : 'transparent',
              }}>
                {showCorrect && <Check size={12} color="#052e16" />}
                {showWrong && <X size={12} color="#ff6060" />}
              </div>
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              padding: '14px 16px', borderRadius: 12,
              background: state === 'correct' ? 'rgba(74,222,128,0.06)' : 'rgba(255,80,80,0.05)',
              border: `1px solid ${state === 'correct' ? 'rgba(74,222,128,0.25)' : 'rgba(255,80,80,0.15)'}`,
            }}
          >
            <p style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 13, color: state === 'correct' ? '#4ade80' : '#ff8080', marginBottom: exercise.explanation ? 4 : 0 }}>
              {state === 'correct' ? 'Správne' : 'Nie celkom'}
            </p>
            {exercise.explanation && <p style={{ fontSize: 13, color: '#999', lineHeight: 1.6, margin: 0 }}>{exercise.explanation}</p>}
            {state === 'wrong' && (
              <motion.button
                onClick={onCorrect} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                style={{ marginTop: 12, width: '100%', padding: '11px', borderRadius: 10, background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.08)', color: '#A0A0A0', fontFamily: 'inherit', fontWeight: 700, fontSize: 13 }}
              >
                Pokračovať
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
