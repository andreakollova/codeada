'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
  miniTitles?: string[];
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

// ── HTML to Markdown (for paste from ChatGPT etc.) ──────────
function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const kids = Array.from(el.childNodes).map(walk).join('');

    switch (tag) {
      case 'h1': case 'h2': return `\n\n## ${kids.trim()}\n`;
      case 'h3': case 'h4': case 'h5': return `\n\n### ${kids.trim()}\n`;
      case 'strong': case 'b': return `**${kids}**`;
      case 'em': case 'i': return `*${kids}*`;
      case 'code':
        if (el.parentElement?.tagName.toLowerCase() === 'pre') return kids;
        return kids; // inline code kept as-is
      case 'pre': return `\n${kids.trim()}\n`;
      case 'br': return '\n';
      case 'p': return `\n${kids.trim()}\n`;
      case 'li': return `\n- ${kids.trim()}`;
      case 'ul': case 'ol': return `\n${kids}\n`;
      case 'div': return `\n${kids}`;
      case 'span': return kids;
      default: return kids;
    }
  }

  let md = walk(doc.body);
  // Clean up excessive newlines
  md = md.replace(/\n{3,}/g, '\n\n').trim();
  return md;
}

function handleSmartPaste(e: React.ClipboardEvent<HTMLTextAreaElement>, setValue: (v: string) => void, currentValue: string) {
  const html = e.clipboardData.getData('text/html');
  if (!html) return; // let default paste handle plain text

  e.preventDefault();
  const md = htmlToMarkdown(html);
  const ta = e.currentTarget;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const newVal = currentValue.substring(0, start) + md + currentValue.substring(end);
  setValue(newVal);
  // Restore cursor after paste
  requestAnimationFrame(() => {
    ta.selectionStart = ta.selectionEnd = start + md.length;
  });
}

// ── Question parser (paste from natural format) ─────────────
function parseQuestionsFromText(text: string, lessonId: number, startNum: number): { questions: QuizQuestion[]; options: QuizOption[][] } {
  const questions: QuizQuestion[] = [];
  const allOptions: QuizOption[][] = [];

  // Split into question blocks by numbered patterns or "Select correct code" / "Fill in the code" markers
  // Each block starts with a number+dot, "Select correct code", or "Fill in the code"
  const blocks: string[] = [];
  const lines = text.split('\n');
  let current = '';

  for (const line of lines) {
    const trimmed = line.trim();
    // New question block starts with: "1.", "2.", "Select correct code", "Fill in the code", or empty line before numbered
    if (/^\d+\.\s/.test(trimmed) || /^Select correct code/i.test(trimmed) || /^Fill in the code/i.test(trimmed)) {
      if (current.trim()) blocks.push(current.trim());
      current = trimmed + '\n';
    } else {
      current += line + '\n';
    }
  }
  if (current.trim()) blocks.push(current.trim());

  let qNum = startNum;

  for (const block of blocks) {
    // Skip section headers like "Select correct code", "Fill in the code", "Otázky"
    if (/^(Select correct code|Fill in the code|Otázky|Questions)\s*$/im.test(block.split('\n')[0])) {
      // This is just a section header, the actual questions follow — merge with next content
      continue;
    }

    const blockLines = block.split('\n');

    // Detect question type
    const hasOptions = /^[A-D]\s/m.test(block) || /^[A-D]\n/m.test(block);
    const hasCodeSnippet = block.includes('___');
    const hasCorrectMarker = block.includes('✅') || /Správna odpoveď:\s*[A-D]/i.test(block) || /Správne riešenie:/i.test(block);

    // Extract question text (first line after number, or the numbered line itself)
    let questionText = '';
    let codeSnippet = '';
    let correctAnswer = '';
    let explanation = '';
    const opts: QuizOption[] = [];

    let phase: 'question' | 'code' | 'options' | 'explanation' = 'question';

    for (const rawLine of blockLines) {
      const ln = rawLine.trim();
      if (!ln) continue;

      // Skip section headers
      if (/^(Select correct code|Fill in the code)\s*$/i.test(ln)) continue;

      // Detect "Správna odpoveď:" or "Správne riešenie:"
      if (/^Správna odpoveď:\s*(.+)/i.test(ln)) {
        const m = ln.match(/^Správna odpoveď:\s*(.+)/i);
        if (m) correctAnswer = m[1].trim();
        phase = 'explanation';
        continue;
      }
      if (/^Správne riešenie:\s*(.+)/i.test(ln)) {
        const m = ln.match(/^Správne riešenie:\s*(.+)/i);
        if (m) correctAnswer = m[1].trim();
        phase = 'explanation';
        continue;
      }

      // Detect options (A/B/C/D lines)
      const optMatch = ln.match(/^([A-D])\s+(.+)/);
      if (optMatch) {
        phase = 'options';
        const isCorrect = ln.includes('✅');
        const optText = optMatch[2].replace('✅', '').trim();
        opts.push({
          option_label: optMatch[1],
          option_text: optText,
          option_text_sk: optText,
          is_correct: isCorrect,
        });
        if (isCorrect) correctAnswer = optMatch[1];
        continue;
      }

      if (phase === 'explanation') {
        explanation += (explanation ? '\n' : '') + ln;
        continue;
      }

      if (phase === 'question') {
        // Check if this looks like code (has =, indentation, or Python keywords)
        if (ln.includes('___') || /^[a-z_]+\s*=/.test(ln) || /^\s{2,}/.test(rawLine) || /^(if|for|def|print|return)\s/.test(ln)) {
          phase = 'code';
          codeSnippet += (codeSnippet ? '\n' : '') + rawLine;
        } else {
          // Remove leading number like "1. "
          const cleaned = ln.replace(/^\d+\.\s*/, '');
          questionText += (questionText ? '\n' : '') + cleaned;
        }
        continue;
      }

      if (phase === 'code') {
        if (optMatch || /^[A-D]\s/.test(ln)) {
          phase = 'options';
        } else {
          codeSnippet += '\n' + rawLine;
          continue;
        }
      }
    }

    if (!questionText.trim()) continue;

    // Determine question type
    let questionType = 'multiple_choice';
    if (!hasOptions && (hasCodeSnippet || correctAnswer) && opts.length === 0) {
      questionType = 'fill_code';
    }

    // If correct answer not found from markers, find from ✅
    if (!correctAnswer && opts.length > 0) {
      const correct = opts.find(o => o.is_correct);
      if (correct) correctAnswer = correct.option_label;
    }

    questions.push({
      lesson_id: lessonId,
      question_number: qNum++,
      question_text: questionText.trim(),
      question_text_sk: questionText.trim(),
      question_type: questionType,
      correct_answer: correctAnswer,
      code_snippet: codeSnippet.trim() || '',
      explanation: explanation.trim(),
      explanation_sk: explanation.trim(),
      options: opts,
    });
    allOptions.push(opts);
  }

  return { questions, options: allOptions };
}

