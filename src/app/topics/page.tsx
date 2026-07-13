'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { projectTopics } from '@/data/myprojects-topics';
import StatusBar from '@/components/StatusBar';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ArrowLeft, BookOpen, Code, PenTool, Lightbulb, X, Zap } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import type { Exercise } from '@/types';

const iconMap: Record<string, string> = {
  smartphone: '📱', database: '🗄', shield: '🔐', 'credit-card': '💳',
  'message-square': '💬', camera: '📸', zap: '⚡', 'git-branch': '🌿',
  code: '{}', layers: '📦', bell: '🔔', 'map-pin': '📍',
  'hard-drive': '💾', sparkles: '✦',
};

const typeIcons: Record<string, any> = {
  explain: BookOpen, mcq: Lightbulb, fill: Code, write: PenTool,
};

/* ========== EXERCISE MODAL ========== */

function ExerciseModal({ exercise, topicId, onClose, locale }: {
  exercise: Exercise;
  topicId: string;
  onClose: () => void;
  locale: 'en' | 'sk';
}) {
  const { completeLesson, completedLessons } = useUserStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const exKey = topicId + '-' + exercise.id;
  const alreadyDone = completedLessons.includes(exKey);

  const handleSubmitMcq = () => {
    if (!selected) return;
    if (selected === exercise.correctAnswer) {
      setShowResult('correct');
      completeLesson(exKey, exercise.xp);
    } else {
      setShowResult('wrong');
    }
  };

  const handleSubmitFill = () => {
    if (!exercise.blanks) return;
    const allCorrect = exercise.blanks.every(b => fillAnswers[b.id] === b.correct);
    if (allCorrect) {
      setShowResult('correct');
      completeLesson(exKey, exercise.xp);
    } else {
      setShowResult('wrong');
    }
  };

  const handleMarkRead = () => {
    setShowResult('correct');
    completeLesson(exKey, exercise.xp);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, overflow: 'auto',
      }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -10 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111', border: '1px solid #222', borderRadius: 20,
          padding: '28px 24px', maxWidth: 540, width: '100%', maxHeight: '85vh',
          overflow: 'auto', position: 'relative',
        }}
      >
        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12,
          background: '#1a1a1a', border: '1px solid #333', borderRadius: 8,
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888',
        }}>
          <X size={14} />
        </button>

        {/* Type badge + XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase',
            letterSpacing: '0.08em', background: 'rgba(74,222,128,0.1)',
            padding: '4px 10px', borderRadius: 6,
          }}>
            {exercise.type === 'explain' ? (locale === 'sk' ? 'Vysvetlenie' : 'Explanation')
              : exercise.type === 'mcq' ? 'Quiz'
              : exercise.type === 'fill' ? (locale === 'sk' ? 'Doplň kód' : 'Fill code')
              : (locale === 'sk' ? 'Napíš kód' : 'Write code')}
          </span>
          <span style={{ fontSize: 11, color: '#888', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Zap size={11} /> +{exercise.xp} XP
          </span>
          {alreadyDone && (
            <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 600, marginLeft: 'auto' }}>
              <Check size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {locale === 'sk' ? 'Hotové' : 'Done'}
            </span>
          )}
        </div>

        {/* Prompt */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#eee', marginBottom: 16, lineHeight: 1.4 }}>
          {exercise.prompt}
        </h3>

        {/* Code snippet */}
        {exercise.codeSnippet && (
          <pre style={{
            background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12,
            padding: '16px 18px', fontSize: 13, color: '#ccc', lineHeight: 1.7,
            overflow: 'auto', marginBottom: 16, fontFamily: 'JetBrains Mono, Fira Code, monospace',
            whiteSpace: 'pre-wrap',
          }}>
            {exercise.codeSnippet}
          </pre>
        )}

        {/* EXPLAIN type */}
        {exercise.type === 'explain' && exercise.explanation && (
          <>
            <div style={{
              background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12,
              padding: '16px 18px', marginBottom: 20,
            }}>
              <div style={{ fontSize: 14, color: '#bbb', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {exercise.explanation.split('**').map((part, i) =>
                  i % 2 === 1
                    ? <strong key={i} style={{ color: '#fff' }}>{part}</strong>
                    : <span key={i}>{part}</span>
                )}
              </div>
            </div>
            {!alreadyDone && showResult !== 'correct' && (
              <button onClick={handleMarkRead} style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: '#4ade80', color: '#000', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer',
              }}>
                {locale === 'sk' ? 'Rozumiem - hotové' : 'Got it - mark as done'}
              </button>
            )}
          </>
        )}

        {/* MCQ type */}
        {exercise.type === 'mcq' && exercise.options && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {exercise.options.map(opt => {
                const isSelected = selected === opt;
                const isCorrect = showResult && opt === exercise.correctAnswer;
                const isWrong = showResult === 'wrong' && isSelected && opt !== exercise.correctAnswer;
                return (
                  <button
                    key={opt}
                    onClick={() => { if (!showResult) setSelected(opt); }}
                    style={{
                      padding: '12px 16px', borderRadius: 10, textAlign: 'left',
                      fontSize: 13, fontWeight: 500, cursor: showResult ? 'default' : 'pointer',
                      background: isCorrect ? 'rgba(74,222,128,0.1)' : isWrong ? 'rgba(239,68,68,0.1)' : isSelected ? '#1a1a1a' : '#0a0a0a',
                      border: `1.5px solid ${isCorrect ? '#4ade80' : isWrong ? '#ef4444' : isSelected ? '#555' : '#1a1a1a'}`,
                      color: isCorrect ? '#4ade80' : isWrong ? '#ef4444' : '#ccc',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResult === 'wrong' && exercise.explanation && (
              <div style={{ background: '#1a0000', border: '1px solid #7f1d1d', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: '#fca5a5', margin: 0, lineHeight: 1.6 }}>{exercise.explanation}</p>
              </div>
            )}
            {showResult === 'correct' && exercise.explanation && (
              <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: '#86efac', margin: 0, lineHeight: 1.6 }}>{exercise.explanation}</p>
              </div>
            )}

            {!showResult && (
              <button onClick={handleSubmitMcq} disabled={!selected} style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: selected ? '#4ade80' : '#1a1a1a',
                color: selected ? '#000' : '#555', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: selected ? 'pointer' : 'not-allowed',
              }}>
                {locale === 'sk' ? 'Odoslať' : 'Submit'}
              </button>
            )}
            {showResult === 'wrong' && (
              <button onClick={() => { setShowResult(null); setSelected(null); }} style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: '#222', color: '#ccc', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer',
              }}>
                {locale === 'sk' ? 'Skúsiť znova' : 'Try again'}
              </button>
            )}
          </>
        )}

        {/* FILL type */}
        {exercise.type === 'fill' && exercise.blanks && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {exercise.blanks.map(blank => (
                <div key={blank.id}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 6, fontWeight: 600 }}>
                    {locale === 'sk' ? 'Vyber správnu odpoveď:' : 'Pick the correct answer:'}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {blank.options.map(opt => {
                      const isSel = fillAnswers[blank.id] === opt;
                      const isCorrectAnswer = showResult && opt === blank.correct;
                      const isWrongAnswer = showResult === 'wrong' && isSel && opt !== blank.correct;
                      return (
                        <button
                          key={opt}
                          onClick={() => { if (!showResult) setFillAnswers(prev => ({ ...prev, [blank.id]: opt })); }}
                          style={{
                            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                            cursor: showResult ? 'default' : 'pointer',
                            fontFamily: 'JetBrains Mono, Fira Code, monospace',
                            background: isCorrectAnswer ? 'rgba(74,222,128,0.15)' : isWrongAnswer ? 'rgba(239,68,68,0.15)' : isSel ? '#222' : '#0a0a0a',
                            border: `1.5px solid ${isCorrectAnswer ? '#4ade80' : isWrongAnswer ? '#ef4444' : isSel ? '#666' : '#1a1a1a'}`,
                            color: isCorrectAnswer ? '#4ade80' : isWrongAnswer ? '#ef4444' : '#ccc',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!showResult && (
              <button
                onClick={handleSubmitFill}
                disabled={exercise.blanks.some(b => !fillAnswers[b.id])}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: exercise.blanks.every(b => fillAnswers[b.id]) ? '#4ade80' : '#1a1a1a',
                  color: exercise.blanks.every(b => fillAnswers[b.id]) ? '#000' : '#555',
                  fontWeight: 700, fontSize: 14, border: 'none',
                  cursor: exercise.blanks.every(b => fillAnswers[b.id]) ? 'pointer' : 'not-allowed',
                }}
              >
                {locale === 'sk' ? 'Odoslať' : 'Submit'}
              </button>
            )}
            {showResult === 'wrong' && (
              <button onClick={() => { setShowResult(null); setFillAnswers({}); }} style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: '#222', color: '#ccc', fontWeight: 700, fontSize: 14,
                border: 'none', cursor: 'pointer',
              }}>
                {locale === 'sk' ? 'Skúsiť znova' : 'Try again'}
              </button>
            )}
          </>
        )}

        {/* Success state */}
        {showResult === 'correct' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 12, textAlign: 'center' }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', marginBottom: 8 }}>
              {locale === 'sk' ? 'Správne!' : 'Correct!'} +{exercise.xp} XP
            </div>
            <button onClick={onClose} style={{
              padding: '10px 24px', borderRadius: 10, background: '#1a1a1a',
              border: '1px solid #333', color: '#ccc', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              {locale === 'sk' ? 'Zavrieť' : 'Close'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function TopicsPage() {
  const { completedLessons } = useUserStore();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [activeExercise, setActiveExercise] = useState<{ exercise: Exercise; topicId: string } | null>(null);

  const activeTopic = projectTopics.find(t => t.id === openTopic);

  // Exercise modal
  const exerciseModal = activeExercise && (
    <AnimatePresence>
      <ExerciseModal
        key={activeExercise.exercise.id}
        exercise={activeExercise.exercise}
        topicId={activeExercise.topicId}
        onClose={() => setActiveExercise(null)}
        locale={locale}
      />
    </AnimatePresence>
  );

  // Topic detail view
  if (activeTopic) {
    return (
      <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
        {exerciseModal}
        <StatusBar />
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
          <button
            onClick={() => setOpenTopic(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 20, padding: 0 }}
          >
            <ArrowLeft size={16} />
            {locale === 'sk' ? 'Späť na témy' : 'Back to topics'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{iconMap[activeTopic.icon] ?? '◆'}</span>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: 0 }}>{activeTopic.title}</h1>
              <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>{activeTopic.description}</p>
            </div>
          </div>

          <div style={{ height: 3, borderRadius: 2, background: '#1a1a1a', marginBottom: 24, overflow: 'hidden' }}>
            {(() => {
              const total = activeTopic.lessons.flatMap(l => l.exercises).length;
              const done = activeTopic.lessons.flatMap(l => l.exercises).filter(e => completedLessons.includes(activeTopic.id + '-' + e.id)).length;
              return <div style={{ height: '100%', background: '#4ade80', borderRadius: 2, width: `${total > 0 ? (done / total) * 100 : 0}%` }} />;
            })()}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTopic.lessons.map((lesson, li) => {
              const exercises = lesson.exercises;
              const done = exercises.filter(e => completedLessons.includes(activeTopic.id + '-' + e.id)).length;
              const allDone = done === exercises.length;

              return (
                <div
                  key={lesson.id}
                  onClick={() => router.push(`/topics/${activeTopic.id}/${lesson.id}`)}
                  style={{ background: '#0a0a0a', border: `1px solid ${allDone ? 'rgba(74,222,128,0.2)' : '#1a1a1a'}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
                >
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: allDone ? '#4ade80' : '#111', border: allDone ? 'none' : '1px solid #222',
                    }}>
                      {allDone ? <Check size={18} color="#052e16" strokeWidth={3} /> : <span style={{ fontSize: 14, fontWeight: 700, color: '#888' }}>{li + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: allDone ? '#4ade80' : '#ddd' }}>{lesson.title}</div>
                      <div style={{ fontSize: 11, color: '#777', marginTop: 2 }}>{done}/{exercises.length} {locale === 'sk' ? 'hotových' : 'done'}</div>
                    </div>
                    <ChevronRight size={16} color="#333" />
                  </div>

                  {/* Exercise list */}
                  <div style={{ borderTop: '1px solid #111' }}>
                    {exercises.map((ex, ei) => {
                      const exDone = completedLessons.includes(activeTopic.id + '-' + ex.id);
                      const TypeIcon = typeIcons[ex.type] || BookOpen;
                      const typeLabel = ex.type === 'explain' ? (locale === 'sk' ? 'Čítanie' : 'Read')
                        : ex.type === 'mcq' ? 'Quiz'
                        : ex.type === 'fill' ? (locale === 'sk' ? 'Doplň kód' : 'Fill code')
                        : (locale === 'sk' ? 'Napíš kód' : 'Write code');

                      return (
                        <div
                          key={ex.id}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', textAlign: 'left',
                            borderTop: ei === 0 ? 'none' : '1px solid #0f0f0f',
                          }}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: exDone ? '#4ade80' : 'transparent',
                            border: exDone ? 'none' : '1px solid #2a2a2a',
                          }}>
                            {exDone ? <Check size={12} color="#052e16" strokeWidth={3} /> : <TypeIcon size={10} color="#555" />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: exDone ? '#888' : '#ccc', fontWeight: 500 }}>
                              {ex.prompt.length > 60 ? ex.prompt.slice(0, 60) + '...' : ex.prompt}
                            </div>
                          </div>
                          <span style={{ fontSize: 9, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {typeLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Topics grid
  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 6 }}>
            {s('myProjects', locale)}
          </h1>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
            {s('myProjectsDesc', locale)}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {projectTopics.map((topic, i) => {
            const done = topic.lessons.flatMap(l => l.exercises).filter(e =>
              completedLessons.includes(topic.id + '-' + e.id)
            ).length;
            const total = topic.lessons.flatMap(l => l.exercises).length;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpenTopic(topic.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '16px', borderRadius: 16, textAlign: 'left',
                  cursor: 'pointer', border: 'none',
                  background: '#0a0a0a',
                  outline: '1.5px solid #1a1a1a',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>
                    {iconMap[topic.icon] ?? '◆'}
                  </span>
                  {done > 0 && (
                    <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
                      {done}/{total}
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: '#ccc', marginBottom: 4 }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: 11, color: '#777', lineHeight: 1.4, marginBottom: 10 }}>
                  {topic.description}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>
                    {topic.lessons.length} {s('lessons', locale)} - {total} {s('exercises', locale)}
                  </span>
                  <ChevronRight size={14} color="#333" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
