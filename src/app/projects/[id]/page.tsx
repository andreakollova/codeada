'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { useUserStore } from '@/store/userStore';
import { projects, ProjectLesson, ProjectStep } from '@/data/projects';
import Editor from '@monaco-editor/react';
import {
  Play, RotateCcw, ChevronRight, ChevronLeft, Check, X, Lightbulb,
  Eye, Code2, BookOpen, Sparkles, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

// Phone preview frame
function PhonePreview({ html, highlight }: { html: string; highlight: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
      <div style={{
        width: 280, height: 560, borderRadius: 36, overflow: 'hidden',
        border: '3px solid #333', background: '#000', position: 'relative',
        boxShadow: highlight ? '0 0 30px rgba(74, 222, 128, 0.3)' : 'none',
        transition: 'box-shadow 0.5s',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 120, height: 28, background: '#000', borderRadius: '0 0 16px 16px', zIndex: 10 }} />
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

// Terminal preview
function TerminalPreview({ output }: { output: string }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: '#111', borderRadius: 12, border: '1px solid #222', overflow: 'hidden' }}>
        <div style={{ padding: '8px 14px', background: '#1a1a1a', display: 'flex', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, background: '#28c840' }} />
        </div>
        <pre style={{ padding: 16, margin: 0, fontSize: 13, color: '#4ade80', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {output || '$ waiting for code...'}
        </pre>
      </div>
    </div>
  );
}

// Database preview
function DatabasePreview({ data }: { data: any[] }) {
  if (!data.length) return <TerminalPreview output="No data yet. Write a query to see results." />;
  const keys = Object.keys(data[0]);
  return (
    <div style={{ padding: 20, overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
        <thead>
          <tr>{keys.map(k => <th key={k} style={{ padding: '8px 12px', borderBottom: '1px solid #333', color: '#888', textAlign: 'left', fontWeight: 600 }}>{k}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>{keys.map(k => <td key={k} style={{ padding: '8px 12px', borderBottom: '1px solid #1a1a1a', color: '#ccc' }}>{String(row[k])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Generate preview HTML from React Native code
function generatePreview(code: string, step: ProjectStep): string {
  if (step.previewType === 'react-native') {
    // Parse the code to generate a visual preview
    const hasTitle = code.includes('<Text') && code.includes('style');
    const hasInput = code.includes('<TextInput');
    const hasPassword = code.includes('secureTextEntry');
    const hasButton = code.includes('TouchableOpacity');
    const titleMatch = code.match(/<Text[^>]*>([^<]*)<\/Text>/);
    const titleText = titleMatch?.[1] || '';

    return `<div style="display:flex;flex-direction:column;justify-content:center;height:100%;background:#0A0A0A;padding:24px;font-family:-apple-system,sans-serif;">
      ${hasTitle ? `<div style="font-size:28px;font-weight:700;color:#fff;margin-bottom:28px;animation:fadeIn 0.3s">${titleText}</div>` : ''}
      ${hasInput ? `<div style="background:#1a1a1a;border-radius:12px;padding:14px;margin-bottom:10px;color:#666;font-size:14px;border:1px solid #333;animation:slideIn 0.4s">Email</div>` : ''}
      ${hasPassword ? `<div style="background:#1a1a1a;border-radius:12px;padding:14px;margin-bottom:10px;color:#666;font-size:14px;border:1px solid #333;animation:slideIn 0.5s">••••••••</div>` : ''}
      ${hasButton ? `<div style="background:#fff;border-radius:12px;padding:14px;text-align:center;font-size:15px;font-weight:700;color:#000;margin-top:6px;animation:slideIn 0.6s;cursor:pointer">Sign In</div>` : ''}
      <style>
        @keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
      </style>
    </div>`;
  }
  return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#555;font-size:14px">Preview</div>';
}

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { addXp } = useUserStore();

  // Find project and first lesson
  const topic = projects.find(p => p.lessons.some(l => l.id === id));
  const lesson = topic?.lessons.find(l => l.id === id);

  const [stepIndex, setStepIndex] = useState(0);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [previewHighlight, setPreviewHighlight] = useState(false);

  const step = lesson?.steps[stepIndex];

  useEffect(() => {
    if (step) setCode(step.starterCode);
    setFeedback('idle');
    setShowHint(false);
  }, [stepIndex, step?.id]);

  const handleRun = useCallback(() => {
    if (!step) return;
    try {
      const isCorrect = new Function('code', `return ${step.testFn}`)(code);
      if (isCorrect) {
        setFeedback('correct');
        setCompletedSteps(prev => new Set([...prev, stepIndex]));
        setPreviewHighlight(true);
        addXp(10);
        setTimeout(() => setPreviewHighlight(false), 2000);
      } else {
        setFeedback('wrong');
      }
    } catch {
      setFeedback('wrong');
    }
  }, [code, step, stepIndex, addXp]);

  const handleNext = () => {
    if (lesson && stepIndex < lesson.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleReset = () => {
    if (step) setCode(step.starterCode);
    setFeedback('idle');
  };

  if (!lesson || !step || !topic) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
        Lesson not found
      </div>
    );
  }

  const progress = ((completedSteps.size) / lesson.steps.length) * 100;
  const previewHtml = generatePreview(feedback === 'correct' ? code : (stepIndex > 0 ? lesson.steps[stepIndex - 1]?.solution || '' : ''), step);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      {/* Top bar */}
      <div style={{
        height: 48, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(10px)',
      }}>
        <Link href="/topics" style={{ display: 'flex', alignItems: 'center', color: '#555' }}>
          <ArrowLeft size={18} />
        </Link>
        <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{topic.icon} {locale === 'sk' ? topic.titleSk : topic.title}</span>
        <span style={{ color: '#333' }}>·</span>
        <span style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>{locale === 'sk' ? lesson.titleSk : lesson.title}</span>
        <div style={{ flex: 1 }} />
        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 200 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#4ade80', borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{completedSteps.size}/{lesson.steps.length}</span>
        </div>
      </div>

      {/* 3-panel workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT: Lesson guide */}
        <div style={{ width: '28%', borderRight: '1px solid #1a1a1a', overflow: 'auto', padding: 24 }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {lesson.steps.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: completedSteps.has(i) ? '#4ade80' : i === stepIndex ? '#fff' : '#222',
                cursor: 'pointer',
              }} onClick={() => setStepIndex(i)} />
            ))}
          </div>

          {/* Step title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: completedSteps.has(stepIndex) ? '#4ade80' : '#222',
              fontSize: 12, fontWeight: 700, color: completedSteps.has(stepIndex) ? '#000' : '#888',
            }}>
              {completedSteps.has(stepIndex) ? <Check size={14} /> : stepIndex + 1}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
              {locale === 'sk' ? step.titleSk : step.title}
            </h2>
          </div>

          {/* Explanation */}
          <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.7, marginBottom: 20 }}>
            {locale === 'sk' ? step.explanationSk : step.explanation}
          </p>

          {/* Goal */}
          <div style={{ background: '#111', borderRadius: 10, padding: 14, marginBottom: 16, border: '1px solid #1a1a1a' }}>
            <div style={{ fontSize: 11, color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
              {locale === 'sk' ? 'Cieľ' : 'Goal'}
            </div>
            <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.5 }}>
              {locale === 'sk' ? lesson.goalSk : lesson.goal}
            </p>
          </div>

          {/* Hint */}
          {(step.hint || step.hintSk) && (
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12 }}
            >
              <Lightbulb size={14} />
              {showHint ? (locale === 'sk' ? step.hintSk : step.hint) : (locale === 'sk' ? 'Ukáž hint' : 'Show hint')}
            </button>
          )}

          {/* Feedback */}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Check size={16} color="#4ade80" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>
                    {locale === 'sk' ? 'Správne!' : 'Correct!'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#86efac', margin: 0 }}>
                  {locale === 'sk' ? 'Výborne! Preview sa aktualizoval.' : 'Great job! Preview has been updated.'}
                </p>
                {stepIndex < lesson.steps.length - 1 && (
                  <button onClick={handleNext} style={{
                    marginTop: 10, padding: '8px 16px', borderRadius: 8, background: '#4ade80', color: '#000',
                    fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {locale === 'sk' ? 'Ďalší krok' : 'Next step'} <ChevronRight size={14} />
                  </button>
                )}
                {stepIndex === lesson.steps.length - 1 && (
                  <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: '#4ade80' }}>
                    🎉 {locale === 'sk' ? 'Lekcia dokončená!' : 'Lesson complete!'}
                  </div>
                )}
              </motion.div>
            )}
            {feedback === 'wrong' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <X size={16} color="#ef4444" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>
                    {locale === 'sk' ? 'Skús znova' : 'Not quite'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: '#fca5a5', margin: 0 }}>
                  {locale === 'sk' ? 'Skontroluj kód a skús to znova. Použi hint ak potrebuješ pomoc.' : 'Check your code and try again. Use the hint if you need help.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CENTER: Code editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #1a1a1a' }}>
          {/* Editor toolbar */}
          <div style={{ height: 40, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <Code2 size={14} color="#888" />
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>
              {lesson.language === 'typescript' ? 'TypeScript' : 'Python'}
            </span>
            <div style={{ flex: 1 }} />
            <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: '#1a1a1a', border: '1px solid #333', cursor: 'pointer', color: '#888', fontSize: 11, fontWeight: 600 }}>
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={handleRun} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 14px', borderRadius: 6, background: '#4ade80', border: 'none', cursor: 'pointer', color: '#000', fontSize: 11, fontWeight: 700 }}>
              <Play size={12} fill="#000" /> Run
            </button>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={lesson.language === 'typescript' ? 'typescript' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(v) => { setCode(v || ''); setFeedback('idle'); }}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 12 },
                renderLineHighlight: 'line',
                bracketPairColorization: { enabled: true },
                tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* RIGHT: Live preview */}
        <div style={{ width: '30%', overflow: 'auto', background: '#050505' }}>
          <div style={{ height: 40, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
            <Eye size={14} color="#888" />
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>Live Preview</span>
          </div>

          {step.previewType === 'react-native' && (
            <PhonePreview html={previewHtml} highlight={previewHighlight} />
          )}
          {step.previewType === 'terminal' && (
            <TerminalPreview output="" />
          )}
          {step.previewType === 'database' && (
            <DatabasePreview data={feedback === 'correct' ? [
              { id: 1, name: 'Alice', email: 'alice@example.com' },
              { id: 2, name: 'Bob', email: 'bob@example.com' },
            ] : []} />
          )}
          {!['react-native', 'terminal', 'database'].includes(step.previewType) && (
            <TerminalPreview output="Preview will appear here after running code." />
          )}
        </div>
      </div>
    </div>
  );
}
