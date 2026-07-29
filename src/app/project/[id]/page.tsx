'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getProject } from '@/data/projects';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft, ChevronRight, ChevronDown, Check, X, BookOpen, HelpCircle,
  Code2, PenTool, Lightbulb, Eye, EyeOff, Download, Lock, Zap, Trophy,
  CheckCircle2, Circle, Play,
} from 'lucide-react';
import type { InteractiveProject, ProjectStep, ProjectSection, ProjectQuizOption } from '@/types';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ─── Helpers ───
function getAllSteps(project: InteractiveProject): { step: ProjectStep; sectionIdx: number; stepIdx: number; globalIdx: number }[] {
  const all: { step: ProjectStep; sectionIdx: number; stepIdx: number; globalIdx: number }[] = [];
  let gi = 0;
  project.sections.forEach((sec, si) => {
    sec.steps.forEach((step, sti) => {
      all.push({ step, sectionIdx: si, stepIdx: sti, globalIdx: gi++ });
    });
  });
  return all;
}

function getCompletedKey(projectId: string, stepId: string) {
  return `project-${projectId}-${stepId}`;
}

// ─── Step type icon ───
function StepIcon({ type, size = 16 }: { type: string; size?: number }) {
  switch (type) {
    case 'theory': return <BookOpen size={size} />;
    case 'quiz': return <HelpCircle size={size} />;
    case 'fill': return <Code2 size={size} />;
    case 'write': return <PenTool size={size} />;
    default: return <Circle size={size} />;
  }
}

// ─── Theory Step ───
function TheoryView({ step, onComplete }: { step: ProjectStep; onComplete: () => void }) {
  // Simple markdown-ish rendering
  const rendered = useMemo(() => {
    if (!step.theoryContent) return '';
    return step.theoryContent
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(Boolean).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return '';
        return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      });
  }, [step.theoryContent]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        className="theory-content"
        dangerouslySetInnerHTML={{ __html: rendered }}
        style={{ fontSize: 15, lineHeight: 1.8, color: '#ccc' }}
      />
      <button onClick={onComplete} style={{
        padding: '14px 32px', background: '#22c55e', color: '#000', border: 'none',
        borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start',
      }}>
        Pokračovať
      </button>
    </div>
  );
}

