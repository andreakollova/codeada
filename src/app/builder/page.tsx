'use client';

import { useState, useEffect, useCallback } from 'react';

// ── API helper ──────────────────────────────────────────────
async function api(body: any) {
  const res = await fetch('/api/builder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// ── Types ───────────────────────────────────────────────────
interface Module {
  id: number;
  module_number: number;
  title: string;
  title_sk: string;
}
interface LessonSummary {
  id: number;
  module_id: number;
  lesson_number: number;
  title: string;
  title_sk: string;
  lesson_type: string;
}
interface Lesson {
  id?: number;
  module_id: number;
  lesson_number: number;
  title: string;
  title_sk: string;
  lesson_type: string;
  introduction: string;
  introduction_sk: string;
  learning_content: string;
  learning_content_sk: string;
  interesting_facts: string;
  interesting_facts_sk: string;
  real_world: string;
  real_world_sk: string;
  key_takeaways: string[];
  key_takeaways_sk: string[];
  challenge: string;
  challenge_sk: string;
  common_mistakes: string;
  best_practices: string;
  [key: string]: any;
}
interface QuizOption {
  id?: number;
  question_id?: number;
  option_label: string;
  option_text: string;
  option_text_sk: string;
  is_correct: boolean;
}
interface QuizQuestion {
  id?: number;
  lesson_id: number;
  question_number: number;
  question_text: string;
  question_text_sk: string;
  question_type: string;
  correct_answer: string;
  code_snippet: string;
  explanation: string;
  explanation_sk: string;
  options: QuizOption[];
}

// ── Mini lesson parser ──────────────────────────────────────
interface MiniLesson {
  title: string;
  content: string;
}

function parseMiniLessons(raw: string): MiniLesson[] {
  if (!raw || !raw.trim()) return [];
  const parts = raw.split(/\n\n(?=## )/);
  return parts
    .map((part) => {
      const match = part.match(/^## (.+)\n?([\s\S]*)$/);
      if (!match) return null;
      return { title: match[1].trim(), content: match[2].trim() };
    })
    .filter(Boolean) as MiniLesson[];
}

function serializeMiniLessons(minis: MiniLesson[]): string {
  return minis.map((m) => `## ${m.title}\n${m.content}`).join('\n\n');
}

// ── Styles ──────────────────────────────────────────────────
const s = {
  page: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    background: '#0F0F0F',
    color: '#EDEDED',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '12px 20px',
    background: '#111',
    borderBottom: '1px solid #222',
    flexShrink: 0,
  },
  topTitle: { fontWeight: 700, fontSize: 18, marginRight: 24 },
  tab: (active: boolean) => ({
    padding: '6px 16px',
    borderRadius: 6,
    background: active ? '#222' : 'transparent',
    color: active ? '#4ade80' : '#888',
    cursor: 'pointer',
    border: 'none',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
  }),
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: 300,
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column' as const,
    background: '#111',
    overflow: 'hidden',
    flexShrink: 0,
  },
  sideSection: {
    padding: '12px 16px',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    background: '#1a1a1a',
    color: '#EDEDED',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
  },
  lessonList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 8px 8px',
  },
  lessonItem: (active: boolean) => ({
    padding: '10px 12px',
    borderRadius: 6,
    background: active ? '#1a2e1a' : 'transparent',
    border: active ? '1px solid #4ade80' : '1px solid transparent',
    cursor: 'pointer',
    marginBottom: 4,
    transition: 'background 0.15s',
  }),
  lessonNum: { fontSize: 11, color: '#666', marginBottom: 2 },
  lessonTitle: { fontSize: 13, fontWeight: 500 },
  btn: (color: string) => ({
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    background: color,
    color: color === '#ef4444' || color === '#4ade80' ? '#000' : '#EDEDED',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  }),
  btnSmall: (color: string) => ({
    padding: '4px 10px',
    borderRadius: 4,
    border: 'none',
    background: color,
    color: color === '#ef4444' || color === '#4ade80' ? '#000' : '#EDEDED',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 500,
  }),
  main: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: 24,
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    background: '#111',
    color: '#EDEDED',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    background: '#111',
    color: '#EDEDED',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: 80,
    boxSizing: 'border-box' as const,
  },
  codebox: {
    width: '100%',
    padding: '8px 10px',
    background: '#0a0a0a',
    color: '#4ade80',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 13,
    fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
    outline: 'none',
    resize: 'vertical' as const,
    minHeight: 80,
    boxSizing: 'border-box' as const,
  },
  label: { fontSize: 12, color: '#888', marginBottom: 4, display: 'block' },
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: color,
    color: '#000',
    marginRight: 8,
  }),
  row: {
    display: 'flex',
    gap: 12,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  toast: (visible: boolean) => ({
    position: 'fixed' as const,
    bottom: 20,
    right: 20,
    padding: '10px 20px',
    background: '#4ade80',
    color: '#000',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s',
    pointerEvents: 'none' as const,
    zIndex: 9999,
  }),
};

