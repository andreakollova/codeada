'use client';

import { useState } from 'react';
import { Exercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

export default function FillExercise({ exercise, onCorrect, onWrong }: { exercise: Exercise; onCorrect: () => void; onWrong: () => void }) {
  const blanks = exercise.blanks ?? [];
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const pick = (id: string, val: string) => { if (!checked) setSelections(s => ({ ...s, [id]: val })); };
  const allFilled = blanks.every(b => selections[b.id]);

  const check = () => {
    const ok = blanks.every(b => selections[b.id] === b.correct);
    setChecked(true); setAllCorrect(ok);
    if (ok) setTimeout(onCorrect, 1100); else onWrong();
  };

  let bi = 0;
  const renderCode = () => (exercise.codeSnippet ?? '').split(/(___)/).map((part, i) => {
    if (part !== '___') return <span key={i}>{part}</span>;
    const blank = blanks[bi++];
    if (!blank) return null;
    const val = selections[blank.id];
    const ok = checked && val === blank.correct;
    const bad = checked && val !== blank.correct;
    return (
      <span key={`b-${blank.id}`} style={{
        display: 'inline-flex', alignItems: 'center', margin: '0 3px',
        padding: '1px 10px', borderRadius: 6,
        background: ok ? 'rgba(255,255,255,0.08)' : bad ? 'rgba(255,80,80,0.08)' : val ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${ok ? 'rgba(255,255,255,0.25)' : bad ? 'rgba(255,80,80,0.25)' : val ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)'}`,
        color: ok ? '#EDEDED' : bad ? '#ff9090' : val ? '#EDEDED' : '#6E6E6E',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, minWidth: 70, justifyContent: 'center',
      }}>{val || '?'}</span>
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, color: '#EDEDED' }}>{exercise.prompt}</h2>

      <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ background: '#111', padding: '10px 16px', display: 'flex', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
        </div>
        <pre style={{ background: '#0A0A0A', padding: '16px', fontSize: 13, lineHeight: 2, color: '#EDEDED', overflow: 'auto', margin: 0, whiteSpace: 'pre-wrap' }}>
          {renderCode()}
        </pre>
      </div>

      {blanks.map(blank => (
        <div key={blank.id}>
          <p style={{ fontSize: 12, color: '#6E6E6E', marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>Vyber správnu odpoveď:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {blank.options.map(opt => {
              const sel = selections[blank.id] === opt;
              const ok = checked && opt === blank.correct;
              const bad = checked && sel && opt !== blank.correct;
              return (
                <motion.button key={opt} onClick={() => pick(blank.id, opt)}
                  animate={bad ? { x: [-4, 4, -3, 3, 0] } : {}}
                  whileHover={!checked ? { borderColor: 'rgba(255,255,255,0.2)' } : {}}
                  style={{
                    padding: '8px 16px', borderRadius: 10,
                    background: ok ? 'rgba(255,255,255,0.06)' : bad ? 'rgba(255,80,80,0.06)' : sel ? 'rgba(255,255,255,0.05)' : '#161616',
                    border: `1px solid ${ok ? 'rgba(255,255,255,0.25)' : bad ? 'rgba(255,80,80,0.25)' : sel ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)'}`,
                    color: ok ? '#EDEDED' : bad ? '#ff9090' : sel ? '#EDEDED' : '#A0A0A0',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
                    cursor: checked ? 'default' : 'pointer', transition: 'all 0.12s',
                  }}>
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {checked && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '14px 16px', borderRadius: 12,
              background: allCorrect ? 'rgba(255,255,255,0.04)' : 'rgba(255,80,80,0.05)',
              border: `1px solid ${allCorrect ? 'rgba(255,255,255,0.12)' : 'rgba(255,80,80,0.15)'}` }}>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: allCorrect ? '#EDEDED' : '#ff8080', margin: 0 }}>
              {allCorrect ? 'Správne' : 'Nie celkom'}
            </p>
            {!allCorrect && (
              <motion.button onClick={() => { setSelections({}); setChecked(false); }} whileHover={{ scale: 1.01 }}
                style={{ marginTop: 10, width: '100%', padding: '11px', borderRadius: 10, background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.08)', color: '#A0A0A0', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13 }}>
                Skúsiť znova
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!checked && (
        <motion.button onClick={check} disabled={!allFilled} whileHover={allFilled ? { scale: 1.01 } : {}} whileTap={allFilled ? { scale: 0.98 } : {}}
          style={{ padding: '14px', borderRadius: 12, background: allFilled ? '#EDEDED' : '#1C1C1C', color: allFilled ? '#0F0F0F' : '#3A3A3A', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, transition: 'all 0.15s', cursor: allFilled ? 'pointer' : 'not-allowed' }}>
          Skontrolovať
        </motion.button>
      )}
    </div>
  );
}
