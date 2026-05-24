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

export default function FillExercise({ exercise, onCorrect, onWrong }: Props) {
  const blanks = exercise.blanks ?? [];
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const handleSelect = (blankId: string, value: string) => {
    if (checked) return;
    setSelections((s) => ({ ...s, [blankId]: value }));
  };

  const allFilled = blanks.every((b) => selections[b.id]);

  const handleCheck = () => {
    const correct = blanks.every((b) => selections[b.id] === b.correct);
    setChecked(true);
    setAllCorrect(correct);
    if (correct) {
      setTimeout(onCorrect, 1200);
    } else {
      onWrong();
    }
  };

  const handleRetry = () => {
    setSelections({});
    setChecked(false);
  };

  // Render code with blanks replaced by interactive selectors
  const renderCode = () => {
    const parts = (exercise.codeSnippet ?? '').split(/(___)/ );
    let blankIdx = 0;
    return parts.map((part, i) => {
      if (part === '___') {
        const blank = blanks[blankIdx++];
        if (!blank) return null;
        const val = selections[blank.id];
        const isCorrect = checked && val === blank.correct;
        const isWrong = checked && val !== blank.correct;
        return (
          <span
            key={`blank-${blank.id}`}
            className="inline-flex items-center mx-1"
            style={{
              background: isCorrect ? '#1D9E7522' : isWrong ? '#D85A3022' : val ? '#534AB722' : '#2a2a2a',
              border: `1.5px solid ${isCorrect ? '#1D9E75' : isWrong ? '#D85A30' : val ? '#534AB7' : '#404040'}`,
              borderRadius: '8px',
              padding: '2px 10px',
              color: isCorrect ? '#4ade80' : isWrong ? '#fb923c' : val ? '#DEFF4A' : '#888780',
              fontFamily: 'JetBrains Mono, monospace',
              minWidth: '80px',
              textAlign: 'center',
              fontSize: '13px',
            }}
          >
            {val || '?'}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  let blankSelectorIdx = 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
        {exercise.prompt}
      </h2>

      {/* Code with blanks */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161B22', borderBottom: '1px solid #30363D' }}>
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <pre className="p-4 text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap" style={{ color: '#E6EDF3', fontFamily: 'JetBrains Mono, monospace' }}>
          {renderCode()}
        </pre>
      </div>

      {/* Option banks for each blank */}
      <div className="flex flex-col gap-3">
        {blanks.map((blank) => (
          <div key={blank.id}>
            <div className="text-xs mb-2" style={{ color: '#888780', fontFamily: 'Syne, sans-serif' }}>
              Vyber správnu odpoveď:
            </div>
            <div className="flex flex-wrap gap-2">
              {blank.options.map((opt) => {
                const isSelected = selections[blank.id] === opt;
                const isCorrect = checked && opt === blank.correct;
                const isWrong = checked && isSelected && opt !== blank.correct;
                return (
                  <motion.button
                    key={opt}
                    onClick={() => handleSelect(blank.id, opt)}
                    whileHover={!checked ? { scale: 1.05 } : {}}
                    whileTap={!checked ? { scale: 0.95 } : {}}
                    animate={isWrong ? { x: [-4, 4, -3, 3, 0] } : {}}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background: isCorrect ? '#1D9E7522' : isWrong ? '#D85A3022' : isSelected ? '#534AB722' : '#1E1E1E',
                      border: `1.5px solid ${isCorrect ? '#1D9E75' : isWrong ? '#D85A30' : isSelected ? '#534AB7' : '#2a2a2a'}`,
                      color: isCorrect ? '#4ade80' : isWrong ? '#fb923c' : isSelected ? '#DEFF4A' : '#c9c7be',
                      fontFamily: 'JetBrains Mono, monospace',
                      cursor: checked ? 'default' : 'pointer',
                    }}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4"
            style={{
              background: allCorrect ? '#1D9E7515' : '#D85A3015',
              border: `1.5px solid ${allCorrect ? '#1D9E75' : '#D85A30'}`,
            }}
          >
            <p className="font-bold text-sm" style={{ color: allCorrect ? '#1D9E75' : '#D85A30', fontFamily: 'Syne, sans-serif' }}>
              {allCorrect ? '✓ Výborne!' : '✗ Nie celkom správne'}
            </p>
            {!allCorrect && (
              <motion.button
                onClick={handleRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-3 w-full py-2.5 rounded-xl font-bold text-sm"
                style={{ background: '#D85A30', color: 'white', fontFamily: 'Syne, sans-serif' }}
              >
                Skúsiť znova
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check button */}
      {!checked && (
        <motion.button
          onClick={handleCheck}
          disabled={!allFilled}
          whileHover={allFilled ? { scale: 1.02 } : {}}
          whileTap={allFilled ? { scale: 0.97 } : {}}
          className="w-full py-4 rounded-2xl font-bold text-base"
          style={{
            background: allFilled ? '#DEFF4A' : '#1E1E1E',
            color: allFilled ? '#0A0A0A' : '#888780',
            fontFamily: 'Syne, sans-serif',
            transition: 'all 0.2s',
            cursor: allFilled ? 'pointer' : 'not-allowed',
          }}
        >
          Skontrolovať
        </motion.button>
      )}
    </div>
  );
}