// ── Mini lesson parser ──────────────────────────────────────
interface Fact {
  title: string;
  detail: string;
}

interface MiniLesson {
  title: string;
  title_en: string;
  content: string;
  content_en: string;
  facts: Fact[];
}

function extractFacts(text: string): { cleaned: string; facts: Fact[] } {
  const facts: Fact[] = [];
  const lines = text.split('\n');
  const cleanedLines: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const factMatch = line.match(/^💡\s*(.+)$/);
    if (factMatch) {
      const title = factMatch[1].trim();
      let detail = '';
      // Collect detail lines until empty line or next 💡 or next ## or end
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('💡') && !lines[i].startsWith('## ')) {
        detail += (detail ? '\n' : '') + lines[i];
        i++;
      }
      facts.push({ title, detail: detail.trim() });
    } else {
      cleanedLines.push(line);
      i++;
    }
  }
  // Remove trailing empty lines from cleaned content
  let cleaned = cleanedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return { cleaned, facts };
}

function serializeFacts(facts: Fact[]): string {
  return facts
    .filter(f => f.title.trim())
    .map(f => `💡 ${f.title}\n${f.detail}`)
    .join('\n\n');
}

function parseMiniLessons(rawSk: string, rawEn?: string): MiniLesson[] {
  if (!rawSk || !rawSk.trim()) return [];
  const partsSk = rawSk.split(/\n\n(?=## )/);
  const partsEn = rawEn ? rawEn.split(/\n\n(?=## )/) : [];
  return partsSk
    .map((part, idx) => {
      const match = part.match(/^## (.+)\n?([\s\S]*)$/);
      if (!match) return null;
      // Extract facts from SK content
      const { cleaned, facts } = extractFacts(match[2].trim());
      // Try to extract EN content for matching index
      let contentEn = '';
      let titleEn = '';
      if (partsEn[idx]) {
        const matchEn = partsEn[idx].match(/^## (.+)\n?([\s\S]*)$/);
        if (matchEn) {
          titleEn = matchEn[1].trim();
          const enExtracted = extractFacts(matchEn[2].trim());
          contentEn = enExtracted.cleaned;
        }
      }
      return { title: match[1].trim(), title_en: titleEn, content: cleaned, content_en: contentEn, facts };
    })
    .filter(Boolean) as MiniLesson[];
}

function serializeMiniLessons(minis: MiniLesson[], lang: 'sk' | 'en' = 'sk'): string {
  return minis.map((m) => {
    const title = lang === 'en' ? (m.title_en || m.title) : m.title;
    const content = lang === 'en' ? m.content_en : m.content;
    const factsStr = serializeFacts(m.facts);
    const parts = [`## ${title}`, content];
    if (factsStr) parts.push(factsStr);
    return parts.filter(p => p).join('\n\n');
  }).join('\n\n');
}

// ── Distribute questions across sections ────────────────────
function distributeQuestions(questions: QuizQuestion[], sectionCount: number): QuizQuestion[][] {
  const sorted = [...questions].sort((a, b) => a.question_number - b.question_number);
  if (sectionCount <= 0) return [sorted];
  const result: QuizQuestion[][] = Array.from({ length: sectionCount }, () => []);
  if (sorted.length === 0) return result;
  const perSection = Math.ceil(sorted.length / sectionCount);
  sorted.forEach((q, i) => {
    const sectionIdx = Math.min(Math.floor(i / perSection), sectionCount - 1);
    result[sectionIdx].push(q);
  });
  return result;
}

function flattenAndRenumber(sectionQuestions: QuizQuestion[][]): QuizQuestion[] {
  const flat: QuizQuestion[] = [];
  let num = 1;
  for (const section of sectionQuestions) {
    for (const q of section) {
      flat.push({ ...q, question_number: num++ });
    }
  }
  return flat;
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
    paddingRight: '24px',
    background: '#1a1a1a',
    color: '#EDEDED',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 13,
    outline: 'none',
    appearance: 'none' as const,
    WebkitAppearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
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
  toolbarBtn: {
    padding: '3px 8px',
    borderRadius: 3,
    border: '1px solid #333',
    background: '#222',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
    lineHeight: '16px',
  },
};

// ── Toolbar insert helpers ──────────────────────────────────
function insertAtLineStart(
  textarea: HTMLTextAreaElement,
  prefix: string,
  setValue: (v: string) => void
) {
  const { selectionStart, value } = textarea;
  const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  setValue(newValue);
  requestAnimationFrame(() => {
    textarea.selectionStart = textarea.selectionEnd = selectionStart + prefix.length;
    textarea.focus();
  });
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  text: string,
  setValue: (v: string) => void
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const newValue = value.slice(0, selectionStart) + text + value.slice(selectionEnd);
  setValue(newValue);
  requestAnimationFrame(() => {
    textarea.selectionStart = textarea.selectionEnd = selectionStart + text.length;
    textarea.focus();
  });
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  wrapper: string,
  setValue: (v: string) => void
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.slice(selectionStart, selectionEnd);
  const newValue = value.slice(0, selectionStart) + wrapper + selected + wrapper + value.slice(selectionEnd);
  setValue(newValue);
  requestAnimationFrame(() => {
    textarea.selectionStart = selectionStart + wrapper.length;
    textarea.selectionEnd = selectionEnd + wrapper.length;
    textarea.focus();
  });
}

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
  const [sectionQuestions, setSectionQuestions] = useState<QuizQuestion[][]>([]);
  const [contentTab, setContentTab] = useState<'obsah' | 'otazky' | 'info'>('obsah');
  const [toast, setToast] = useState('');
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
      const minis = parseMiniLessons(data.learning_content_sk || '', data.learning_content || '');
      setMiniLessons(minis);
      const qs = await api({ action: 'getQuestions', lessonId: id });
      const questions = qs || [];
      setSectionQuestions(distributeQuestions(questions, minis.length));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  // ── Save lesson ──
  const saveLesson = async () => {
    if (!lesson) return;
    if (!lesson.title_sk?.trim()) {
      alert('Názov SK je prázdny.');
      return;
    }

    setLoading(true);
    showToast('Ukladám...');
    try {
      const contentSk = serializeMiniLessons(miniLessons, 'sk');
      const contentEn = serializeMiniLessons(miniLessons, 'en');
      const payload = {
        ...lesson,
        learning_content_sk: contentSk,
        learning_content: contentEn,
      };

      const saved = await api({ action: 'saveLesson', lesson: payload });
      setLesson(saved);

      // Save all questions with renumbered question_numbers
      const allQuestions = flattenAndRenumber(sectionQuestions);
      for (const q of allQuestions) {
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
        const optionsPayload = q.question_type === 'multiple_choice' ? q.options : [];
        await api({ action: 'saveQuestion', question: questionPayload, options: optionsPayload });
      }

      showToast('Uložené!');
      // Refresh sidebar
      if (selectedModuleId) {
        const ls = await api({ action: 'getLessons', moduleId: selectedModuleId });
        setLessons(ls);
      }
      // Refresh questions from DB
      if (saved.id) {
        const qs = await api({ action: 'getQuestions', lessonId: saved.id });
        const newMinis = parseMiniLessons(saved.learning_content_sk || '', saved.learning_content || '');
        setMiniLessons(newMinis);
        setSectionQuestions(distributeQuestions(qs || [], newMinis.length));
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
      setSectionQuestions([]);
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
    setSectionQuestions([]);
    setSelectedLessonId(null);
    setContentTab('obsah');
  };

  // ── Move lesson up/down (swap lesson_numbers) ──
  const moveLessonOrder = async (lessonIdx: number, dir: -1 | 1) => {
    const targetIdx = lessonIdx + dir;
    if (targetIdx < 0 || targetIdx >= lessons.length) return;
    const a = lessons[lessonIdx];
    const b = lessons[targetIdx];
    setLoading(true);
    try {
      await api({ action: 'saveLesson', lesson: { id: a.id, lesson_number: b.lesson_number } });
      await api({ action: 'saveLesson', lesson: { id: b.id, lesson_number: a.lesson_number } });
      const ls = await api({ action: 'getLessons', moduleId: selectedModuleId });
      setLessons(ls);
      showToast('Poradie zmenené');
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
    setLoading(false);
  };

  // ── Mini lesson operations ──
  const addMiniLesson = () => {
    setMiniLessons([...miniLessons, { title: 'Nova sekcia', title_en: '', content: '', content_en: '', facts: [] }]);
    setSectionQuestions([...sectionQuestions, []]);
  };
  const deleteMiniLesson = (idx: number) => {
    // Move questions from deleted section to previous section (or discard if first)
    const deletedQs = sectionQuestions[idx] || [];
    const newMinis = miniLessons.filter((_, i) => i !== idx);
    const newSQ = sectionQuestions.filter((_, i) => i !== idx);
    if (deletedQs.length > 0 && newSQ.length > 0) {
      const targetIdx = Math.max(0, idx - 1);
      newSQ[targetIdx] = [...newSQ[targetIdx], ...deletedQs];
    }
    setMiniLessons(newMinis);
    setSectionQuestions(newSQ);
  };
  const moveMiniLesson = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= miniLessons.length) return;
    const copyMinis = [...miniLessons];
    [copyMinis[idx], copyMinis[newIdx]] = [copyMinis[newIdx], copyMinis[idx]];
    setMiniLessons(copyMinis);
    const copySQ = [...sectionQuestions];
    [copySQ[idx], copySQ[newIdx]] = [copySQ[newIdx], copySQ[idx]];
    setSectionQuestions(copySQ);
  };
  const updateMiniLesson = (idx: number, field: 'title' | 'title_en' | 'content' | 'content_en', value: string) => {
    // Strip leading ## heading from content (title is separate)
    if (field === 'content' || field === 'content_en') {
      value = value.replace(/^## .+\n\n?/, '');
    }
    const copy = [...miniLessons];
    copy[idx] = { ...copy[idx], [field]: value };
    setMiniLessons(copy);
  };

  // ── Question operations (per section) ──
  const saveQuestionInSection = async (sectionIdx: number, q: QuizQuestion, opts: QuizOption[]) => {
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
      showToast('Otazka ulozena!');
      // Refresh all questions and redistribute
      if (selectedLessonId || lesson?.id) {
        const qs = await api({ action: 'getQuestions', lessonId: selectedLessonId || lesson?.id });
        setSectionQuestions(distributeQuestions(qs || [], miniLessons.length));
      }
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
    setLoading(false);
  };

  const deleteQuestionInSection = async (sectionIdx: number, qId: number) => {
    if (!confirm('Vymazať otázku?')) return;
    try {
      await api({ action: 'deleteQuestion', questionId: qId });
      showToast('Vymazané!');
      if (selectedLessonId || lesson?.id) {
        const qs = await api({ action: 'getQuestions', lessonId: selectedLessonId || lesson?.id });
        setSectionQuestions(distributeQuestions(qs || [], miniLessons.length));
      }
    } catch (e: any) {
      showToast('Chyba: ' + e.message);
    }
  };

  const startNewQuestionInSection = (sectionIdx: number) => {
    if (!lesson) return;
    const allQs = sectionQuestions.flat();
    const maxNum = allQs.reduce((m, q) => Math.max(m, q.question_number), 0);
    return {
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
    } as QuizQuestion;
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
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  style={{ ...s.select, flex: 1 }}
                  value={selectedModuleId || ''}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    setSelectedModuleId(v);
                    setSelectedLessonId(null);
                    setLesson(null);
                    setMiniLessons([]);
                    setSectionQuestions([]);
                  }}
                >
                  <option value="">-- Vyber modul --</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.module_number}. {m.title_sk || m.title}
                    </option>
                  ))}
                </select>
                <button
                  style={{ ...s.btn('#4ade80'), padding: '6px 10px', fontSize: 16, flexShrink: 0 }}
                  title="Novy modul"
                  onClick={async () => {
                    const name = prompt('Nazov noveho modulu (SK):');
                    if (!name) return;
                    const nameEn = prompt('Nazov modulu (EN):', name) || name;
                    const maxNum = modules.reduce((max, m) => Math.max(max, m.module_number), 0);
                    try {
                      await api({ action: 'saveModule', module: { module_number: maxNum + 1, title: nameEn, title_sk: name } });
                      const mods = await api({ action: 'getModules' });
                      setModules(mods);
                    } catch (e: any) { alert(e.message); }
                  }}
                >+</button>
              </div>
            </div>

            <div style={s.lessonList}>
              {lessons.map((l, idx) => (
                <div
                  key={l.id}
                  style={{ ...s.lessonItem(selectedLessonId === l.id), flexDirection: 'row' as const, alignItems: 'center', gap: 6 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 2, flexShrink: 0 }}>
                    <button
                      style={{ background: 'none', border: 'none', color: idx === 0 ? '#333' : '#666', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 10, padding: 0, lineHeight: 1 }}
                      onClick={(e) => { e.stopPropagation(); moveLessonOrder(idx, -1); }}
                      disabled={idx === 0}
                    >▲</button>
                    <button
                      style={{ background: 'none', border: 'none', color: idx === lessons.length - 1 ? '#333' : '#666', cursor: idx === lessons.length - 1 ? 'default' : 'pointer', fontSize: 10, padding: 0, lineHeight: 1 }}
                      onClick={(e) => { e.stopPropagation(); moveLessonOrder(idx, 1); }}
                      disabled={idx === lessons.length - 1}
                    >▼</button>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => loadLesson(l.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={s.lessonNum}>#{l.lesson_number}</div>
                      <div style={s.lessonTitle}>{l.title_sk || l.title || '(bez názvu)'}</div>
                    </div>
                    {l.miniTitles && l.miniTitles.length > 0 && (
                      <div style={{ fontSize: 10, color: '#555', marginTop: 4, lineHeight: 1.5, paddingLeft: 2 }}>
                        {l.miniTitles.join(' · ')}
                      </div>
                    )}
                  </div>
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
                  {(['obsah', 'info'] as const).map((t) => (
                    <button
                      key={t}
                      style={s.tab(contentTab === t)}
                      onClick={() => setContentTab(t)}
                    >
                      {t === 'obsah' ? 'Obsah & Otázky' : 'Info'}
                    </button>
                  ))}
                </div>

                {/* ═══ OBSAH & OTAZKY TAB ═══ */}
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

                    <div style={s.row}>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Úvod SK</label>
                        <textarea
                          style={s.textarea}
                          rows={4}
                          value={lesson.introduction_sk || ''}
                          onChange={(e) => updateField('introduction_sk', e.target.value)}
                          onPaste={(e) => handleSmartPaste(e, (v) => updateField('introduction_sk', v), lesson.introduction_sk || '')}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={s.label}>Úvod EN</label>
                        <textarea
                          style={s.textarea}
                          rows={4}
                          value={lesson.introduction || ''}
                          onChange={(e) => updateField('introduction', e.target.value)}
                          onPaste={(e) => handleSmartPaste(e, (v) => updateField('introduction', v), lesson.introduction || '')}
                        />
                      </div>
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
                        questions={sectionQuestions[idx] || []}
                        lessonId={lesson.id}
                        onUpdate={(f, v) => updateMiniLesson(idx, f, v)}
                        onUpdateFacts={(facts) => {
                          const copy = [...miniLessons];
                          copy[idx] = { ...copy[idx], facts };
                          setMiniLessons(copy);
                        }}
                        onDelete={() => deleteMiniLesson(idx)}
                        onMove={(dir) => moveMiniLesson(idx, dir)}
                        onSaveQuestion={(q, opts) => saveQuestionInSection(idx, q, opts)}
                        onDeleteQuestion={(qId) => deleteQuestionInSection(idx, qId)}
                        onStartNewQuestion={() => startNewQuestionInSection(idx)}
                      />
                    ))}

                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                      <button style={s.btn('#4ade80')} onClick={() => saveLesson()}>
                        Uložiť lekciu
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══ INFO TAB ═══ */}
                {contentTab === 'info' && (
                  <div>
                    <div style={s.card}>
                      <div style={s.row}>
                        <div style={{ flex: 1 }}>
                          <label style={s.label}>Cislo lekcie</label>
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
                      <h4 style={{ margin: '0 0 12px', color: '#888', fontSize: 13 }}>Doplnkovy obsah</h4>
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
                      <button style={s.btn('#4ade80')} onClick={() => saveLesson()}>
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
  questions,
  lessonId,
  onUpdate,
  onUpdateFacts,
  onDelete,
  onMove,
  onSaveQuestion,
  onDeleteQuestion,
  onStartNewQuestion,
}: {
  mini: MiniLesson;
  index: number;
  total: number;
  questions: QuizQuestion[];
  lessonId?: number;
  onUpdate: (field: 'title' | 'title_en' | 'content' | 'content_en', value: string) => void;
  onUpdateFacts: (facts: Fact[]) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void;
  onSaveQuestion: (q: QuizQuestion, opts: QuizOption[]) => void;
  onDeleteQuestion: (qId: number) => void;
  onStartNewQuestion: () => QuizQuestion | undefined;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaEnRef = useRef<HTMLTextAreaElement>(null);

  const handleToolbar = (action: 'heading' | 'bullet' | 'blank' | 'bold', lang: 'sk' | 'en' = 'sk') => {
    const ta = lang === 'en' ? textareaEnRef.current : textareaRef.current;
    if (!ta) return;
    const field = lang === 'en' ? 'content_en' : 'content';
    const setValue = (v: string) => onUpdate(field, v);

    switch (action) {
      case 'heading':
        insertAtLineStart(ta, '### ', setValue);
        break;
      case 'bullet':
        insertAtLineStart(ta, '- ', setValue);
        break;
      case 'blank':
        insertAtCursor(ta, '___', setValue);
        break;
      case 'bold':
        wrapSelection(ta, '**', setValue);
        break;
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/builder/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      const md = `\n\n![${file.name}](${json.url})\n\n`;
      const ta = textareaRef.current;
      if (ta) {
        insertAtCursor(ta, md, (v) => onUpdate('content', v));
      } else {
        onUpdate('content', mini.content + md);
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddQuestion = () => {
    const newQ = onStartNewQuestion();
    if (newQ) setEditingQuestion(newQ);
  };

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
          placeholder="Nadpis SK"
          value={mini.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        <input
          style={{ ...s.input, flex: 1, fontWeight: 500, color: '#aaa' }}
          placeholder="Nadpis EN"
          value={mini.title_en}
          onChange={(e) => onUpdate('title_en', e.target.value)}
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
        <>
          {/* SK content */}
          <label style={{ ...s.label, marginTop: 4 }}>SK</label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <button style={s.toolbarBtn} onClick={() => handleToolbar('heading', 'sk')} title="Podnadpis (### )">
              ###
            </button>
            <button style={s.toolbarBtn} onClick={() => handleToolbar('bullet', 'sk')} title="Odrazka (- )">
              -
            </button>
            <button style={s.toolbarBtn} onClick={() => handleToolbar('blank', 'sk')} title="Prazdne miesto (___)">
              ___
            </button>
            <button style={{ ...s.toolbarBtn, fontWeight: 700, fontFamily: 'inherit' }} onClick={() => handleToolbar('bold', 'sk')} title="Tucne (**B**)">
              B
            </button>
            <button
              style={{ ...s.toolbarBtn, color: uploading ? '#4ade80' : '#aaa' }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Nahrat obrazok"
            >
              {uploading ? '...' : 'IMG'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>
          <textarea
            ref={textareaRef}
            style={{ ...s.textarea, minHeight: 120 }}
            value={mini.content}
            onChange={(e) => onUpdate('content', e.target.value)}
            onPaste={(e) => handleSmartPaste(e, (v) => onUpdate('content', v), mini.content)}
          />

          {/* EN content */}
          <label style={{ ...s.label, marginTop: 8 }}>EN</label>
          <textarea
            ref={textareaEnRef}
            style={{ ...s.textarea, minHeight: 120 }}
            value={mini.content_en}
            onChange={(e) => onUpdate('content_en', e.target.value)}
            onPaste={(e) => handleSmartPaste(e, (v) => onUpdate('content_en', v), mini.content_en)}
          />

          {/* Facts */}
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                Fakty ({mini.facts.length})
              </span>
              <button
                style={s.btnSmall('#f59e0b')}
                onClick={() => onUpdateFacts([...mini.facts, { title: '', detail: '' }])}
              >
                + Fakt
              </button>
            </div>
            {mini.facts.map((fact, fi) => (
              <div key={fi} style={{ background: '#111', border: '1px solid #333', borderRadius: 6, padding: 10, marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>💡</span>
                  <input
                    style={{ ...s.input, flex: 1, fontWeight: 600 }}
                    placeholder="Nadpis faktu"
                    value={fact.title}
                    onChange={(e) => {
                      const copy = [...mini.facts];
                      copy[fi] = { ...copy[fi], title: e.target.value };
                      onUpdateFacts(copy);
                    }}
                  />
                  <button
                    style={s.btnSmall('#ef4444')}
                    onClick={() => onUpdateFacts(mini.facts.filter((_, i) => i !== fi))}
                  >
                    X
                  </button>
                </div>
                <textarea
                  style={{ ...s.textarea, minHeight: 50 }}
                  placeholder="Detail faktu..."
                  value={fact.detail}
                  onChange={(e) => {
                    const copy = [...mini.facts];
                    copy[fi] = { ...copy[fi], detail: e.target.value };
                    onUpdateFacts(copy);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Questions for this section */}
          <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#888' }}>
                Otázky ({questions.length})
              </span>
              {lessonId && (
                <button style={s.btnSmall('#4ade80')} onClick={() => setShowImport(!showImport)}>
                  {showImport ? 'Zavrieť' : '+ Pridať otázky'}
                </button>
              )}
            </div>

            {!lessonId && questions.length === 0 && (
              <div style={{ color: '#555', fontSize: 12, marginBottom: 8 }}>
                Najprv ulož lekciu, potom môžeš pridať otázky.
              </div>
            )}

            {showImport && (
              <div style={{ ...s.card, border: '1px solid #818cf8', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#818cf8', marginBottom: 8, fontWeight: 600 }}>
                  Pastni otázky v prirodzenom formáte (s A/B/C/D, ✅, Správna odpoveď:, kód atď.)
                </div>
                <textarea
                  style={{ ...s.textarea, minHeight: 150 }}
                  placeholder={'1. Otázka text...\nA odpoveď ✅\nB odpoveď\nC odpoveď\nD odpoveď\nSprávna odpoveď: A\nVysvetlenie...\n\nFill in the code\n1. Doplň kód...\ncode = ___\nSprávne riešenie: answer'}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    style={s.btn('#818cf8')}
                    onClick={() => {
                      if (!importText.trim()) return;
                      const startNum = questions.length > 0
                        ? Math.max(...questions.map(q => q.question_number)) + 1
                        : 1;
                      const { questions: parsed } = parseQuestionsFromText(importText, lessonId || 0, startNum);
                      if (parsed.length === 0) {
                        alert('Nepodarilo sa nájsť žiadne otázky v texte.');
                        return;
                      }
                      // Save each parsed question
                      (async () => {
                        for (const q of parsed) {
                          await onSaveQuestion(q, q.options || []);
                        }
                        setImportText('');
                        setShowImport(false);
                        alert('Importované ' + parsed.length + 'otázok.\n\nImportované otazky nemaju anglicky preklad. Uprav ich pred ulozenim lekcie.');
                      })();
                    }}
                  >
                    Importovať {importText.trim() ? `(${parseQuestionsFromText(importText, lessonId || 0, 1).questions.length} otázok)` : ''}
                  </button>
                  <button style={s.btn('#333')} onClick={() => { setImportText(''); setShowImport(false); }}>
                    Zrušiť
                  </button>
                </div>
              </div>
            )}

            {questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onEdit={() => setEditingQuestion({ ...q })}
                onDelete={() => q.id && onDeleteQuestion(q.id)}
              />
            ))}

            {editingQuestion && (
              <QuestionEditor
                question={editingQuestion}
                onSave={(q, opts) => {
                  onSaveQuestion(q, opts);
                  setEditingQuestion(null);
                }}
                onCancel={() => setEditingQuestion(null)}
              />
            )}
          </div>
        </>
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
      ? 'Dopln kod'
      : question.code_snippet
        ? 'Vyber kod'
        : 'Otazka';
  const typeColor =
    question.question_type === 'fill_code' ? '#f59e0b' : question.code_snippet ? '#818cf8' : '#4ade80';

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={s.badge(typeColor)}>{typeLabel}</span>
        <span style={{ fontSize: 11, color: '#666' }}>#{question.question_number}</span>
        <div style={{ flex: 1 }} />
        <button style={s.btnSmall('#333')} onClick={onEdit}>
          Upravit
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
          Odpoved: {question.correct_answer}
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
  const codeSnippetRef = useRef<HTMLTextAreaElement>(null);

  const typeOptions = [
    { value: 'mcq', label: 'Otazka (MCQ)' },
    { value: 'mcq_code', label: 'Vyber kod (MCQ + kod)' },
    { value: 'fill_code', label: 'Dopln kod' },
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

  const handleInsertBlank = () => {
    const ta = codeSnippetRef.current;
    if (!ta) return;
    insertAtCursor(ta, '___', (v) => setQ({ ...q, code_snippet: v }));
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
          <label style={s.label}>Cislo</label>
          <input
            style={s.input}
            type="number"
            value={q.question_number}
            onChange={(e) => setQ({ ...q, question_number: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div style={s.fieldGroup}>
        <label style={s.label}>Otazka SK</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.question_text_sk || ''}
          onChange={(e) => setQ({ ...q, question_text_sk: e.target.value })}
        />
      </div>
      <div style={s.fieldGroup}>
        <label style={s.label}>Otazka EN</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.question_text || ''}
          onChange={(e) => setQ({ ...q, question_text: e.target.value })}
        />
      </div>

      {showCode && (
        <div style={s.fieldGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <label style={{ ...s.label, marginBottom: 0 }}>Code snippet</label>
            <button
              style={s.toolbarBtn}
              onClick={handleInsertBlank}
              title="Vloz ___ na poziciu kurzora"
            >
              Vloz ___
            </button>
          </div>
          <textarea
            ref={codeSnippetRef}
            style={s.codebox}
            rows={4}
            value={q.code_snippet || ''}
            onChange={(e) => setQ({ ...q, code_snippet: e.target.value })}
          />
        </div>
      )}

      {showOptions && (
        <div style={s.fieldGroup}>
          <label style={s.label}>Moznosti</label>
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
          <label style={s.label}>Spravna odpoved</label>
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
      <div style={s.fieldGroup}>
        <label style={s.label}>Vysvetlenie EN</label>
        <textarea
          style={s.textarea}
          rows={2}
          value={q.explanation || ''}
          onChange={(e) => setQ({ ...q, explanation: e.target.value })}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button style={s.btn('#4ade80')} onClick={() => {
          // Validate EN fields
          const errs: string[] = [];
          if (!q.question_text?.trim()) errs.push('Otazka EN je prazdna.');
          if (!q.question_text_sk?.trim()) errs.push('Otazka SK je prazdna.');
          if (q.explanation_sk?.trim() && !q.explanation?.trim()) errs.push('Vysvetlenie EN je prazdne.');
          if (q.question_type === 'multiple_choice') {
            for (const o of opts) {
              if (o.option_text_sk?.trim() && !o.option_text?.trim()) {
                errs.push(`Moznost ${o.option_label} nema EN text.`);
              }
            }
          }
          if (errs.length > 0) {
            alert('Validácia otázky zlyhala:\n\n' + errs.join('\n'));
            return;
          }
          onSave(q, opts);
        }}>
          Uložiť otázku
        </button>
        <button style={s.btn('#333')} onClick={onCancel}>
          Zrušiť
        </button>
      </div>
    </div>
  );
}
