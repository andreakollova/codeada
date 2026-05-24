'use client';

import { useState } from 'react';
import { Exercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onCorrect: () => void;
  onWrong: () => void;
}

type AnswerState = 'idle' | 'correct' | 'wrong';

export default function McqExercise({ exercise, onCorrect, onWrong }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>('idle');

  const handleSelect = (option: string) => {
    if (state !== 'idle') return;
    setSelected(option);
    if (option === exercise.correctAnswer) {
      setState('correct');
      setTimeout(onCorrect, 1200);
    } else {
      setState('wrong');
      onWrong();
    }
  };

  const handleContinue = () => {
    if (state === 'wrong') onCorrect(); // Allow continue after seeing correct
  };

  const isCode = (s: string) => s.includes('\n') || s.startsWith('const ') || s.startsWith('let ') || s.startsWith('def ') || s.includes('(') || s.startsWith('<');

  return (
    <div className="flex flex-col gap-4">
      {/* Prompt */}
      <div>
        {exercise.prompt.includes('\n') ? (
          <>
            <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
              {exercise.prompt.split('\n')[0]}
            </h2>
            <pre className="p-4 rounded-xl text-sm overflow-x-auto" style={{
              background: '#0D1117', color: '#E6EDF3',
              fontFamily: 'JetBrains Mono, monospace', border: '1px solid #30363D'
            }}>
              {exercise.prompt.split('\n').slice(1).join('\n').trim()}
            </pre>
          </>
        ) : (
          <h2 className="text-lg font-bold leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
            {exercise.prompt}
          </h2>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {exercise.options?.map((opt) => {
          const isSelected = selected === opt;
          const isCorrect = opt === exercise.correctAnswer;
          let bg = '#1E1E1E';
          let border = '#2a2a2a';
          let textColor = '#F1EFE8';

          if (state !== 'idle' && isSelected && state === 'correct') {
            bg = '#1D9E7522'; border = '#1D9E75'; textColor = '#4ade80';
          } else if (state !== 'idle' && isSelected && state === 'wrong') {
            bg = '#D85A3022'; border = '#D85A30'; textColor = '#fb923c';
          } else if (state !== 'idle' && isCorrect) {
            bg = '#1D9E7511'; border = '#1D9E7566'; textColor = '#4ade80';
          }

          return (
            <motion.button
              key={opt}
              onClick={() => handleSelect(opt)}
              whileHover={state === 'idle' ? { scale: 1.01, borderColor: '#534AB7' } : {}}
              whileTap={state === 'idle' ? { scale: 0.98 } : {}}
              animate={state === 'wrong' && isSelected ? {
                x: [-6, 6, -4, 4, -2, 2, 0]
              } : {}}
              transition={{ duration: 0.4 }}
              className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3"
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                color: textColor,
                fontFamily: isCode(opt) ? 'JetBrains Mono, monospace' : 'DM Sans, sans-serif',
                fontSize: isCode(opt) ? '13px' : '15px',
                cursor: state !== 'idle' ? 'default' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {state !== 'idle' && isSelected && state === 'correct' && <CheckCircle size={18} style={{ color: '#1D9E75', flexShrink: 0 }} />}
              {state !== 'idle' && isSelected && state === 'wrong' && <XCircle size={18} style={{ color: '#D85A30', flexShrink: 0 }} />}
              {state !== 'idle' && !isSelected && isCorrect && <CheckCircle size={18} style={{ color: '#1D9E7566', flexShrink: 0 }} />}
              <span>{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Feedback panel */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4"
            style={{
              background: state === 'correct' ? '#1D9E7515' : '#D85A3015',
              border: `1.5px solid ${state === 'correct' ? '#1D9E75' : '#D85A30'}`,
            }}
          >
            <p className="font-bold text-sm mb-1" style={{
              fontFamily: 'Syne, sans-serif',
              color: state === 'correct' ? '#1D9E75' : '#D85A30',
            }}>
              {state === 'correct' ? '✓ Správne!' : '✗ Skoro!'}
            </p>
            {exercise.explanation && (
              <p className="text-sm" style={{ color: '#c9c7be' }}>{exercise.explanation}</p>
            )}
            {state === 'wrong' && (
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full py-2.5 rounded-xl font-bold text-sm"
                style={{ background: '#D85A30', color: 'white', fontFamily: 'Syne, sans-serif' }}
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
