'use client';

import { useState, useRef } from 'react';
import { Exercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  exercise: Exercise;
  onCorrect: () => void;
  onWrong: () => void;
}

type RunState = 'idle' | 'running' | 'passed' | 'failed';

// Simple heuristic evaluator for "contains:" type test cases
// Full Pyodide integration can be added later
function evaluateCode(code: string, testCases: Exercise['testCases']): { passed: boolean; output: string; failedCase?: string } {
  if (!testCases || testCases.length === 0) return { passed: true, output: '' };

  for (const tc of testCases) {
    if (tc.expected.startsWith('contains:')) {
      const needle = tc.expected.replace('contains:', '').trim();
      if (!code.includes(needle)) {
        return { passed: false, output: '', failedCase: `Kód by mal obsahovať: ${needle}` };
      }
    }
    // Numeric result checks
    else if (/^\d+$/.test(tc.expected)) {
      // Check if number appears in a print statement context
      const hasPrint = code.includes('print') || code.includes('return');
      if (!hasPrint) {
        return { passed: false, output: '', failedCase: 'Výstup musí byť vypísaný pomocou print()' };
      }
    }
  }
  return { passed: true, output: 'Testy prešli ✓' };
}

export default function WriteExercise({ exercise, onCorrect, onWrong }: Props) {
  const [code, setCode] = useState(exercise.codeSnippet ?? '');
  const [runState, setRunState] = useState<RunState>('idle');
  const [feedback, setFeedback] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = async () => {
    if (runState === 'running') return;
    setRunState('running');
    setFeedback('');

    // Simulate evaluation delay for UX
    await new Promise((r) => setTimeout(r, 800));

    const result = evaluateCode(code, exercise.testCases);

    if (result.passed) {
      setRunState('passed');
      setFeedback('Testy prešli! 🎉');
      setTimeout(onCorrect, 1400);
    } else {
      setRunState('failed');
      setFeedback(result.failedCase ?? 'Test neprebehol. Skús inak.');
      onWrong();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Prompt */}
      <h2 className="text-lg font-bold leading-snug" style={{ fontFamily: 'Syne, sans-serif' }}>
        {exercise.prompt}
      </h2>

      {/* Test cases hint */}
      {exercise.testCases && (
        <div className="flex flex-col gap-1">
          {exercise.testCases.map((tc, i) => (
            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#888780' }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#888780' }} />
              {tc.description ?? tc.expected}
            </div>
          ))}
        </div>
      )}

      {/* Code editor */}
      <div className="relative">
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: `1.5px solid ${runState === 'passed' ? '#1D9E75' : runState === 'failed' ? '#D85A30' : '#30363D'}` }}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161B22', borderBottom: '1px solid #30363D' }}>
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs" style={{ color: '#6e7681', fontFamily: 'JetBrains Mono, monospace' }}>
              {exercise.conceptId?.includes('ts') || exercise.conceptId?.includes('async') ? 'typescript' : 'python'}
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => { setCode(e.target.value); setRunState('idle'); }}
            onKeyDown={handleKeyDown}
            className="code-input"
            rows={Math.max(6, code.split('\n').length + 2)}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl p-4"
            style={{
              background: runState === 'passed' ? '#1D9E7515' : '#D85A3015',
              border: `1.5px solid ${runState === 'passed' ? '#1D9E75' : '#D85A30'}`,
            }}
          >
            {runState === 'passed'
              ? <CheckCircle size={18} style={{ color: '#1D9E75', flexShrink: 0, marginTop: 1 }} />
              : <XCircle size={18} style={{ color: '#D85A30', flexShrink: 0, marginTop: 1 }} />
            }
            <p className="text-sm" style={{ color: '#c9c7be' }}>{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run button */}
      <motion.button
        onClick={handleRun}
        disabled={runState === 'running' || !code.trim()}
        whileHover={runState !== 'running' && code.trim() ? { scale: 1.02 } : {}}
        whileTap={runState !== 'running' && code.trim() ? { scale: 0.97 } : {}}
        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
        style={{
          background: runState === 'passed' ? '#1D9E75' : runState === 'failed' ? '#1E1E1E' : code.trim() ? '#DEFF4A' : '#1E1E1E',
          color: runState === 'passed' ? 'white' : runState === 'failed' ? '#888780' : code.trim() ? '#0A0A0A' : '#888780',
          fontFamily: 'Syne, sans-serif',
          transition: 'all 0.2s',
          cursor: runState === 'running' || !code.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {runState === 'running' ? (
          <><Loader2 size={18} className="animate-spin" /> Spúšťam...</>
        ) : runState === 'passed' ? (
          <><CheckCircle size={18} /> Hotovo!</>
        ) : runState === 'failed' ? (
          <><Play size={18} /> Skúsiť znova</>
        ) : (
          <><Play size={18} /> Spustiť kód</>
        )}
      </motion.button>
    </div>
  );
}
