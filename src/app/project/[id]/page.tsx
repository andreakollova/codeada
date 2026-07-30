'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getProject } from '@/data/projects/index';
import { usePyodide } from '@/hooks/usePyodide';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, Check, X, BookOpen, HelpCircle, Code2, PenTool, Lightbulb,
  Eye, Download, Lock, Trophy, CheckCircle2, Circle, Play, Loader2, ChevronRight,
} from 'lucide-react';
import type { InteractiveProject, ProjectStep } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
const CalculatorPreview = dynamic(() => import('@/components/projects/CalculatorPreview'), { ssr: false });
const PasswordPreview = dynamic(() => import('@/components/projects/PasswordPreview'), { ssr: false });
const TodoPreview = dynamic(() => import('@/components/projects/TodoPreview'), { ssr: false });

// ─── Helpers ───
function getAllSteps(p: InteractiveProject) {
  const all: { step: ProjectStep; globalIdx: number }[] = [];
  let gi = 0;
  p.sections.forEach(sec => sec.steps.forEach(step => all.push({ step, globalIdx: gi++ })));
  return all;
}
function compKey(pid: string, sid: string) { return `project-${pid}-${sid}`; }

function StepIcon({ type, size = 16 }: { type: string; size?: number }) {
  const m: Record<string, any> = { theory: BookOpen, quiz: HelpCircle, fill: Code2, write: PenTool };
  const I = m[type] || Circle;
  return <I size={size} />;
}

const stepLabel: Record<string, Record<string, string>> = {
  theory: { sk: 'Teória', en: 'Theory' },
  quiz: { sk: 'Kvíz', en: 'Quiz' },
  fill: { sk: 'Doplň kód', en: 'Fill Code' },
  write: { sk: 'Napíš kód', en: 'Write Code' },
};

// ─── Preview container ───
function PreviewPanel({ projectId, variables }: { projectId: string; variables: Record<string, any> }) {
  const map: Record<string, any> = {
    calculator: CalculatorPreview,
    'password-generator': PasswordPreview,
    'todo-list': TodoPreview,
  };
  const Comp = map[projectId];
  if (!Comp) return <div style={{ padding: 40, textAlign: 'center', color: '#333', fontSize: 13 }}>Preview</div>;
  return <Comp variables={variables} />;
}