// ── Main Component ──────────────────────────────────────────
export default function BuilderPage() {
  // Hide main nav on builder page
  useEffect(() => {
    document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => (el as HTMLElement).style.display = 'none');
    return () => {
      document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => (el as HTMLElement).style.display = '');
    };
  }, []);

  const [topTab, setTopTab] = useState<'citanie' | 'paths'>('citanie');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [miniLessons, setMiniLessons] = useState<MiniLesson[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [contentTab, setContentTab] = useState<'obsah' | 'otazky' | 'info'>('obsah');
  const [toast, setToast] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);

  // Toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  // ── Load modules ──
  useEffect(() => {
    api({ action: 'getModules' }).then(setModules).catch(console.error);
  }, []);

  // ── Load lessons when module changes ──
  useEffect(() => {
    if (!selectedModuleId) {
      setLessons([]);
      return;
    }
    api({ action: 'getLessons', moduleId: selectedModuleId })
      .then(setLessons)
      .catch(console.error);
  }, [selectedModuleId]);

  // ── Load lesson detail ──
  const loadLesson = useCallback(async (id: number) => {
    setSelectedLessonId(id);
    setLoading(true);
    try {
      const data = await api({ action: 'getLesson', lessonId: id });
      setLesson(data);
      setMiniLessons(parseMiniLessons(data.learning_content_sk || ''));
      const qs = await api({ action: 'getQuestions', lessonId: id });
      setQuestions(qs || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  // ── Save lesson ──
  const saveLesson = async () => {
    if (!lesson) return;
    setLoading(true);
    try {
      const contentSk = serializeMiniLessons(miniLessons);
      const payload = {
        ...lesson,
        learning_content_sk: contentSk,
      };
      const saved = await api({ action: 'saveLesson', lesson: payload });
      setLesson(saved);
      showToast('Uložené!');
      // Refresh sidebar
      if (selectedModuleId) {
        const ls = await api({ action: 'getLessons', moduleId: selectedModuleId });
        setLessons(ls);
      }
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
    setLoading(false);
  };

  // ── Delete lesson ──
  const deleteLesson = async () => {
    if (!lesson?.id) return;
    if (!confirm('Naozaj vymazať túto lekciu a všetky jej otázky?')) return;
    setLoading(true);
    try {
      await api({ action: 'deleteLesson', lessonId: lesson.id });
      setLesson(null);
      setSelectedLessonId(null);
      setMiniLessons([]);
      setQuestions([]);
      showToast('Vymazané!');
      if (selectedModuleId) {
        const ls = await api({ action: 'getLessons', moduleId: selectedModuleId });
        setLessons(ls);
      }
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
    setLoading(false);
  };

  // ── New lesson ──
  const addNewLesson = () => {
    if (!selectedModuleId) return;
    const maxNum = lessons.reduce((m, l) => Math.max(m, l.lesson_number), 0);
    const newLesson: Lesson = {
      module_id: selectedModuleId,
      lesson_number: maxNum + 1,
      title: '',
      title_sk: 'Nová lekcia',
      lesson_type: 'theory',
      introduction: '',
      introduction_sk: '',
      learning_content: '',
      learning_content_sk: '',
      interesting_facts: '',
      interesting_facts_sk: '',
      real_world: '',
      real_world_sk: '',
      key_takeaways: [],
      key_takeaways_sk: [],
      challenge: '',
      challenge_sk: '',
      common_mistakes: '',
      best_practices: '',
    };
    setLesson(newLesson);
    setMiniLessons([]);
    setQuestions([]);
    setSelectedLessonId(null);
    setContentTab('obsah');
  };

  // ── Mini lesson operations ──
  const addMiniLesson = () => {
    setMiniLessons([...miniLessons, { title: 'Nová sekcia', content: '' }]);
  };
  const deleteMiniLesson = (idx: number) => {
    setMiniLessons(miniLessons.filter((_, i) => i !== idx));
  };
  const moveMiniLesson = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= miniLessons.length) return;
    const copy = [...miniLessons];
    [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
    setMiniLessons(copy);
  };
  const updateMiniLesson = (idx: number, field: 'title' | 'content', value: string) => {
    const copy = [...miniLessons];
    copy[idx] = { ...copy[idx], [field]: value };
    setMiniLessons(copy);
  };

  // ── Question operations ──
  const saveQuestion = async (q: QuizQuestion, opts: QuizOption[]) => {
    setLoading(true);
    try {
      const questionPayload: any = {
        lesson_id: q.lesson_id,
        question_number: q.question_number,
        question_text: q.question_text,
        question_text_sk: q.question_text_sk,
        question_type: q.question_type,
        correct_answer: q.correct_answer || '',
        code_snippet: q.code_snippet || '',
        explanation: q.explanation || '',
        explanation_sk: q.explanation_sk || '',
      };
      if (q.id) questionPayload.id = q.id;

      const optionsPayload = q.question_type === 'multiple_choice' ? opts : [];
      await api({ action: 'saveQuestion', question: questionPayload, options: optionsPayload });
      showToast('Otázka uložená!');
      // Refresh questions
      if (selectedLessonId || lesson?.id) {
        const qs = await api({ action: 'getQuestions', lessonId: selectedLessonId || lesson?.id });
        setQuestions(qs || []);
      }
      setEditingQuestion(null);
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
    setLoading(false);
  };

  const deleteQuestion = async (qId: number) => {
    if (!confirm('Vymazať otázku?')) return;
    try {
      await api({ action: 'deleteQuestion', questionId: qId });
      showToast('Vymazané!');
      if (selectedLessonId || lesson?.id) {
        const qs = await api({ action: 'getQuestions', lessonId: selectedLessonId || lesson?.id });
        setQuestions(qs || []);
      }
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
  };

  const startNewQuestion = () => {
    if (!lesson) return;
    const maxNum = questions.reduce((m, q) => Math.max(m, q.question_number), 0);
    setEditingQuestion({
      lesson_id: lesson.id || 0,
      question_number: maxNum + 1,
      question_text: '',
      question_text_sk: '',
      question_type: 'multiple_choice',
      correct_answer: '',
      code_snippet: '',
      explanation: '',
      explanation_sk: '',
      options: [
        { option_label: 'A', option_text: '', option_text_sk: '', is_correct: true },
        { option_label: 'B', option_text: '', option_text_sk: '', is_correct: false },
        { option_label: 'C', option_text: '', option_text_sk: '', is_correct: false },
        { option_label: 'D', option_text: '', option_text_sk: '', is_correct: false },
      ],
    });
  };

  // ── Lesson field updater ──
  const updateField = (field: string, value: any) => {
    if (!lesson) return;
    setLesson({ ...lesson, [field]: value });
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Top bar */}
      <div style={s.topBar}>
        <span style={s.topTitle}>Builder</span>
        <button style={s.tab(topTab === 'citanie')} onClick={() => setTopTab('citanie')}>
          Čítanie
        </button>
        <button style={s.tab(topTab === 'paths')} onClick={() => setTopTab('paths')}>
          Paths
        </button>
      </div>

      {topTab === 'paths' ? (
        <div style={{ ...s.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#666', fontSize: 18 }}>Coming soon</span>
        </div>
      ) : (
        <div style={s.body}>
          {/* Sidebar */}
          <div style={s.sidebar}>
            <div style={s.sideSection}>
              <label style={s.label}>Modul</label>
              <select
                style={s.select}
                value={selectedModuleId || ''}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : null;
                  setSelectedModuleId(v);
                  setSelectedLessonId(null);
                  setLesson(null);
                  setMiniLessons([]);
                  setQuestions([]);
                }}
              >
                <option value="">-- Vyber modul --</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.module_number}. {m.title_sk || m.title}
                  </option>
                ))}
              </select>
            </div>

            <div style={s.lessonList}>
              {lessons.map((l) => (
                <div
                  key={l.id}
                  style={s.lessonItem(selectedLessonId === l.id)}
                  onClick={() => loadLesson(l.id)}
                >
                  <div style={s.lessonNum}>#{l.lesson_number}</div>
                  <div style={s.lessonTitle}>{l.title_sk || l.title || '(bez názvu)'}</div>
                </div>
              ))}
              {selectedModuleId && (
                <button
                  style={{ ...s.btn('#4ade80'), width: '100%', marginTop: 8 }}
                  onClick={addNewLesson}
                >
                  + Nová lekcia
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div style={s.main as any}>
            {!lesson && !loading && (
              <div style={{ color: '#666', textAlign: 'center', marginTop: 100 }}>
                Vyber lekciu z ľavého panelu
              </div>
            )}
            {loading && (
              <div style={{ color: '#666', textAlign: 'center', marginTop: 100 }}>
                Načítavam...
              </div>
            )}

            {lesson && !loading && (
              <>
                {/* Content tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {(['obsah', 'otazky', 'info'] as const).map((t) => (
                    <button
                      key={t}
                      style={s.tab(contentTab === t)}
                      onClick={() => setContentTab(t)}
                    >
                      {t === 'obsah' ? 'Obsah' : t === 'otazky' ? 'Otázky' : 'Info'}
                    </button>
                  ))}
                </div>

                {/* ═══ OBSAH TAB ═══ */}
                {contentTab === 'obsah' && (
                  <div>
                    <div style={s.row}>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Názov SK</label>
                        <input
                          style={s.input}
                          value={lesson.title_sk || ''}
                          onChange={(e) => updateField('title_sk', e.target.value)}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Názov EN</label>
                        <input
                          style={s.input}
                          value={lesson.title || ''}
                          onChange={(e) => updateField('title', e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={s.fieldGroup}>
                      <label style={s.label}>Úvod SK (introduction_sk)</label>
                      <textarea
                        style={s.textarea}
                        rows={4}
                        value={lesson.introduction_sk || ''}
                        onChange={(e) => updateField('introduction_sk', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 15, color: '#4ade80' }}>
                        Mini lekcie ({miniLessons.length})
                      </h3>
                      <button style={s.btnSmall('#4ade80')} onClick={addMiniLesson}>
                        + Pridať sekciu
                      </button>
                    </div>

                    {miniLessons.map((ml, idx) => (
                      <MiniLessonCard
                        key={idx}
                        mini={ml}
                        index={idx}
                        total={miniLessons.length}
                        onUpdate={(f, v) => updateMiniLesson(idx, f, v)}
                        onDelete={() => deleteMiniLesson(idx)}
                        onMove={(dir) => moveMiniLesson(idx, dir)}
                      />
                    ))}

                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      <button style={s.btn('#4ade80')} onClick={saveLesson}>
                        Uložiť lekciu
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══ OTÁZKY TAB ═══ */}
                {contentTab === 'otazky' && (
                  <div>
                    {questions.map((q) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        onEdit={() => setEditingQuestion({ ...q })}
                        onDelete={() => q.id && deleteQuestion(q.id)}
                      />
                    ))}

                    {!lesson.id && (
                      <div style={{ color: '#666', marginBottom: 12 }}>
                        Najprv ulož lekciu, potom môžeš pridať otázky.
                      </div>
                    )}

                    {lesson.id && !editingQuestion && (
                      <button style={s.btn('#4ade80')} onClick={startNewQuestion}>
                        + Pridať otázku
                      </button>
                    )}

                    {editingQuestion && (
                      <QuestionEditor
                        question={editingQuestion}
                        onSave={saveQuestion}
                        onCancel={() => setEditingQuestion(null)}
                      />
                    )}
                  </div>
                )}

                {/* ═══ INFO TAB ═══ */}
                {contentTab === 'info' && (
                  <div>
                    <div style={s.card}>
                      <div style={s.row}>
                        <div style={{ flex: 1 }}>
                          <label style={s.label}>Číslo lekcie</label>
                          <input
                            style={s.input}
                            type="number"
                            value={lesson.lesson_number || 0}
                            onChange={(e) => updateField('lesson_number', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={s.label}>Typ lekcie</label>
                          <input
                            style={s.input}
                            value={lesson.lesson_type || ''}
                            onChange={(e) => updateField('lesson_type', e.target.value)}
                          />
                        </div>
                      </div>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Modul</label>
                        <select
                          style={s.select}
                          value={lesson.module_id || ''}
                          onChange={(e) => updateField('module_id', Number(e.target.value))}
                        >
                          {modules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.module_number}. {m.title_sk || m.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={s.card}>
                      <h4 style={{ margin: '0 0 12px', color: '#888', fontSize: 13 }}>Doplnkový obsah</h4>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Interesting facts SK</label>
                        <textarea
                          style={s.textarea}
                          rows={3}
                          value={lesson.interesting_facts_sk || ''}
                          onChange={(e) => updateField('interesting_facts_sk', e.target.value)}
                        />
                      </div>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Real world SK</label>
                        <textarea
                          style={s.textarea}
                          rows={3}
                          value={lesson.real_world_sk || ''}
                          onChange={(e) => updateField('real_world_sk', e.target.value)}
                        />
                      </div>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Challenge SK</label>
                        <textarea
                          style={s.textarea}
                          rows={3}
                          value={lesson.challenge_sk || ''}
                          onChange={(e) => updateField('challenge_sk', e.target.value)}
                        />
                      </div>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Common mistakes</label>
                        <textarea
                          style={s.textarea}
                          rows={3}
                          value={lesson.common_mistakes || ''}
                          onChange={(e) => updateField('common_mistakes', e.target.value)}
                        />
                      </div>
                      <div style={s.fieldGroup}>
                        <label style={s.label}>Best practices</label>
                        <textarea
                          style={s.textarea}
                          rows={3}
                          value={lesson.best_practices || ''}
                          onChange={(e) => updateField('best_practices', e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      <button style={s.btn('#4ade80')} onClick={saveLesson}>
                        Uložiť
                      </button>
                      {lesson.id && (
                        <button style={s.btn('#ef4444')} onClick={deleteLesson}>
                          Vymazať lekciu
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={s.toast(!!toast)}>{toast}</div>
    </div>
  );
}

// ── Mini Lesson Card Component ──────────────────────────────
function MiniLessonCard({
  mini,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
}: {
  mini: MiniLesson;
  index: number;
  total: number;
  onUpdate: (field: 'title' | 'content', value: string) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: collapsed ? 0 : 12 }}>
        <button
          style={{ ...s.btnSmall('#333'), fontSize: 14, padding: '2px 8px' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '+' : '-'}
        </button>
        <span style={{ fontSize: 11, color: '#666' }}>#{index + 1}</span>
        <input
          style={{ ...s.input, flex: 1, fontWeight: 600 }}
          value={mini.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          style={s.btnSmall('#333')}
          onClick={() => onMove(-1)}
          disabled={index === 0}
        >
          ^
        </button>
        <button
          style={s.btnSmall('#333')}
          onClick={() => onMove(1)}
          disabled={index === total - 1}
        >
          v
        </button>
        <button style={s.btnSmall('#ef4444')} onClick={onDelete}>
          X
        </button>
      </div>
      {!collapsed && (
        <textarea
          style={{ ...s.textarea, minHeight: 120 }}
          value={mini.content}
          onChange={(e) => onUpdate('content', e.target.value)}
        />
      )}
    </div>
  );
}

// ── Question Card Component ─────────────────────────────────
function QuestionCard({
  question,
  onEdit,
  onDelete,
}: {
  question: QuizQuestion;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const typeLabel =
    question.question_type === 'fill_code'
      ? 'Doplň kód'
      : question.code_snippet
        ? 'Vyber kód'
        : 'Otázka';
  const typeColor =
    question.question_type === 'fill_code' ? '#f59e0b' : question.code_snippet ? '#818cf8' : '#4ade80';

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={s.badge(typeColor)}>{typeLabel}</span>
        <span style={{ fontSize: 11, color: '#666' }}>#{question.question_number}</span>
        <div style={{ flex: 1 }} />
        <button style={s.btnSmall('#333')} onClick={onEdit}>
          Upraviť
        </button>
        <button style={s.btnSmall('#ef4444')} onClick={onDelete}>
          X
        </button>
      </div>
      <div style={{ fontSize: 13, marginBottom: 6 }}>{question.question_text_sk || question.question_text}</div>
      {question.code_snippet && (
        <pre
          style={{
            background: '#0a0a0a',
            color: '#4ade80',
            padding: 10,
            borderRadius: 6,
            fontSize: 12,
            fontFamily: '"SF Mono", "Fira Code", monospace',
            overflow: 'auto',
            marginBottom: 6,
          }}
        >
          {question.code_snippet}
        </pre>
      )}
      {question.question_type === 'multiple_choice' && question.options && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {question.options.map((o) => (
            <span
              key={o.option_label}
              style={{
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 12,
                background: o.is_correct ? '#1a2e1a' : '#1a1a1a',
                border: o.is_correct ? '1px solid #4ade80' : '1px solid #333',
                color: o.is_correct ? '#4ade80' : '#aaa',
              }}
            >
              {o.option_label}: {o.option_text_sk || o.option_text}
            </span>
          ))}
        </div>
      )}
      {question.question_type === 'fill_code' && question.correct_answer && (
        <div style={{ fontSize: 12, color: '#4ade80' }}>
          Odpoveď: {question.correct_answer}
        </div>
      )}
    </div>
  );
}

// ── Question Editor Component ───────────────────────────────
function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: QuizQuestion;
  onSave: (q: QuizQuestion, opts: QuizOption[]) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<QuizQuestion>({ ...question });
  const [opts, setOpts] = useState<QuizOption[]>(
    question.options && question.options.length > 0
      ? question.options.map((o) => ({ ...o }))
      : [
          { option_label: 'A', option_text: '', option_text_sk: '', is_correct: true },
          { option_label: 'B', option_text: '', option_text_sk: '', is_correct: false },
          { option_label: 'C', option_text: '', option_text_sk: '', is_correct: false },
          { option_label: 'D', option_text: '', option_text_sk: '', is_correct: false },
        ],
  );

  const typeOptions = [
    { value: 'mcq', label: 'Otázka (MCQ)' },
    { value: 'mcq_code', label: 'Vyber kód (MCQ + kód)' },
    { value: 'fill_code', label: 'Doplň kód' },
  ];

  const currentType =
    q.question_type === 'fill_code' ? 'fill_code' : q.code_snippet ? 'mcq_code' : 'mcq';

  const handleTypeChange = (val: string) => {
    if (val === 'fill_code') {
      setQ({ ...q, question_type: 'fill_code', code_snippet: q.code_snippet || '' });
    } else if (val === 'mcq_code') {
      setQ({ ...q, question_type: 'multiple_choice', code_snippet: q.code_snippet || '' });
    } else {
      setQ({ ...q, question_type: 'multiple_choice', code_snippet: '' });
    }
  };

  const setCorrectOption = (label: string) => {
    setOpts(opts.map((o) => ({ ...o, is_correct: o.option_label === label })));
  };

  const showCode = currentType === 'mcq_code' || currentType === 'fill_code';
  const showOptions = currentType === 'mcq' || currentType === 'mcq_code';

  return (
    <div style={{ ...s.card, border: '1px solid #4ade80' }}>
      <h4 style={{ margin: '0 0 12px', color: '#4ade80', fontSize: 14 }}>
        {q.id ? 'Upraviť otázku' : 'Nová otázka'}
      </h4>

      <div style={s.row}>
        <div style={{ flex: 1 }}>
          <label style={s.label}>Typ</label>
          <select style={s.select} value={currentType} onChange={(e) => handleTypeChange(e.target.value)}>
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ width: 100 }}>
          <label style={s.label}>Číslo</label>
          <input
            style={s.input}
            type="number"
            value={q.question_number}
            onChange={(e) => setQ({ ...q, question_number: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Otázka SK</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.question_text_sk || ''}
          onChange={(e) => setQ({ ...q, question_text_sk: e.target.value })}
        />
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Otázka EN</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.question_text || ''}
          onChange={(e) => setQ({ ...q, question_text: e.target.value })}
        />
      </div>

      {showCode && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Code snippet</label>
          <textarea
            style={s.codebox}
            rows={4}
            value={q.code_snippet || ''}
            onChange={(e) => setQ({ ...q, code_snippet: e.target.value })}
          />
        </div>
      )}

      {showOptions && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Možnosti</label>
          {opts.map((o, i) => (
            <div key={o.option_label} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <input
                type="radio"
                name="correct"
                checked={o.is_correct}
                onChange={() => setCorrectOption(o.option_label)}
                style={{ accentColor: '#4ade80' }}
              />
              <span style={{ width: 20, fontSize: 13, fontWeight: 600, color: '#666' }}>{o.option_label}</span>
              <input
                style={{ ...s.input, flex: 1 }}
                placeholder="SK"
                value={o.option_text_sk || ''}
                onChange={(e) => {
                  const copy = [...opts];
                  copy[i] = { ...copy[i], option_text_sk: e.target.value };
                  setOpts(copy);
                }}
              />
              <input
                style={{ ...s.input, flex: 1 }}
                placeholder="EN"
                value={o.option_text || ''}
                onChange={(e) => {
                  const copy = [...opts];
                  copy[i] = { ...copy[i], option_text: e.target.value };
                  setOpts(copy);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {currentType === 'fill_code' && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Správna odpoveď</label>
          <input
            style={s.input}
            value={q.correct_answer || ''}
            onChange={(e) => setQ({ ...q, correct_answer: e.target.value })}
          />
        </div>
      )}

      <div style={s.fieldGroup}>
        <label style={s.label}>Vysvetlenie SK</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.explanation_sk || ''}
          onChange={(e) => setQ({ ...q, explanation_sk: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button style={s.btn('#4ade80')} onClick={() => onSave(q, opts)}>
          Uložiť otázku
        </button>
        <button style={s.btn('#333')} onClick={onCancel}>
          Zrušiť
        </button>
      </div>
    </div>
  );
}