// ─── Quiz Step ───
function QuizView({ step, onComplete }: { step: ProjectStep; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleCheck = () => {
    if (selected === null || !step.quizOptions) return;
    if (step.quizOptions[selected].correct) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{step.quizQuestion}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {step.quizOptions?.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = result === 'correct' && isSelected;
          const isWrong = result === 'wrong' && isSelected;
          const isAnswer = result && opt.correct;
          return (
            <button key={i} onClick={() => { if (!result) setSelected(i); }} style={{
              padding: '14px 18px', borderRadius: 12, border: '1px solid',
              borderColor: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : isAnswer ? '#22c55e40' : isSelected ? '#fff' : 'rgba(255,255,255,0.1)',
              background: isCorrect ? '#22c55e15' : isWrong ? '#ef444415' : isAnswer ? '#22c55e08' : isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
              color: '#ddd', textAlign: 'left', cursor: result ? 'default' : 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              {isCorrect ? <Check size={18} color="#22c55e" /> : isWrong ? <X size={18} color="#ef4444" /> : isAnswer ? <Check size={18} color="#22c55e" style={{ opacity: 0.5 }} /> : <Circle size={18} style={{ opacity: 0.3 }} />}
              {opt.text}
            </button>
          );
        })}
      </div>
      {!result && (
        <button onClick={handleCheck} disabled={selected === null} style={{
          padding: '14px 32px', background: selected !== null ? '#22c55e' : '#333', color: selected !== null ? '#000' : '#666',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: selected !== null ? 'pointer' : 'default', alignSelf: 'flex-start',
        }}>
          Skontrolovať
        </button>
      )}
      {result === 'correct' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#22c55e15', borderRadius: 12, border: '1px solid #22c55e40', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Check size={20} color="#22c55e" />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>Správne! +{step.xp} XP</span>
          <button onClick={onComplete} style={{
            marginLeft: 'auto', padding: '8px 20px', background: '#22c55e', color: '#000',
            border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}>Ďalej</button>
        </motion.div>
      )}
      {result === 'wrong' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#ef444415', borderRadius: 12, border: '1px solid #ef444440',
        }}>
          <span style={{ color: '#ef4444', fontWeight: 600 }}>Skús to znova</span>
          <button onClick={() => { setResult(null); setSelected(null); }} style={{
            marginLeft: 12, padding: '6px 16px', background: 'transparent', color: '#ef4444',
            border: '1px solid #ef444440', borderRadius: 8, cursor: 'pointer', fontSize: 13,
          }}>Skúsiť znova</button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Fill Code Step ───
function FillCodeView({ step, onComplete }: { step: ProjectStep; onComplete: () => void }) {
  const blanks = step.fillBlanks || [];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  const handleCheck = () => {
    const allCorrect = blanks.every(b => {
      const ans = (answers[b.id] || '').trim();
      if (ans === b.answer) return true;
      return b.alternatives?.includes(ans) ?? false;
    });
    setResult(allCorrect ? 'correct' : 'wrong');
  };

  // Render code with blanks as inputs
  const codeLines = (step.fillCode || '').split('\n');
  let blankIdx = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {step.prompt && <p style={{ color: '#ccc', fontSize: 15 }}>{step.prompt}</p>}
      <div style={{
        background: '#1a1a1a', borderRadius: 12, padding: '20px 24px', fontFamily: 'var(--font-mono)',
        fontSize: 14, lineHeight: 2.2, border: '1px solid rgba(255,255,255,0.08)', overflow: 'auto',
      }}>
        {codeLines.map((line, li) => {
          const parts = line.split('___');
          if (parts.length === 1) {
            return <div key={li} style={{ color: '#a0a0a0' }}>{line || '\u00A0'}</div>;
          }
          const currentBlank = blanks[blankIdx];
          blankIdx++;
          return (
            <div key={li} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <span style={{ color: '#a0a0a0' }}>{parts[0]}</span>
              <input
                value={answers[currentBlank?.id || ''] || ''}
                onChange={e => setAnswers(prev => ({ ...prev, [currentBlank?.id || '']: e.target.value }))}
                placeholder="..."
                disabled={result === 'correct'}
                style={{
                  background: result === 'correct' ? '#22c55e20' : '#0a0a0a',
                  border: '1px solid',
                  borderColor: result === 'correct' ? '#22c55e' : result === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.15)',
                  borderRadius: 6, padding: '4px 10px', color: '#fff', fontFamily: 'inherit',
                  fontSize: 14, minWidth: 80, maxWidth: 200, outline: 'none',
                }}
              />
              <span style={{ color: '#a0a0a0' }}>{parts[1]}</span>
            </div>
          );
        })}
      </div>
      {!result && (
        <button onClick={handleCheck} style={{
          padding: '14px 32px', background: '#22c55e', color: '#000', border: 'none',
          borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start',
        }}>
          Skontrolovať
        </button>
      )}
      {result === 'correct' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#22c55e15', borderRadius: 12, border: '1px solid #22c55e40', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Check size={20} color="#22c55e" />
          <span style={{ color: '#22c55e', fontWeight: 600 }}>Správne! +{step.xp} XP</span>
          <button onClick={onComplete} style={{
            marginLeft: 'auto', padding: '8px 20px', background: '#22c55e', color: '#000',
            border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14,
          }}>Ďalej</button>
        </motion.div>
      )}
      {result === 'wrong' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
          padding: 16, background: '#ef444415', borderRadius: 12, border: '1px solid #ef444440', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <X size={18} color="#ef4444" />
          <span style={{ color: '#ef4444' }}>Niečo nie je správne. Skontroluj odpoveď.</span>
          <button onClick={() => setResult(null)} style={{
            marginLeft: 'auto', padding: '6px 16px', background: 'transparent', color: '#ef4444',
            border: '1px solid #ef444440', borderRadius: 8, cursor: 'pointer', fontSize: 13,
          }}>Skúsiť znova</button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Write Code Step ───
function WriteCodeView({ step, onComplete }: { step: ProjectStep; onComplete: () => void }) {
  const [code, setCode] = useState(step.starterCode || '');
  const [hintIdx, setHintIdx] = useState(-1);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ desc: string; passed: boolean }[] | null>(null);
  const [allPassed, setAllPassed] = useState(false);

  const runTests = () => {
    if (!step.tests) return;
    // Simple string-based validation (no Pyodide yet)
    const results = step.tests.map(t => {
      // Basic checks: does the code contain expected patterns?
      let passed = false;
      if (t.code.includes('in globals()')) {
        // Variable existence check — look for variable name in code
        const varName = t.code.match(/"(\w+)"/)?.[1];
        if (varName) passed = code.includes(`${varName} =`) || code.includes(`${varName}=`) || code.includes(`def ${varName}`);
      } else if (t.code.includes('callable(')) {
        const fnName = t.code.match(/callable\((\w+)\)/)?.[1];
        if (fnName) passed = code.includes(`def ${fnName}`);
      } else if (t.code.includes('isinstance(') && t.code.includes('dict')) {
        passed = code.includes('{') && code.includes('}') && code.includes('"title"') || code.includes("'title'");
      } else {
        // For other tests, check if solution keywords are present
        if (step.solution) {
          const solLines = step.solution.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
          const codeLines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
          const matchRate = solLines.filter(sl => codeLines.some(cl => cl.trim() === sl.trim())).length / solLines.length;
          passed = matchRate > 0.6;
        }
      }
      return { desc: t.description, passed };
    });
    setTestResults(results);
    const all = results.every(r => r.passed);
    setAllPassed(all);
  };

  const hints = step.hints || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {step.prompt && <p style={{ color: '#ccc', fontSize: 15, lineHeight: 1.6 }}>{step.prompt}</p>}

      {/* Editor */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ height: 3, background: 'linear-gradient(90deg, #22c55e, #3b82f6)' }} />
        <Editor
          height={Math.max(200, (code.split('\n').length + 2) * 20)}
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(v) => { setCode(v || ''); setTestResults(null); setAllPassed(false); }}
          options={{
            minimap: { enabled: false }, fontSize: 14, lineNumbers: 'on', scrollBeyondLastLine: false,
            padding: { top: 16 }, renderLineHighlight: 'none', tabSize: 4, wordWrap: 'on',
            overviewRulerLanes: 0, hideCursorInOverviewRuler: true, scrollbar: { vertical: 'hidden' },
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={runTests} style={{
          padding: '12px 24px', background: '#22c55e', color: '#000', border: 'none',
          borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Play size={16} /> Skontrolovať kód
        </button>
        <button onClick={() => setHintIdx(prev => Math.min(prev + 1, hints.length - 1))} style={{
          padding: '12px 24px', background: 'transparent', color: '#a0a0a0', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Lightbulb size={16} /> Nápoveda {hintIdx >= 0 ? `(${hintIdx + 1}/${hints.length})` : ''}
        </button>
      </div>

      {/* Hints */}
      <AnimatePresence>
        {hintIdx >= 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hints.slice(0, hintIdx + 1).map((h, i) => (
              <div key={i} style={{
                padding: '12px 16px', background: '#1a1a1a', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)', fontSize: 14, color: '#bbb',
              }}>
                <span style={{ color: '#f59e0b', fontWeight: 600, marginRight: 8 }}>Nápoveda {i + 1}:</span>
                {h.text}
                {h.code && <pre style={{ marginTop: 8, padding: '8px 12px', background: '#111', borderRadius: 6, color: '#22c55e', fontSize: 13 }}>{h.code}</pre>}
              </div>
            ))}
            {hintIdx >= hints.length - 1 && !showSolution && (
              <button onClick={() => setShowSolution(true)} style={{
                padding: '10px 20px', background: 'transparent', color: '#666', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, fontSize: 13, cursor: 'pointer', alignSelf: 'flex-start',
              }}>
                <Eye size={14} style={{ marginRight: 6 }} /> Zobraziť riešenie
              </button>
            )}
            {showSolution && step.solution && (
              <div style={{ padding: 16, background: '#111', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Riešenie:</div>
                <pre style={{ color: '#22c55e', fontSize: 13, whiteSpace: 'pre-wrap' }}>{step.solution}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Results */}
      {testResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {testResults.map((r, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 14,
              background: r.passed ? '#22c55e08' : '#ef444408',
              border: `1px solid ${r.passed ? '#22c55e20' : '#ef444420'}`,
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
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 16 }}>Výborne!</div>
                <div style={{ color: '#22c55e', opacity: 0.7, fontSize: 13 }}>+{step.xp} XP</div>
              </div>
              <button onClick={onComplete} style={{
                marginLeft: 'auto', padding: '10px 24px', background: '#22c55e', color: '#000',
                border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}>Ďalší krok</button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── Progress sidebar ───
function ProgressSidebar({ project, completedSteps, currentGlobalIdx, onSelectStep }: {
  project: InteractiveProject;
  completedSteps: Set<string>;
  currentGlobalIdx: number;
  onSelectStep: (gi: number) => void;
}) {
  const allSteps = getAllSteps(project);
  let gi = 0;

  return (
    <div style={{
      width: 260, minHeight: '100%', borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '20px 0', overflowY: 'auto', flexShrink: 0,
    }}>
      {project.sections.map((sec, si) => {
        const sectionSteps = sec.steps.map((_, sti) => gi++);
        const startGi = sectionSteps[0];
        return (
          <div key={si} style={{ marginBottom: 4 }}>
            <div style={{
              padding: '8px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: '#555',
            }}>{sec.title}</div>
            {sec.steps.map((step, sti) => {
              const gIdx = startGi + sti;
              const completed = completedSteps.has(step.id);
              const active = gIdx === currentGlobalIdx;
              const locked = gIdx > 0 && !completedSteps.has(allSteps[gIdx - 1]?.step.id) && !active;
              return (
                <button key={step.id} onClick={() => !locked && onSelectStep(gIdx)}
                  disabled={locked}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 20px', border: 'none', cursor: locked ? 'default' : 'pointer',
                    background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
                    borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
                    color: locked ? '#333' : completed ? '#22c55e' : active ? '#fff' : '#888',
                    fontSize: 13, textAlign: 'left', transition: 'all 0.15s',
                  }}>
                  {completed ? <CheckCircle2 size={16} color="#22c55e" /> : locked ? <Lock size={14} /> : <StepIcon type={step.type} size={14} />}
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.title}</span>
                  {step.xp > 0 && !locked && <span style={{ fontSize: 11, color: '#555' }}>{step.xp} XP</span>}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ───
export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { completeLesson, completedLessons, addXp } = useUserStore();

  const project = getProject(id as string);
  const allSteps = project ? getAllSteps(project) : [];

  // Completed steps
  const completedSteps = useMemo(() => {
    const set = new Set<string>();
    if (!project) return set;
    allSteps.forEach(({ step }) => {
      if (completedLessons.includes(getCompletedKey(project.id, step.id))) {
        set.add(step.id);
      }
    });
    return set;
  }, [project, completedLessons]);

  // Find first incomplete step
  const firstIncomplete = allSteps.findIndex(({ step }) => !completedSteps.has(step.id));
  const [currentGlobalIdx, setCurrentGlobalIdx] = useState(Math.max(0, firstIncomplete));

  // Sidebar open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!project) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: '#666' }}>Projekt nebol nájdený.</p>
        <Link href="/topics" style={{ color: '#22c55e', marginTop: 16, display: 'inline-block' }}>Späť na projekty</Link>
      </div>
    );
  }

  const currentStep = allSteps[currentGlobalIdx]?.step;
  const totalSteps = allSteps.length;
  const completedCount = completedSteps.size;
  const progress = totalSteps > 0 ? completedCount / totalSteps : 0;

  const handleStepComplete = () => {
    if (!currentStep) return;
    const key = getCompletedKey(project.id, currentStep.id);
    if (!completedLessons.includes(key)) {
      completeLesson(key);
      if (currentStep.xp > 0) addXp(currentStep.xp);
    }
    // Move to next step
    if (currentGlobalIdx < totalSteps - 1) {
      setCurrentGlobalIdx(currentGlobalIdx + 1);
    }
  };

  const isProjectComplete = completedCount === totalSteps;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0F0F0F' }}>
      <StatusBar />

      {/* Header */}
      <div style={{
        padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
      }}>
        <button onClick={() => router.push('/topics')} style={{
          background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4,
        }}>
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{project.icon} {project.title}</div>
          <div style={{ fontSize: 12, color: '#555' }}>
            {completedCount}/{totalSteps} krokov
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ width: 120, height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${progress * 100}%`, height: '100%', background: '#22c55e',
            borderRadius: 3, transition: 'width 0.5s ease',
          }} />
        </div>
        {/* Mobile sidebar toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mobile-only-btn" style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          color: '#888', padding: '6px 10px', cursor: 'pointer', fontSize: 12,
        }}>
          Kroky
        </button>
      </div>

      {/* Content area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar — desktop always visible, mobile toggle */}
        <div className="project-sidebar" style={{ display: sidebarOpen ? 'block' : undefined }}>
          <ProgressSidebar
            project={project}
            completedSteps={completedSteps}
            currentGlobalIdx={currentGlobalIdx}
            onSelectStep={(gi) => { setCurrentGlobalIdx(gi); setSidebarOpen(false); }}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '32px 40px 120px', maxWidth: 800 }}>
          {currentStep && (
            <AnimatePresence mode="wait">
              <motion.div key={currentStep.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {/* Step header */}
                <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: currentStep.type === 'theory' ? '#3b82f620' : currentStep.type === 'quiz' ? '#f59e0b20' : '#22c55e20',
                    color: currentStep.type === 'theory' ? '#3b82f6' : currentStep.type === 'quiz' ? '#f59e0b' : '#22c55e',
                  }}>
                    <StepIcon type={currentStep.type} size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {currentStep.type === 'theory' ? 'Teória' : currentStep.type === 'quiz' ? 'Kvíz' : currentStep.type === 'fill' ? 'Doplň kód' : 'Napíš kód'}
                      <span style={{ marginLeft: 8 }}>+{currentStep.xp} XP</span>
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{currentStep.title}</h2>
                  </div>
                </div>

                {/* Step content */}
                {currentStep.type === 'theory' && <TheoryView step={currentStep} onComplete={handleStepComplete} />}
                {currentStep.type === 'quiz' && <QuizView step={currentStep} onComplete={handleStepComplete} />}
                {currentStep.type === 'fill' && <FillCodeView step={currentStep} onComplete={handleStepComplete} />}
                {currentStep.type === 'write' && <WriteCodeView step={currentStep} onComplete={handleStepComplete} />}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Project complete */}
          {isProjectComplete && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{
              textAlign: 'center', padding: 40, marginTop: 40,
            }}>
              <Trophy size={48} color="#f59e0b" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Projekt dokončený!</h2>
              <p style={{ color: '#888', marginBottom: 24 }}>Vytvoril si {project.title}.</p>
              <div style={{
                padding: 20, background: '#1a1a1a', borderRadius: 12, maxWidth: 500, margin: '0 auto 24px',
                border: '1px solid rgba(255,255,255,0.06)', textAlign: 'left',
              }}>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>Finálny kód:</div>
                <pre style={{ color: '#22c55e', fontSize: 13, whiteSpace: 'pre-wrap', overflow: 'auto' }}>{project.finalCode}</pre>
              </div>
              <Link href="/topics" style={{
                padding: '14px 32px', background: '#22c55e', color: '#000', borderRadius: 12,
                fontWeight: 700, textDecoration: 'none', display: 'inline-block',
              }}>
                Späť na projekty
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      <style>{`
        .project-sidebar { display: none; }
        .mobile-only-btn { display: block; }
        @media (min-width: 768px) {
          .project-sidebar { display: block !important; }
          .mobile-only-btn { display: none !important; }
        }
        .theory-content h1 { font-size: 22px; font-weight: 700; color: #fff; margin: 24px 0 12px; }
        .theory-content h2 { font-size: 18px; font-weight: 600; color: #eee; margin: 20px 0 10px; }
        .theory-content h3 { font-size: 16px; font-weight: 600; color: #ddd; margin: 16px 0 8px; }
        .theory-content ul { padding-left: 20px; margin: 8px 0; }
        .theory-content li { margin: 4px 0; color: #bbb; }
        .theory-content strong { color: #fff; }
        .theory-content .code-block {
          background: #1a1a1a; border-radius: 10px; padding: 16px 20px; margin: 12px 0;
          overflow-x: auto; border: 1px solid rgba(255,255,255,0.06);
        }
        .theory-content .code-block code {
          color: #22c55e; font-family: var(--font-mono); font-size: 13px; white-space: pre;
        }
        .theory-content .inline-code {
          background: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono);
          font-size: 13px; color: #22c55e;
        }
        .theory-content table { border-collapse: collapse; margin: 12px 0; width: 100%; }
        .theory-content td { padding: 8px 12px; border: 1px solid rgba(255,255,255,0.08); color: #bbb; font-size: 14px; }
        .theory-content tr:first-child td { font-weight: 600; color: #fff; background: rgba(255,255,255,0.03); }
      `}</style>
    </div>
  );
}
