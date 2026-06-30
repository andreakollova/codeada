'use client';

import { useState, useRef } from 'react';
import { Exercise } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, Loader2, X } from 'lucide-react';

type Run = 'idle' | 'running' | 'passed' | 'failed';

function evaluate(code: string, testCases: Exercise['testCases']): { ok: boolean; msg?: string } {
  if (!testCases?.length) return { ok: true };
  for (const tc of testCases) {
    if (tc.expected.startsWith('contains:')) {
      const needle = tc.expected.replace('contains:', '').trim();
      if (!code.includes(needle)) return { ok: false, msg: `Kód by mal obsahovať: ${needle}` };
    }
  }
  return { ok: true };
}

export default function WriteExercise({ exercise, onCorrect, onWrong }: { exercise: Exercise; onCorrect: () => void; onWrong: () => void }) {
  const [code, setCode] = useState(exercise.codeSnippet ?? '');
  const [run, setRun] = useState<Run>('idle');
  const [msg, setMsg] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleRun = async () => {
    if (run === 'running') return;
    setRun('running'); setMsg('');
    await new Promise(r => setTimeout(r, 700));
    const res = evaluate(code, exercise.testCases);
    if (res.ok) { setRun('passed'); setMsg('Testy prešli'); setTimeout(onCorrect, 1200); }
    else { setRun('failed'); setMsg(res.msg ?? 'Test neprešiel'); onWrong(); }
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const s = e.currentTarget.selectionStart, en = e.currentTarget.selectionEnd;
    const next = code.substring(0, s) + '    ' + code.substring(en);
    setCode(next);
    setTimeout(() => { if (ref.current) { ref.current.selectionStart = ref.current.selectionEnd = s + 4; } }, 0);
  };

  const btnBg = run === 'passed' ? 'rgba(255,255,255,0.1)' : run === 'failed' ? '#1C1C1C' : code.trim() ? '#EDEDED' : '#1C1C1C';
  const btnColor = run === 'passed' ? '#EDEDED' : run === 'failed' ? '#6E6E6E' : code.trim() ? '#0F0F0F' : '#3A3A3A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontWeight: 700, fontSize: 18, color: '#EDEDED', lineHeight: 1.3 }}>{exercise.prompt}</h2>

      {exercise.testCases?.map((tc, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3A3A3A', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#999' }}>{tc.description ?? tc.expected}</span>
        </div>
      ))}

      {/* Editor */}
      <div style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${run === 'passed' ? 'rgba(255,255,255,0.2)' : run === 'failed' ? 'rgba(255,80,80,0.2)' : 'rgba(255,255,255,0.06)'}`, transition: 'border-color 0.2s' }}>
        <div style={{ background: '#111', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          <span style={{ marginLeft: 8, fontSize: 11, color: '#3A3A3A', fontFamily: 'JetBrains Mono, monospace' }}>python</span>
        </div>
        <textarea
          ref={ref} value={code}
          onChange={e => { setCode(e.target.value); setRun('idle'); }}
          onKeyDown={handleTab}
          className="code-input"
          rows={Math.max(5, code.split('\n').length + 1)}
          spellCheck={false} autoCapitalize="none" autoCorrect="off"
        />
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', gap: 10, padding: '13px 16px', borderRadius: 12, alignItems: 'flex-start',
              background: run === 'passed' ? 'rgba(255,255,255,0.04)' : 'rgba(255,80,80,0.05)',
              border: `1px solid ${run === 'passed' ? 'rgba(255,255,255,0.12)' : 'rgba(255,80,80,0.15)'}` }}>
            {run === 'passed' ? <Check size={15} color="#EDEDED" style={{ flexShrink: 0, marginTop: 1 }} /> : <X size={15} color="#ff8080" style={{ flexShrink: 0, marginTop: 1 }} />}
            <span style={{ fontSize: 13, color: run === 'passed' ? '#A0A0A0' : '#ff9090' }}>{msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleRun} disabled={run === 'running' || !code.trim()}
        whileHover={run !== 'running' && code.trim() ? { scale: 1.01 } : {}}
        whileTap={run !== 'running' && code.trim() ? { scale: 0.98 } : {}}
        style={{ padding: '14px', borderRadius: 12, background: btnBg, color: btnColor, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: run === 'running' || !code.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}
      >
        {run === 'running' ? <><Loader2 size={16} className="animate-spin" />Spúšťam...</>
         : run === 'passed'  ? <><Check size={16} />Hotovo</>
         : <><Play size={16} />Spustiť</>}
      </motion.button>
    </div>
  );
}
