'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { useUserStore } from '@/store/userStore';
import { getProjectLesson, ProjectStep } from '@/data/projects';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });
import {
  Play, RotateCcw, ChevronRight, Check, X, Lightbulb, Eye, Code2, ArrowLeft, Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// === PHONE PREVIEW ===
function PhonePreview({ elements, highlight }: { elements: string[]; highlight: string | null }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: 290, minHeight: 580, borderRadius: 40, overflow: 'hidden',
        border: '3px solid #333', background: '#000', position: 'relative',
        boxShadow: highlight ? '0 0 40px rgba(74, 222, 128, 0.2)' : 'none',
        transition: 'box-shadow 0.6s',
      }}>
        {/* Notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 26, background: '#000', borderRadius: '0 0 14px 14px', zIndex: 10 }} />
        {/* Screen content */}
        <div style={{ padding: '60px 20px 30px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {elements.map((el, i) => {
            const isNew = el === highlight;
            return (
              <motion.div
                key={`${el}-${i}`}
                initial={isNew ? { opacity: 0, x: -20 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: isNew ? 0.1 : 0 }}
                style={isNew ? { borderRadius: 8, boxShadow: '0 0 20px rgba(74, 222, 128, 0.15)' } : {}}
              >
                {renderPreviewElement(el, isNew)}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderPreviewElement(el: string, isNew: boolean) {
  const glow = isNew ? { outline: '2px solid rgba(74, 222, 128, 0.4)', outlineOffset: 2 } : {};
  switch (el) {
    case 'title':
      return <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 16, ...glow, borderRadius: 4, padding: 2 }}>Welcome Back 👋</div>;
    case 'input-empty':
      return <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 13, color: '#444', fontSize: 13, border: '1px solid #333', ...glow }}>...</div>;
    case 'input-email':
      return <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 13, color: '#666', fontSize: 13, border: '1px solid #333', ...glow }}>Email</div>;
    case 'input-password':
      return <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 13, color: '#666', fontSize: 13, border: '1px solid #333', ...glow }}>Password</div>;
    case 'button-login':
      return <div style={{ background: '#fff', borderRadius: 10, padding: 13, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#000', marginTop: 4, ...glow }}>Login</div>;
    case 'forgot-password':
      return <div style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 6, ...glow, borderRadius: 4, padding: 2 }}>Forgot Password?</div>;
    case 'button-google':
      return <div style={{ background: '#1a1a1a', borderRadius: 10, padding: 13, textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#ccc', border: '1px solid #333', marginTop: 4, ...glow }}>Continue with Google</div>;
    default:
      return null;
  }
}

