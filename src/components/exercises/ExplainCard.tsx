'use client';

import { Exercise } from '@/types';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onNext: () => void;
}

export default function ExplainCard({ exercise, onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 h-full"
    >
      {/* Concept label */}
      <div className="inline-flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: '#DEFF4A' }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#888780', fontFamily: 'Syne, sans-serif' }}>
          Nový koncept
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
        {exercise.prompt}
      </h2>

      {/* Code snippet */}
      {exercise.codeSnippet && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161B22', borderBottom: '1px solid #30363D' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs" style={{ color: '#6e7681', fontFamily: 'JetBrains Mono, monospace' }}>python</span>
          </div>
          <pre className="p-4 text-sm overflow-x-auto" style={{ color: '#E6EDF3', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.7 }}>
            <code>{exercise.codeSnippet}</code>
          </pre>
        </div>
      )}

      {/* Explanation */}
      {exercise.explanation && (
        <div className="rounded-2xl p-4" style={{ background: '#1E1E1E', border: '1px solid #2a2a2a' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#c9c7be' }}>
            {exercise.explanation}
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="flex-1" />
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
        style={{
          background: '#DEFF4A',
          color: '#0A0A0A',
          fontFamily: 'Syne, sans-serif',
        }}
      >
        Rozumiem
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
}
