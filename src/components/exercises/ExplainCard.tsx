'use client';

import { Exercise } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ExplainCard({ exercise, onNext }: { exercise: Exercise; onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EDEDED' }} />
        <span style={{ fontSize: 11, fontFamily: 'inherit', fontWeight: 700, color: '#6E6E6E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Nový koncept
        </span>
      </div>

      <h2 style={{ fontFamily: 'inherit', fontSize: 20, fontWeight: 800, color: '#EDEDED' }}>
        {exercise.prompt}
      </h2>

      {exercise.codeSnippet && (
        <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ background: '#111', padding: '10px 16px', display: 'flex', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          </div>
          <pre style={{ background: '#0A0A0A', padding: '16px', fontSize: 13, lineHeight: 1.8, color: '#EDEDED', overflow: 'auto', margin: 0 }}>
            <code>{exercise.codeSnippet}</code>
          </pre>
        </div>
      )}

      {exercise.explanation && (
        <div style={{ padding: '14px 16px', background: '#161616', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: '#A0A0A0', lineHeight: 1.7, margin: 0 }}>{exercise.explanation}</p>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <motion.button
        onClick={onNext} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
        style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#EDEDED', color: '#0F0F0F', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        Rozumiem <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
}