// === MAIN WORKSPACE ===
export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const { addXp } = useUserStore();

  // Hide nav on workspace — fullscreen experience
  useEffect(() => {
    document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    // Also remove the margin/padding the nav adds
    const dashboard = document.querySelector('.dashboard') as HTMLElement;
    if (dashboard) dashboard.style.marginLeft = '0';
    return () => {
      document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      if (dashboard) dashboard.style.marginLeft = '';
    };
  }, []);

  const found = getProjectLesson(id);
  const topic = found?.topic;
  const lesson = found?.lesson;

  const [stepIndex, setStepIndex] = useState(-1); // -1 = intro
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [hintLevel, setHintLevel] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [lastHighlight, setLastHighlight] = useState<string | null>(null);

  const step = lesson && stepIndex >= 0 ? lesson.steps[stepIndex] : null;

  // Build preview elements from completed steps
  const previewElements: string[] = [];
  if (lesson) {
    for (let i = 0; i < lesson.steps.length; i++) {
      if (completedSteps.has(i) && lesson.steps[i].previewAddition) {
        previewElements.push(lesson.steps[i].previewAddition);
      }
    }
  }

  useEffect(() => {
    if (step) {
      setCode(step.starterCode);
      setFeedback('idle');
      setHintLevel(0);
    }
  }, [stepIndex]);

  const handleRun = useCallback(() => {
    if (!step) return;
    try {
      const isCorrect = new Function('code', `return ${step.validateFn}`)(code);
      if (isCorrect) {
        setFeedback('correct');
        setCompletedSteps(prev => new Set([...prev, stepIndex]));
        if (step.previewAddition) setLastHighlight(step.previewAddition);
        addXp(10);
        setTimeout(() => setLastHighlight(null), 2500);
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
    setHintLevel(0);
  };

  const showHint = () => {
    const hints = locale === 'sk' ? step?.errorHintsSk : step?.errorHints;
    if (hints && hintLevel < hints.length) setHintLevel(hintLevel + 1);
  };

  if (!lesson || !topic) {
    return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Lesson not found</div>;
  }

  const progress = lesson.steps.length > 0 ? (completedSteps.size / lesson.steps.length) * 100 : 0;
  const isComplete = completedSteps.size === lesson.steps.length;

  // === INTRO SCREEN ===
  if (stepIndex === -1) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', justifyContent: 'center' }}>
        {/* Left: intro text */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px 60px', maxWidth: 580, overflow: 'auto', marginLeft: 'auto' }}>
          <Link href="/" style={{ color: '#888', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft size={18} /> {locale === 'sk' ? 'Späť na kurzy' : 'Back to courses'}
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{lesson.icon}</span>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {locale === 'sk' ? topic.titleSk : topic.title}
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {locale === 'sk' ? lesson.titleSk : lesson.title}
          </h1>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: '#888', background: '#111', padding: '4px 10px', borderRadius: 6 }}>⏱ {lesson.duration}</span>
            <span style={{ fontSize: 12, color: '#888', background: '#111', padding: '4px 10px', borderRadius: 6 }}>🟢 {locale === 'sk' ? lesson.levelSk : lesson.level}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 8 }}>🎯 {locale === 'sk' ? 'Cieľ' : 'Goal'}</h3>
            <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.7 }}>{locale === 'sk' ? lesson.goalSk : lesson.goal}</p>
          </div>

          <div style={{ background: '#111', borderRadius: 12, padding: 16, marginBottom: 32, border: '1px solid #1a1a1a' }}>
            <p style={{ fontSize: 13, color: '#888', lineHeight: 1.8, margin: 0 }}>{locale === 'sk' ? lesson.preIntroSk : lesson.preIntro}</p>
          </div>

          <motion.button
            onClick={() => setStepIndex(0)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ padding: '16px 32px', borderRadius: 12, background: '#fff', color: '#000', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            {locale === 'sk' ? 'Začať programovať' : 'Start coding'} →
          </motion.button>
        </div>

        {/* Right: final preview */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', marginRight: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#555', marginBottom: 16, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {locale === 'sk' ? 'Čo dnes vytvoríš' : 'What you\'ll build today'}
            </p>
            <PhonePreview
              elements={['title', 'input-email', 'input-password', 'button-login', 'forgot-password', 'button-google']}
              highlight={null}
            />
          </div>
        </div>
      </div>
    );
  }

  // === WORKSPACE ===
  const hints = locale === 'sk' ? step?.errorHintsSk : step?.errorHints;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0A0A0A' }}>
      {/* Top bar */}
      <div style={{ height: 44, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
        <Link href="/topics" style={{ display: 'flex', alignItems: 'center', color: '#555' }}><ArrowLeft size={16} /></Link>
        <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>{topic.icon} {locale === 'sk' ? lesson.titleSk : lesson.title}</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: 180 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#4ade80', borderRadius: 2 }} />
          </div>
          <span style={{ fontSize: 10, color: '#555', fontWeight: 600 }}>{completedSteps.size}/{lesson.steps.length}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* LEFT: Guide */}
        <div style={{ width: '26%', borderRight: '1px solid #1a1a1a', overflow: 'auto', padding: '20px 20px' }}>
          {/* Step dots */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
            {lesson.steps.map((_, i) => (
              <div key={i} onClick={() => completedSteps.has(i) || i <= stepIndex ? setStepIndex(i) : null} style={{
                flex: 1, height: 3, borderRadius: 2, cursor: completedSteps.has(i) ? 'pointer' : 'default',
                background: completedSteps.has(i) ? '#4ade80' : i === stepIndex ? '#fff' : '#222',
              }} />
            ))}
          </div>

          {/* Step number + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: completedSteps.has(stepIndex) ? '#4ade80' : '#222',
              fontSize: 11, fontWeight: 700, color: completedSteps.has(stepIndex) ? '#000' : '#888',
            }}>
              {completedSteps.has(stepIndex) ? <Check size={12} /> : stepIndex + 1}
            </div>
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>
              {locale === 'sk' ? 'Krok' : 'Step'} {stepIndex + 1} / {lesson.steps.length}
            </span>
          </div>

          {step && (
            <>
              {/* Instruction */}
              <p style={{ fontSize: 15, color: '#eee', lineHeight: 1.6, marginBottom: 12, fontWeight: 500 }}>
                {locale === 'sk' ? step.instructionSk : step.instruction}
              </p>

              {/* Context (if any) */}
              {(step.context || step.contextSk) && (
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>
                  {locale === 'sk' ? step.contextSk : step.context}
                </p>
              )}

              {/* Hints (progressive) */}
              {feedback === 'wrong' && hints && (
                <div style={{ marginBottom: 16 }}>
                  {Array.from({ length: hintLevel }, (_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ background: '#1a1200', border: '1px solid #422006', borderRadius: 8, padding: 10, marginBottom: 6 }}>
                      <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, marginBottom: 3 }}>💡 Hint {i + 1}</div>
                      <pre style={{ fontSize: 12, color: '#fbbf24', margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace' }}>
                        {hints[i]}
                      </pre>
                    </motion.div>
                  ))}
                  {hintLevel < hints.length && (
                    <button onClick={showHint} style={{ fontSize: 11, color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Lightbulb size={12} /> {locale === 'sk' ? 'Ďalší hint' : 'Next hint'}
                    </button>
                  )}
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Check size={14} color="#4ade80" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>✓</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#86efac', margin: 0, lineHeight: 1.6 }}>
                      {locale === 'sk' ? step.successMsgSk : step.successMsg}
                    </p>
                    {stepIndex < lesson.steps.length - 1 && (
                      <button onClick={handleNext} style={{
                        marginTop: 10, padding: '8px 14px', borderRadius: 8, background: '#4ade80', color: '#000',
                        fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        {locale === 'sk' ? 'Ďalší krok' : 'Next step'} <ChevronRight size={12} />
                      </button>
                    )}
                  </motion.div>
                )}
                {feedback === 'wrong' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <X size={14} color="#ef4444" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>
                        {locale === 'sk' ? 'Ešte nie. Skús znova.' : 'Not yet. Try again.'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: '#fca5a5', margin: 0 }}>
                      {locale === 'sk' ? 'Použi hint ak potrebuješ pomoc.' : 'Use a hint if you need help.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Completion */}
              {isComplete && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#4ade80', marginBottom: 8 }}>
                    {locale === 'sk' ? 'Lekcia dokončená!' : 'Lesson complete!'}
                  </h3>
                  <p style={{ fontSize: 12, color: '#86efac', lineHeight: 1.6 }}>
                    {locale === 'sk' ? step.successMsgSk : step.successMsg}
                  </p>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* CENTER: Editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #1a1a1a' }}>
          <div style={{ height: 36, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <Code2 size={12} color="#888" />
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>LoginScreen.tsx</span>
            <div style={{ flex: 1 }} />
            <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 5, background: '#1a1a1a', border: '1px solid #222', cursor: 'pointer', color: '#666', fontSize: 10, fontWeight: 600 }}>
              <RotateCcw size={10} /> Reset
            </button>
            <button onClick={handleRun} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 12px', borderRadius: 5, background: '#4ade80', border: 'none', cursor: 'pointer', color: '#000', fontSize: 10, fontWeight: 700 }}>
              <Play size={10} fill="#000" /> Run
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language="typescript"
              theme="vs-dark"
              value={code}
              onChange={(v) => { setCode(v || ''); setFeedback('idle'); setHintLevel(0); }}
              options={{
                fontSize: 14, fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false,
                wordWrap: 'on', padding: { top: 12 }, renderLineHighlight: 'line',
                bracketPairColorization: { enabled: true }, tabSize: 2,
              }}
            />
          </div>
        </div>

        {/* RIGHT: Preview */}
        <div style={{ width: '30%', overflow: 'auto', background: '#050505' }}>
          <div style={{ height: 36, borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
            <Eye size={12} color="#888" />
            <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>Live Preview</span>
          </div>
          <PhonePreview elements={previewElements} highlight={lastHighlight} />
        </div>
      </div>
    </div>
  );
}