// ─── Download helper ───
function downloadCode(filename: string, code: string) {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════
// THEORY STEP
// ═══════════════════════════════════════════════════
function TheoryView({ step, onComplete, locale }: { step: ProjectStep; onComplete: () => void; locale: string }) {
  const rendered = useMemo(() => {
    if (!step.theoryContent) return '';
    // Remove first heading if it matches the step title (avoid duplicate)
    let md = step.theoryContent.replace(/^# .+\n+/, '');

    // Tables — parse before other replacements
    md = md.replace(/((?:\|.+\|\n)+)/g, (tableBlock) => {
      const rows = tableBlock.trim().split('\n').filter(r => r.includes('|'));
      const parsed = rows.map(r => r.split('|').filter(Boolean).map(c => c.trim()));
      // Skip separator row (|---|---|)
      const dataRows = parsed.filter(r => !r.every(c => /^[-:]+$/.test(c)));
      if (dataRows.length === 0) return '';
      const header = dataRows[0];
      const body = dataRows.slice(1);
      return '<table class="md-table"><thead><tr>' + header.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' + body.map(r => '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>';
    });

    // Code blocks
    md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
    // Inline code
    md = md.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    // Headings
    md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // Bold
    md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Lists
    md = md.replace(/^- (.+)$/gm, '<li>$1</li>');
    md = md.replace(/((?:<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>');
    // Paragraphs — single newlines between non-block elements
    md = md.replace(/\n\n/g, '</p><p>');
    md = '<p>' + md + '</p>';
    // Clean up empty paragraphs
    md = md.replace(/<p>\s*<\/p>/g, '');
    md = md.replace(/<p>\s*(<h[123]>)/g, '$1');
    md = md.replace(/(<\/h[123]>)\s*<\/p>/g, '$1');
    md = md.replace(/<p>\s*(<pre)/g, '$1');
    md = md.replace(/(<\/pre>)\s*<\/p>/g, '$1');
    md = md.replace(/<p>\s*(<table)/g, '$1');
    md = md.replace(/(<\/table>)\s*<\/p>/g, '$1');
    md = md.replace(/<p>\s*(<ul>)/g, '$1');
    md = md.replace(/(<\/ul>)\s*<\/p>/g, '$1');

    return md;
  }, [step.theoryContent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="theory-content" dangerouslySetInnerHTML={{ __html: rendered }} style={{ fontSize: 15, lineHeight: 1.8, color: '#ccc' }} />
      <button onClick={onComplete} style={{
        padding: '14px 32px', background: '#22c55e', color: '#000', border: 'none',
        borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start',
      }}>{locale === 'sk' ? 'Pokračovať' : 'Continue'}</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// QUIZ STEP
// ═══════════════════════════════════════════════════
function QuizView({ step, onComplete, locale }: { step: ProjectStep; onComplete: () => void; locale: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const [res, setRes] = useState<'ok' | 'bad' | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{step.quizQuestion}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {step.quizOptions?.map((o, i) => {
          const picked = sel === i;
          const right = res === 'ok' && picked;
          const wrong = res === 'bad' && picked;
          const answer = res && o.correct;
          return (
            <button key={i} onClick={() => !res && setSel(i)} style={{
              padding: '14px 18px', borderRadius: 12, border: '1px solid',
              borderColor: right ? '#22c55e' : wrong ? '#ef4444' : answer ? '#22c55e40' : picked ? '#fff' : 'rgba(255,255,255,0.1)',
              background: right ? '#22c55e15' : wrong ? '#ef444415' : 'transparent',
              color: '#ddd', textAlign: 'left', cursor: res ? 'default' : 'pointer', fontSize: 15,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {right ? <Check size={18} color="#22c55e" /> : wrong ? <X size={18} color="#ef4444" /> : answer ? <Check size={18} color="#22c55e" style={{ opacity: 0.5 }} /> : <Circle size={18} style={{ opacity: 0.3 }} />}
              {o.text}
            </button>
          );
        })}
      </div>
      {!res && <button onClick={() => sel !== null && setRes(step.quizOptions![sel].correct ? 'ok' : 'bad')} disabled={sel === null} style={{
        padding: '14px 32px', background: sel !== null ? '#22c55e' : '#333', color: sel !== null ? '#000' : '#666',
        border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: sel !== null ? 'pointer' : 'default', alignSelf: 'flex-start',
      }}>{locale === 'sk' ? 'Skontrolovať' : 'Check'}</button>}
      {res === 'ok' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#22c55e15', borderRadius: 12, border: '1px solid #22c55e40',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Check size={20} color="#22c55e" />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>{locale === 'sk' ? 'Správne!' : 'Correct!'} +{step.xp} XP</span>
          <button onClick={onComplete} style={{ marginLeft: 'auto', padding: '8px 20px', background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
            {locale === 'sk' ? 'Ďalej' : 'Next'}
          </button>
        </motion.div>
      )}
      {res === 'bad' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#ef444415', borderRadius: 12, border: '1px solid #ef444440',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <X size={18} color="#ef4444" />
          <span style={{ color: '#ef4444' }}>{locale === 'sk' ? 'Skús to znova' : 'Try again'}</span>
          <button onClick={() => { setRes(null); setSel(null); }} style={{
            marginLeft: 'auto', padding: '6px 16px', background: 'transparent', color: '#ef4444',
            border: '1px solid #ef444440', borderRadius: 8, cursor: 'pointer', fontSize: 13,
          }}>{locale === 'sk' ? 'Skúsiť znova' : 'Retry'}</button>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FILL CODE STEP
// ═══════════════════════════════════════════════════
function FillCodeView({ step, onComplete, locale }: { step: ProjectStep; onComplete: () => void; locale: string }) {
  const blanks = step.fillBlanks || [];
  const hints = step.hints || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [res, setRes] = useState<'ok' | 'bad' | null>(null);
  const [hintIdx, setHintIdx] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);

  const handleCheck = () => {
    const ok = blanks.every(b => {
      const a = (answers[b.id] || '').trim();
      return a === b.answer || (b.alternatives?.includes(a) ?? false);
    });
    setRes(ok ? 'ok' : 'bad');
  };

  // Auto-generate progressive hints from blanks if none provided
  const effectiveHints = hints.length > 0 ? hints : blanks.flatMap((b, i) => [
    { text: locale === 'sk' ? 'Pozri sa na kód okolo prázdneho miesta. Čo tam logicky patrí?' : 'Look at the code around the blank. What logically belongs there?' },
    { text: locale === 'sk' ? `Odpoveď má ${b.answer.length} ${b.answer.length === 1 ? 'znak' : b.answer.length < 5 ? 'znaky' : 'znakov'} a začína na "${b.answer[0]}".` : `The answer has ${b.answer.length} characters and starts with "${b.answer[0]}".` },
  ]);

  const lines = (step.fillCode || '').split('\n');
  let bi = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {step.prompt && <p style={{ color: '#ccc', fontSize: 15 }}>{step.prompt}</p>}
      <div style={{ background: '#1a1a1a', borderRadius: 12, padding: '20px 24px', fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 2.2, border: '1px solid rgba(255,255,255,0.08)', overflow: 'auto' }}>
        {lines.map((line, li) => {
          const parts = line.split('___');
          if (parts.length === 1) return <div key={li} style={{ color: '#a0a0a0' }}>{line || '\u00A0'}</div>;
          const b = blanks[bi]; bi++;
          return (
            <div key={li} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <span style={{ color: '#a0a0a0' }}>{parts[0]}</span>
              <input value={answers[b?.id || ''] || ''} onChange={e => setAnswers(p => ({ ...p, [b?.id || '']: e.target.value }))}
                placeholder="..." disabled={res === 'ok'} autoFocus={bi === 1} style={{
                  background: res === 'ok' ? '#22c55e20' : '#0a0a0a', border: '2px solid',
                  borderColor: res === 'ok' ? '#22c55e' : res === 'bad' ? '#ef4444' : '#22c55e60',
                  borderRadius: 6, padding: '4px 12px', color: '#fff', fontFamily: 'inherit', fontSize: 14, minWidth: 100, maxWidth: 240, outline: 'none',
                }} />
              <span style={{ color: '#a0a0a0' }}>{parts[1]}</span>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {!res && <button onClick={handleCheck} style={{ padding: '14px 32px', background: '#22c55e', color: '#000', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{locale === 'sk' ? 'Skontrolovať' : 'Check'}</button>}
        {effectiveHints.length > 0 && !res && (
          <button onClick={() => setHintIdx(p => Math.min(p + 1, effectiveHints.length - 1))} style={{
            padding: '14px 24px', background: 'transparent', color: '#a0a0a0',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Lightbulb size={16} />
            {locale === 'sk' ? 'Nápoveda' : 'Hint'} {hintIdx >= 0 ? `(${hintIdx + 1}/${effectiveHints.length})` : ''}
          </button>
        )}
      </div>

      {/* Hints */}
      {hintIdx >= 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {effectiveHints.slice(0, hintIdx + 1).map((h, i) => (
            <div key={i} style={{ padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', fontSize: 14, color: '#bbb' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600, marginRight: 8 }}>{locale === 'sk' ? 'Nápoveda' : 'Hint'} {i + 1}:</span>
              {h.text}
              {(h as any).code && <pre style={{ marginTop: 8, padding: '8px 12px', background: '#111', borderRadius: 6, color: '#22c55e', fontSize: 13 }}>{(h as any).code}</pre>}
            </div>
          ))}
          {hintIdx >= effectiveHints.length - 1 && !showSolution && (
            <button onClick={() => setShowSolution(true)} style={{
              padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
            }}><Eye size={14} /> {locale === 'sk' ? 'Zobraziť odpoveď' : 'Show answer'}</button>
          )}
          {showSolution && (
            <div style={{ padding: 16, background: '#111', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <pre style={{ color: '#22c55e', fontSize: 13, whiteSpace: 'pre-wrap' }}>{blanks.map(b => b.answer).join(', ')}</pre>
            </div>
          )}
        </div>
      )}

      {res === 'ok' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 16, background: '#22c55e15', borderRadius: 12, border: '1px solid #22c55e40', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Check size={20} color="#22c55e" />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>{locale === 'sk' ? 'Správne!' : 'Correct!'} +{step.xp} XP</span>
          <button onClick={onComplete} style={{ marginLeft: 'auto', padding: '8px 20px', background: '#22c55e', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{locale === 'sk' ? 'Ďalej' : 'Next'}</button>
        </motion.div>
      )}
      {res === 'bad' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 16, background: '#ef444415', borderRadius: 12, border: '1px solid #ef444440', display: 'flex', alignItems: 'center', gap: 12 }}>
          <X size={18} color="#ef4444" />
          <span style={{ color: '#ef4444' }}>{locale === 'sk' ? 'Skontroluj odpoveď' : 'Check your answer'}</span>
          <button onClick={() => setRes(null)} style={{ marginLeft: 'auto', padding: '6px 16px', background: 'transparent', color: '#ef4444', border: '1px solid #ef444440', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>{locale === 'sk' ? 'Skúsiť znova' : 'Retry'}</button>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// WRITE CODE STEP (with Pyodide)
// ═══════════════════════════════════════════════════
function WriteCodeView({ step, onComplete, locale, onVariables }: {
  step: ProjectStep; onComplete: () => void; locale: string;
  onVariables: (v: Record<string, any>) => void;
}) {
  // Clean starter code — replace ___ placeholders with comment
  const cleanStarter = (s: string) => s.replace(/__{3,}/g, '# tvoj kód tu');
  const [code, setCode] = useState(cleanStarter(step.starterCode || ''));
  const [hintIdx, setHintIdx] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ desc: string; passed: boolean }[] | null>(null);
  const [allPassed, setAllPassed] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ready: pyReady, loading: pyLoading, runCode, runTest } = usePyodide();
  const hints = step.hints || [];

  const handleRun = useCallback(async () => {
    if (!pyReady) return;
    setRunning(true); setError(null); setTestResults(null); setAllPassed(false);

    // Run student code
    const result = await runCode(code);
    if (!result.success) {
      setError(result.error);
      setRunning(false);
      return;
    }

    // Update preview with variables
    onVariables(result.variables);

    // Run tests
    if (step.tests) {
      const results: { desc: string; passed: boolean }[] = [];
      for (const t of step.tests) {
        const passed = await runTest(code, t.code);
        results.push({ desc: t.description, passed });
      }
      setTestResults(results);
      setAllPassed(results.every(r => r.passed));
    }

    setRunning(false);
  }, [pyReady, code, step.tests, runCode, runTest, onVariables]);

  // Reset when step changes
  useEffect(() => {
    setCode(cleanStarter(step.starterCode || ''));
    setHintIdx(-1); setShowSolution(false); setTestResults(null); setAllPassed(false); setError(null);
  }, [step.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {step.prompt && <p style={{ color: '#ccc', fontSize: 15, lineHeight: 1.6 }}>{step.prompt}</p>}

      {/* Pyodide loading indicator */}
      {pyLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#1a1a1a', borderRadius: 8, fontSize: 13, color: '#666' }}>
          <Loader2 size={14} className="spin" /> {locale === 'sk' ? 'Načítavam Python engine...' : 'Loading Python engine...'}
        </div>
      )}

      {/* Editor */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #22c55e, #3b82f6)' }} />
        <Editor
          height={Math.max(200, (code.split('\n').length + 2) * 20)}
          language="python" theme="vs-dark" value={code}
          onChange={(v) => { setCode(v || ''); setTestResults(null); setAllPassed(false); setError(null); }}
          options={{
            minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false,
            padding: { top: 16 }, renderLineHighlight: 'none', tabSize: 4, wordWrap: 'on',
            overviewRulerLanes: 0, hideCursorInOverviewRuler: true, scrollbar: { vertical: 'hidden' },
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handleRun} disabled={!pyReady || running} style={{
          padding: '12px 24px', background: pyReady && !running ? '#22c55e' : '#333',
          color: pyReady && !running ? '#000' : '#666', border: 'none', borderRadius: 10, fontSize: 14,
          fontWeight: 700, cursor: pyReady && !running ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {running ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
          {locale === 'sk' ? 'Skontrolovať kód' : 'Check Code'}
        </button>
        {hints.length > 0 && (
          <button onClick={() => setHintIdx(p => Math.min(p + 1, hints.length - 1))} style={{
            padding: '12px 24px', background: 'transparent', color: '#a0a0a0',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Lightbulb size={16} />
            {locale === 'sk' ? 'Nápoveda' : 'Hint'} {hintIdx >= 0 ? `(${hintIdx + 1}/${hints.length})` : ''}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          padding: '12px 16px', background: '#ef444410', borderRadius: 10,
          border: '1px solid #ef444430', fontSize: 13, fontFamily: 'var(--font-mono)',
          color: '#ef4444', whiteSpace: 'pre-wrap', overflow: 'auto',
        }}>{error}</motion.div>
      )}

      {/* Hints */}
      {hintIdx >= 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {hints.slice(0, hintIdx + 1).map((h, i) => (
            <div key={i} style={{ padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', fontSize: 14, color: '#bbb' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600, marginRight: 8 }}>{locale === 'sk' ? 'Nápoveda' : 'Hint'} {i + 1}:</span>
              {h.text}
              {(h as any).code && <pre style={{ marginTop: 8, padding: '8px 12px', background: '#111', borderRadius: 6, color: '#22c55e', fontSize: 13 }}>{(h as any).code}</pre>}
            </div>
          ))}
          {hintIdx >= hints.length - 1 && !showSolution && step.solution && (
            <button onClick={() => setShowSolution(true)} style={{
              padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6,
            }}><Eye size={14} /> {locale === 'sk' ? 'Zobraziť riešenie' : 'Show solution'}</button>
          )}
          {showSolution && step.solution && (
            <div style={{ padding: 16, background: '#111', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <pre style={{ color: '#22c55e', fontSize: 13, whiteSpace: 'pre-wrap' }}>{step.solution}</pre>
            </div>
          )}
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {testResults.map((r, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
              background: r.passed ? '#22c55e08' : '#ef444408', border: `1px solid ${r.passed ? '#22c55e20' : '#ef444420'}`,
            }}>
              {r.passed ? <Check size={16} color="#22c55e" /> : <X size={16} color="#ef4444" />}
              <span style={{ color: r.passed ? '#22c55e' : '#ef4444' }}>{r.desc}</span>
            </div>
          ))}
          {allPassed && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
              padding: 16, background: '#22c55e15', borderRadius: 12, border: '1px solid #22c55e40',
              display: 'flex', alignItems: 'center', gap: 12, marginTop: 8,
            }}>
              <CheckCircle2 size={24} color="#22c55e" />
              <div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 16 }}>{locale === 'sk' ? 'Výborne!' : 'Excellent!'}</div>
                <div style={{ color: '#22c55e', opacity: 0.7, fontSize: 13 }}>+{step.xp} XP</div>
              </div>
              <button onClick={onComplete} style={{
                marginLeft: 'auto', padding: '10px 24px', background: '#22c55e', color: '#000',
                border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}>{locale === 'sk' ? 'Ďalší krok' : 'Next step'}</button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════
function ProgressSidebar({ project, completedSteps, currentGlobalIdx, onSelectStep, onUnlockStep, locale }: {
  project: InteractiveProject; completedSteps: Set<string>; currentGlobalIdx: number;
  onSelectStep: (gi: number) => void; onUnlockStep: (gi: number) => void; locale: string;
}) {
  const allSteps = getAllSteps(project);
  let gi = 0;
  return (
    <div style={{ width: 220, height: '100%', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', overflowY: 'auto', flexShrink: 0 }}>
      {project.sections.map((sec, si) => {
        const start = gi;
        const items = sec.steps.map((_, sti) => ({ gIdx: gi++, step: sec.steps[sti] }));
        return (
          <div key={si} style={{ marginBottom: 4 }}>
            <div style={{ padding: '8px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555' }}>{sec.title}</div>
            {items.map(({ gIdx, step }) => {
              const done = completedSteps.has(step.id);
              const active = gIdx === currentGlobalIdx;
              const locked = gIdx > 0 && !completedSteps.has(allSteps[gIdx - 1]?.step.id) && !active && !done;
              return (
                <button key={step.id} onClick={() => locked ? onUnlockStep(gIdx) : onSelectStep(gIdx)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
                  border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
                  color: locked ? '#444' : done ? '#22c55e' : active ? '#fff' : '#888', fontSize: 13, textAlign: 'left',
                }}>
                  {done ? <CheckCircle2 size={16} color="#22c55e" /> : locked ? <Lock size={14} color="#444" /> : <StepIcon type={step.type} size={14} />}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.title}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { completeLesson, completedLessons } = useUserStore();
  const { locale } = useLocaleStore();

  // Hide main nav on project page — project has its own sidebar
  useEffect(() => {
    document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => (el as HTMLElement).style.display = 'none');
    return () => {
      document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => (el as HTMLElement).style.display = '');
    };
  }, []);

  const project = getProject(id as string);
  const allSteps = project ? getAllSteps(project) : [];

  // Track completedLessons length to detect rehydration
  const completedCount2 = completedLessons.length;

  const completedSteps = useMemo(() => {
    const set = new Set<string>();
    if (!project) return set;
    allSteps.forEach(({ step }) => { if (completedLessons.includes(compKey(project.id, step.id))) set.add(step.id); });
    return set;
  }, [project, completedCount2]);

  const [currentGlobalIdx, setCurrentGlobalIdx] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewVars, setPreviewVars] = useState<Record<string, any>>({});
  const [unlockConfirm, setUnlockConfirm] = useState<number | null>(null);
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollTo({ top: 0 });
  }, [currentGlobalIdx]);

  // Restore position after rehydration — jump to first incomplete step
  useEffect(() => {
    const fi = allSteps.findIndex(({ step }) => !completedSteps.has(step.id));
    setCurrentGlobalIdx(fi >= 0 ? fi : allSteps.length - 1);
  }, [completedSteps.size]);

  if (!project) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: '#666' }}>Projekt nebol nájdený.</p>
      <Link href="/topics" style={{ color: '#22c55e' }}>Späť</Link>
    </div>
  );

  const currentStep = allSteps[currentGlobalIdx]?.step;
  const totalSteps = allSteps.length;
  const completedCount = completedSteps.size;
  const progress = totalSteps > 0 ? completedCount / totalSteps : 0;
  const isComplete = completedCount === totalSteps;

  const handleStepComplete = () => {
    if (!currentStep) return;
    const key = compKey(project.id, currentStep.id);
    if (!completedLessons.includes(key)) { completeLesson(key, currentStep.xp || 0); }
    if (currentGlobalIdx < totalSteps - 1) setCurrentGlobalIdx(currentGlobalIdx + 1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#0F0F0F', position: 'fixed', inset: 0 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button onClick={() => router.push('/topics')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</div>
          <div style={{ fontSize: 12, color: '#555' }}>{completedCount}/{totalSteps} {locale === 'sk' ? 'krokov' : 'steps'}</div>
        </div>
        <div style={{ width: 120, height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: '#22c55e', borderRadius: 3, transition: 'width 0.5s' }} />
        </div>
        {/* Download */}
        <button onClick={() => downloadCode(`${project.id}.py`, project.finalCode)} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          color: '#888', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12,
        }}>
          <Download size={14} /> .py
        </button>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-only-btn" style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#888', padding: '6px 10px', cursor: 'pointer', fontSize: 12,
        }}>{locale === 'sk' ? 'Kroky' : 'Steps'}</button>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Sidebar */}
        <div className="project-sidebar" style={{ display: sidebarOpen ? 'block' : undefined }}>
          <ProgressSidebar project={project} completedSteps={completedSteps} currentGlobalIdx={currentGlobalIdx}
            onSelectStep={(gi) => { setCurrentGlobalIdx(gi); setSidebarOpen(false); }}
            onUnlockStep={(gi) => setUnlockConfirm(gi)}
            locale={locale} />
        </div>

        {/* Main content */}
        <div ref={contentRef} style={{ flex: 1, overflow: 'auto', padding: '24px 20px 120px', minWidth: 0 }}>
          <div style={{ maxWidth: 720 }}>
            {currentStep && !isComplete && (
              <AnimatePresence mode="wait">
                <motion.div key={currentStep.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: currentStep.type === 'theory' ? '#3b82f620' : currentStep.type === 'quiz' ? '#f59e0b20' : '#22c55e20',
                      color: currentStep.type === 'theory' ? '#3b82f6' : currentStep.type === 'quiz' ? '#f59e0b' : '#22c55e',
                    }}><StepIcon type={currentStep.type} size={18} /></div>
                    <div>
                      <div style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {stepLabel[currentStep.type]?.[locale] || currentStep.type} · +{currentStep.xp} XP
                      </div>
                      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{currentStep.title}</h2>
                    </div>
                  </div>
                  {currentStep.type === 'theory' && <TheoryView step={currentStep} onComplete={handleStepComplete} locale={locale} />}
                  {currentStep.type === 'quiz' && <QuizView step={currentStep} onComplete={handleStepComplete} locale={locale} />}
                  {currentStep.type === 'fill' && <FillCodeView step={currentStep} onComplete={handleStepComplete} locale={locale} />}
                  {currentStep.type === 'write' && <WriteCodeView step={currentStep} onComplete={handleStepComplete} locale={locale} onVariables={setPreviewVars} />}
                </motion.div>
              </AnimatePresence>
            )}
            {isComplete && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 40 }}>
                <Trophy size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                  {locale === 'sk' ? 'Projekt dokončený!' : 'Project Complete!'}
                </h2>
                <p style={{ color: '#888', marginBottom: 24 }}>{project.title}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => downloadCode(`${project.id}.py`, project.finalCode)} style={{
                    padding: '14px 28px', background: '#22c55e', color: '#000', border: 'none',
                    borderRadius: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  }}><Download size={16} /> {locale === 'sk' ? 'Stiahnuť kód' : 'Download Code'}</button>
                  <Link href="/topics" style={{
                    padding: '14px 28px', background: '#1a1a1a', color: '#ccc', borderRadius: 12,
                    fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  }}>{locale === 'sk' ? 'Späť na projekty' : 'Back to Projects'}</Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Preview panel — desktop only */}
        <div className="project-preview">
          <div style={{
            width: 320, minHeight: '100%', borderLeft: '1px solid rgba(255,255,255,0.06)',
            background: '#0a0a0a', overflowY: 'auto',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {locale === 'sk' ? 'Náhľad aplikácie' : 'App Preview'}
            </div>
            <PreviewPanel projectId={project.id} variables={previewVars} />
          </div>
        </div>
      </div>

      {/* Unlock confirmation dialog */}
      {unlockConfirm !== null && (
        <div className="unlock-overlay" onClick={() => setUnlockConfirm(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            style={{ background: '#1a1a1a', borderRadius: 16, padding: 24, maxWidth: 340, width: '90%', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              {locale === 'sk' ? 'Odomknúť krok?' : 'Unlock step?'}
            </h3>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
              {locale === 'sk' ? 'Preskočíš predchádzajúce kroky. Najviac sa naučíš keď ich prejdeš postupne.' : 'You will skip previous steps. You learn the most by going through them in order.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setUnlockConfirm(null)} style={{
                flex: 1, padding: '12px', borderRadius: 10, background: '#222', color: '#aaa',
                border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13,
              }}>{locale === 'sk' ? 'Zostať tu' : 'Stay here'}</button>
              <button onClick={() => {
                // Mark all previous steps as completed
                if (project) {
                  for (let i = 0; i < unlockConfirm; i++) {
                    const key = compKey(project.id, allSteps[i].step.id);
                    if (!completedLessons.includes(key)) completeLesson(key, 0);
                  }
                }
                setCurrentGlobalIdx(unlockConfirm);
                setUnlockConfirm(null);
              }} style={{
                flex: 1, padding: '12px', borderRadius: 10, background: '#22c55e', color: '#000',
                border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 13,
              }}>{locale === 'sk' ? 'Odomknúť' : 'Unlock'}</button>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        .project-sidebar { display: none; }
        .project-preview { display: none; }
        .mobile-only-btn { display: block; }
        @media (min-width: 900px) {
          .project-sidebar { display: block !important; }
          .mobile-only-btn { display: none !important; }
        }
        @media (min-width: 1200px) {
          .project-preview { display: block !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .unlock-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 400; display: flex; align-items: center; justify-content: center; }
        .spin { animation: spin 1s linear infinite; }
        .theory-content p { margin: 0 0 8px; }
        .theory-content h1 { font-size: 22px; font-weight: 700; color: #fff; margin: 20px 0 8px; }
        .theory-content h1:first-child { margin-top: 0; }
        .theory-content h2 { font-size: 18px; font-weight: 600; color: #eee; margin: 16px 0 6px; }
        .theory-content h3 { font-size: 16px; font-weight: 600; color: #ddd; margin: 14px 0 4px; }
        .theory-content ul { padding-left: 20px; margin: 4px 0 8px; }
        .theory-content li { margin: 2px 0; color: #bbb; }
        .theory-content strong { color: #fff; }
        .theory-content .code-block { background: #1a1a1a; border-radius: 10px; padding: 16px 20px; margin: 8px 0; overflow-x: auto; border: 1px solid rgba(255,255,255,0.06); }
        .theory-content .code-block code { color: #22c55e; font-family: var(--font-mono); font-size: 13px; white-space: pre; }
        .theory-content .inline-code { background: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 13px; color: #22c55e; }
        .theory-content .md-table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        .theory-content .md-table th { padding: 8px 12px; text-align: left; font-weight: 600; color: #fff; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); font-size: 13px; }
        .theory-content .md-table td { padding: 8px 12px; color: #bbb; border: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
        .theory-content .md-table .inline-code { font-size: 12px; }
      `}</style>
    </div>
  );
}
