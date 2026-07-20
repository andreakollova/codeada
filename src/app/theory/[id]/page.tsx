'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchLesson, fetchQuizForLesson, DbLesson, DbQuizQuestion } from '@/lib/curriculum-api';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore, t, tArray } from '@/store/localeStore';
import { s } from '@/data/strings';
import Byte from '@/components/Byte';
import { cosmeticItems } from '@/data/cosmetics';
import { X, Heart, ArrowRight, BookOpen, Lightbulb, Globe, ListChecks, Sparkles, Check, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

import { Coffee, Droplets, Zap as ZapIcon, CupSoda, GlassWater } from 'lucide-react';
import Paywall, { useSubscription } from '@/components/Paywall';
type Phase = 'loading' | 'coffee' | 'intro' | 'learning' | 'facts' | 'real_world' | 'takeaways' | 'quiz' | 'done';

const THEORY_SECTIONS: { key: keyof DbLesson; phase: Phase; icon: any; label: string; labelSk: string }[] = [
  { key: 'introduction', phase: 'intro', icon: BookOpen, label: 'Introduction', labelSk: 'Úvod' },
  { key: 'learning_content', phase: 'learning', icon: Lightbulb, label: 'Learning', labelSk: 'Učivo' },
  { key: 'interesting_facts', phase: 'facts', icon: Sparkles, label: 'Fun Facts', labelSk: 'Zaujímavosti' },
  { key: 'real_world', phase: 'real_world', icon: Globe, label: 'Real World', labelSk: 'Reálny svet' },
  { key: 'key_takeaways', phase: 'takeaways', icon: ListChecks, label: 'Key Takeaways', labelSk: 'Zhrnutie' },
];

export default function TheoryLessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { hearts, loseHeart, completeLesson, setByteMood, byteMood, equipment, equip, addCoffee, coffees, favDrink } = useUserStore();
  const { locale } = useLocaleStore();
  const { needsUpgrade } = useSubscription();

  const [lesson, setLesson] = useState<DbLesson | null>(null);
  const [quiz, setQuiz] = useState<DbQuizQuestion[]>([]);
  const [phase, setPhase] = useState<Phase>('loading');
  const [sectionIndex, setSectionIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  // Safe string helper - ensures no objects reach React render
  const safe = (v: unknown): string => (v == null ? '' : typeof v === 'string' ? v : String(v));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [reward, setReward] = useState<string | null>(null);
  const [reelUrl, setReelUrl] = useState<string | null>(null);
  const [writeCodeValue, setWriteCodeValue] = useState('');
  const [writeCodeState, setWriteCodeState] = useState<'editing' | 'correct' | 'wrong'>('editing');
  const [showWriteCodeAnswer, setShowWriteCodeAnswer] = useState(false);

  // Initialize write_code editor with starter code when question changes
  useEffect(() => {
    if (quiz.length > 0 && quiz[quizIndex]?.question_type === 'write_code') {
      setWriteCodeValue(quiz[quizIndex].code_snippet || '');
    }
  }, [quizIndex, quiz]);

  useEffect(() => {
    const idStr = Array.isArray(id) ? id[0] : id;
    if (!idStr) return;
    const numId = parseInt(idStr);
    if (isNaN(numId)) return;
    Promise.all([fetchLesson(numId), fetchQuizForLesson(numId)])
      .then(([l, q]) => {
        if (l) {
          setLesson(l);
          // Shuffle quiz, put write_code at end, limit to ~8 questions
          const allQ = q || [];
          const mcq = allQ.filter(x => x.question_type !== 'write_code').sort(() => Math.random() - 0.5);
          const write = allQ.filter(x => x.question_type === 'write_code').sort(() => Math.random() - 0.5);
          const maxMcq = Math.min(mcq.length, 6);
          const maxWrite = Math.min(write.length, 2);
          setQuiz([...mcq.slice(0, maxMcq), ...write.slice(0, maxWrite)]);
          // Show coffee screen only for first lesson of the day
          const today = new Date().toDateString();
          const lastCoffee = localStorage.getItem('coduy-last-coffee');
          if (lastCoffee === today) {
            setPhase('intro');
          } else {
            setPhase('coffee');
          }
          setByteMood('happy');
        }
      })
      .catch(err => {
        console.error('Failed to load lesson:', err);
      });

    // Fetch latest reel video for this lesson
    fetch('https://zjyolgkakxuaegpvhimy.supabase.co/storage/v1/object/public/ig-media/tracking/reels.json')
      .then(r => r.json())
      .then((reels: any[]) => {
        const match = reels
          .filter((r: any) => r.lessonId === numId && r.lang === locale && r.videoUrl)
          .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        if (match.length > 0) setReelUrl(match[0].videoUrl);
      })
      .catch(() => {});
  }, [id, locale]);

  // Paywall: after 5 free lessons, show upgrade prompt
  if (needsUpgrade) {
    return <Paywall />;
  }

  if (phase === 'loading' || !lesson) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <p style={{ color: '#888', fontWeight: 700 }}>{s('loading', locale)}</p>
        </motion.div>
      </div>
    );
  }

  // Drink intro screen
  if (phase === 'coffee') {
    const readTime = Math.max(3, Math.round((lesson.learning_content?.length || 500) / 800));
    const drinkMap = {
      coffee: { Icon: Coffee, en: 'Grab your coffee', sk: 'Daj si kávičku', counterEn: 'coffees', counterSk: ['káva', 'kávy', 'káv'] },
      tea: { Icon: Coffee, en: 'Make yourself some tea', sk: 'Prichystaj si čaj', counterEn: 'teas', counterSk: ['čaj', 'čaje', 'čajov'] },
      energy: { Icon: ZapIcon, en: 'Grab your energy drink', sk: 'Otvor si energeťák', counterEn: 'energy drinks', counterSk: ['energiťák', 'energiťáky', 'energiťákov'] },
      juice: { Icon: CupSoda, en: 'Pour yourself some juice', sk: 'Nalej si džúsik', counterEn: 'juices', counterSk: ['džús', 'džúsy', 'džúsov'] },
      water: { Icon: GlassWater, en: 'Pour a glass of water', sk: 'Nalej si pohárik vody', counterEn: 'glasses', counterSk: ['pohár', 'poháre', 'pohárov'] },
    };
    const d = drinkMap[favDrink || 'coffee'];
    const counterSk = coffees === 1 ? d.counterSk[0] : coffees < 5 ? d.counterSk[1] : d.counterSk[2];

    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center', maxWidth: 360 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ marginBottom: 20, display: 'flex', justifyContent: 'center' }}
          >
            <d.Icon size={48} color="#fff" strokeWidth={1.5} />
          </motion.div>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 8 }}>
            {locale === 'sk' ? d.sk : d.en}
          </h2>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 6 }}>
            {(() => {
              if (locale !== 'sk') return `Take ${readTime} minutes and enjoy this read.`;
              const m = readTime === 1 ? 'minútu' : readTime <= 4 ? 'minúty' : 'minút';
              return [
                `Daj si ${readTime} ${m} pre seba a prečítaj si toto.`,
                `${readTime} ${m}, ktoré ti rozšíria obzory.`,
                `Pohodlne sa usaď a prečítaj si toto za ${readTime} ${m}.`,
                `Sadni si na ${readTime} ${m} a zisti, ako to funguje.`,
              ][Math.floor(Math.random() * 4)];
            })()}
          </p>
          <p style={{ fontSize: 12, color: '#555', marginBottom: 28 }}>
            {safe(t(lesson, 'title', locale))}
          </p>
          <motion.button
            onClick={() => { addCoffee(); localStorage.setItem('coduy-last-coffee', new Date().toDateString()); setPhase('intro'); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '14px 40px', borderRadius: 12, background: '#fff', color: '#000', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}
          >
            {locale === 'sk' ? 'Poďme na to' : "Let's go"}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Build list of sections that have content
  const sections = THEORY_SECTIONS.filter(sec => {
    try {
      const val = lesson[sec.key as keyof typeof lesson];
      if (val == null) return false;
      if (Array.isArray(val)) return val.length > 0;
      return String(val).trim().length > 0;
    } catch { return false; }
  });

  const totalSteps = sections.length + quiz.length;
  const currentStep = phase === 'quiz' || phase === 'done'
    ? sections.length + quizIndex
    : sectionIndex;
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  const handleNextSection = () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (sectionIndex + 1 < sections.length) {
      setSectionIndex(i => i + 1);
      setPhase(sections[sectionIndex + 1].phase);
    } else {
      // Move to quiz
      if (quiz.length > 0) {
        setQuizIndex(0);
        setPhase('quiz');
      } else {
        finishLesson();
      }
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (answerState !== 'idle') return;
    setSelectedAnswer(answer);
    const q = quiz[quizIndex];
    // For true_false: answer is "T"/"F", correct_answer is "True"/"False"
    // For mcq: answer is "A"/"B"/"C"/"D", correct_answer is the same
    const isCorrect = q.question_type === 'true_false'
      ? (answer === 'T' && q.correct_answer === 'True') || (answer === 'F' && q.correct_answer === 'False')
      : answer === q.correct_answer;
    if (isCorrect) {
      setAnswerState('correct');
      setScore(s => s + 1);
      setByteMood('celebrating');
      setTimeout(() => setByteMood('happy'), 1500);
    } else {
      setAnswerState('wrong');
      setByteMood('worried');
      loseHeart();
      setTimeout(() => setByteMood('happy'), 1500);
    }
  };

  const handleQuizNext = () => {
    setSelectedAnswer(null);
    setAnswerState('idle');
    setWriteCodeValue('');
    setWriteCodeState('editing');
    setShowWriteCodeAnswer(false);
    if (quizIndex + 1 < quiz.length) {
      setQuizIndex(i => i + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = () => {
    const lessonKey = `theory-${lesson.id}`;
    const xp = score * 10 + sections.length * 5;
    const earned = completeLesson(lessonKey, xp);
    setReward(earned);
    setPhase('done');
  };

  // Render current section content
  const renderTheorySection = () => {
    const sec = sections[sectionIndex];
    if (!sec) return null;
    const Icon = sec.icon;

    // Pick localized content - ensure it's always string or string[]
    let content: string | string[];
    if (sec.key === 'key_takeaways') {
      content = tArray(lesson, sec.key, locale);
    } else {
      const raw = t(lesson, sec.key as string, locale);
      content = typeof raw === 'string' ? raw : String(raw ?? '');
    }

    return (
      <motion.div
        key={sec.phase}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon size={14} color="#555" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {locale === 'sk' ? sec.labelSk : sec.label}
          </span>
        </div>

        {/* Reel video - shown in intro section */}
        {sec.phase === 'intro' && reelUrl && (
          <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #1a1a1a', background: '#000' }}>
            <video
              src={reelUrl}
              controls
              playsInline
              preload="metadata"
              style={{ width: '100%', display: 'block', maxHeight: 400, objectFit: 'contain', background: '#000' }}
              poster=""
            />
            <div style={{ padding: '8px 12px', background: '#0a0a0a', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {locale === 'sk' ? 'Coduy Reel' : 'Coduy Reel'}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        {Array.isArray(content) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(content as string[]).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <Check size={12} color="#000" strokeWidth={3} />
                </div>
                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, margin: 0 }}>{safe(item)}</p>
              </div>
            ))}
          </div>
        ) : sec.phase === 'facts' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {formatFacts(String(content))}
          </div>
        ) : (
          <div style={{ fontSize: 15, color: '#b0b0b0', lineHeight: 1.9 }}>
            {formatContent(String(content))}
          </div>
        )}

        <motion.button
          onClick={handleNextSection}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#EDEDED', color: '#0F0F0F', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, border: 'none', cursor: 'pointer' }}
        >
          {sectionIndex + 1 < sections.length
            ? s('continueBtn', locale)
            : quiz.length > 0
              ? s('startQuiz', locale)
              : s('finish', locale)}
          <ArrowRight size={16} />
        </motion.button>
        {sectionIndex > 0 && (
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              document.body.scrollTop = 0;
              setSectionIndex(i => i - 1);
              setPhase(sections[sectionIndex - 1].phase);
            }}
            style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', marginTop: 10, fontWeight: 500 }}
          >
            {locale === 'sk' ? 'Späť' : 'Back'}
          </button>
        )}
      </motion.div>
    );
  };

  // Normalize whitespace for write_code comparison
  const normalizeCode = (s: string) => s.replace(/\s+/g, ' ').trim();

  const handleWriteCodeCheck = () => {
    const q = quiz[quizIndex];
    if (!q) return;
    const isCorrect = normalizeCode(writeCodeValue) === normalizeCode(q.correct_answer);
    if (isCorrect) {
      setWriteCodeState('correct');
      setAnswerState('correct');
      setScore(s => s + 1);
      setByteMood('celebrating');
      setTimeout(() => setByteMood('happy'), 1500);
    } else {
      setWriteCodeState('wrong');
    }
  };

  const handleWriteCodeShowAnswer = () => {
    setShowWriteCodeAnswer(true);
    setWriteCodeState('correct'); // allow proceeding
    setAnswerState('wrong');
    setByteMood('worried');
    loseHeart();
    setTimeout(() => setByteMood('happy'), 1500);
  };

  const handleWriteCodeTryAgain = () => {
    setWriteCodeState('editing');
  };

  // Render write_code quiz question
  const renderWriteCode = () => {
    const q = quiz[quizIndex];
    if (!q) return null;

    return (
      <motion.div
        key={`quiz-wc-${quizIndex}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {`${s('questionOf', locale)} ${quizIndex + 1} ${s('of', locale)} ${quiz.length}`}
          </span>
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#EDEDED', lineHeight: 1.4 }}>
          {safe(t(q, 'question_text', locale))}
        </h2>

        {/* Code snippet (readonly) + input for missing line */}
        {(() => {
          const snippet = q.code_snippet || '';
          const lines = snippet.split('\n');
          const todoIdx = lines.findIndex((l: string) => l.includes('# TODO') || l.includes('___'));
          const beforeLines = todoIdx >= 0 ? lines.slice(0, todoIdx) : lines;
          const afterLines = todoIdx >= 0 ? lines.slice(todoIdx + 1) : [];
          const borderColor = writeCodeState === 'correct' ? 'rgba(74,222,128,0.5)' : writeCodeState === 'wrong' ? 'rgba(255,80,80,0.3)' : '#1a1a1a';

          return (
            <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
              {/* Readonly code before TODO */}
              {beforeLines.length > 0 && (
                <pre style={{ background: '#111', padding: '12px 16px 4px', margin: 0, fontSize: 13, color: '#888', fontFamily: 'JetBrains Mono, Fira Code, monospace', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {beforeLines.join('\n')}
                </pre>
              )}
              {/* Editable input for the missing line */}
              <div style={{ background: '#111', padding: '4px 16px' }}>
                <input
                  value={writeCodeValue}
                  onChange={e => { if (writeCodeState === 'editing') setWriteCodeValue(e.target.value); }}
                  placeholder={locale === 'sk' ? 'Napíš chýbajúci kód...' : 'Type the missing code...'}
                  disabled={writeCodeState === 'correct'}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 8,
                    background: writeCodeState === 'correct' ? 'rgba(74,222,128,0.08)' : '#0a0a0a',
                    border: `1.5px solid ${writeCodeState === 'correct' ? 'rgba(74,222,128,0.4)' : writeCodeState === 'wrong' ? 'rgba(255,80,80,0.3)' : '#222'}`,
                    color: writeCodeState === 'correct' ? '#4ade80' : '#fff',
                    fontSize: 14, fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              {/* Readonly code after TODO */}
              {afterLines.length > 0 && (
                <pre style={{ background: '#111', padding: '4px 16px 12px', margin: 0, fontSize: 13, color: '#888', fontFamily: 'JetBrains Mono, Fira Code, monospace', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {afterLines.join('\n')}
                </pre>
              )}
            </div>
          );
        })()}

        {/* Action buttons based on state */}
        {writeCodeState === 'editing' && (
          <motion.button
            onClick={handleWriteCodeCheck}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#EDEDED', color: '#0F0F0F', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', cursor: 'pointer' }}
          >
            {locale === 'sk' ? 'Skontrolovať' : 'Check'}
            <Check size={16} />
          </motion.button>
        )}

        {writeCodeState === 'wrong' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(255,80,80,0.05)',
              border: '1px solid rgba(255,80,80,0.15)',
            }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#ff8080', margin: 0 }}>
                {locale === 'sk' ? 'Nie celkom správne' : 'Not quite right'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                onClick={handleWriteCodeTryAgain}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#161616', color: '#EDEDED', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
              >
                {locale === 'sk' ? 'Skúsiť znova' : 'Try again'}
              </motion.button>
              <motion.button
                onClick={handleWriteCodeShowAnswer}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1, padding: '14px', borderRadius: 12, background: '#161616', color: '#888', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
              >
                <Eye size={14} />
                {locale === 'sk' ? 'Ukázať odpoveď' : 'Show answer'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {writeCodeState === 'correct' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {showWriteCodeAnswer ? (
              <>
                <div style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'rgba(255,80,80,0.05)',
                  border: '1px solid rgba(255,80,80,0.15)',
                }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#ff8080', margin: '0 0 8px' }}>
                    {locale === 'sk' ? 'Správna odpoveď:' : 'Correct answer:'}
                  </p>
                  <pre style={{ background: '#0A0A0A', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: '#4ade80', overflow: 'auto', lineHeight: 1.7, margin: 0, fontFamily: 'JetBrains Mono, Fira Code, monospace' }}>
                    {safe(q.correct_answer)}
                  </pre>
                </div>
              </>
            ) : (
              <div style={{
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(74,222,128,0.06)',
                border: '1px solid rgba(74,222,128,0.25)',
              }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: '#4ade80', margin: 0 }}>
                  {s('correct', locale)}
                </p>
              </div>
            )}
            <motion.button
              onClick={handleQuizNext}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#EDEDED', color: '#0F0F0F', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', cursor: 'pointer' }}
            >
              {quizIndex + 1 < quiz.length
                ? s('nextQuestion', locale)
                : s('finish', locale)}
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Render quiz question
  const renderQuiz = () => {
    const q = quiz[quizIndex];
    if (!q) return null;

    // Delegate write_code questions to dedicated renderer
    if (q.question_type === 'write_code') return renderWriteCode();

    // Build options list
    let options: { label: string; text: string }[];
    if (q.question_type === 'true_false') {
      options = [
        { label: 'T', text: s('trueLbl', locale) },
        { label: 'F', text: s('falseLbl', locale) },
      ];
    } else {
      options = q.options
        .sort((a, b) => a.option_label.localeCompare(b.option_label))
        .map(o => ({ label: o.option_label, text: t(o, 'option_text', locale) }));
    }

    const correctLabel = q.question_type === 'true_false'
      ? (q.correct_answer === 'True' ? 'T' : 'F')
      : q.correct_answer;

    return (
      <motion.div
        key={`quiz-${quizIndex}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.25 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {`${s('questionOf', locale)} ${quizIndex + 1} ${s('of', locale)} ${quiz.length}`}
          </span>
        </div>

        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#EDEDED', lineHeight: 1.4 }}>
          {safe(t(q, 'question_text', locale))}
        </h2>

        {q.code_snippet && (
          <pre style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#EDEDED', overflow: 'auto', lineHeight: 1.7 }}>
            {safe(q.code_snippet)}
          </pre>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(opt => {
            const sel = selectedAnswer === opt.label;
            const isCorrect = opt.label === correctLabel;
            const showCorrect = answerState !== 'idle' && isCorrect;
            const showWrong = answerState === 'wrong' && sel;

            return (
              <motion.button
                key={opt.label}
                onClick={() => handleQuizAnswer(opt.label)}
                animate={showWrong ? { x: [-5, 5, -4, 4, -2, 2, 0] } : {}}
                transition={{ duration: 0.35 }}
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12, textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: showCorrect ? 'rgba(74,222,128,0.08)' : showWrong ? 'rgba(255,80,80,0.06)' : '#161616',
                  border: `1px solid ${showCorrect ? 'rgba(74,222,128,0.5)' : showWrong ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: showCorrect ? '#4ade80' : showWrong ? '#ff9090' : '#A0A0A0',
                  fontSize: 14, fontFamily: 'inherit',
                  cursor: answerState !== 'idle' ? 'default' : 'pointer',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  border: `1.5px solid ${showCorrect ? '#4ade80' : showWrong ? '#ff6060' : 'rgba(255,255,255,0.12)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: showCorrect ? '#4ade80' : showWrong ? 'rgba(255,80,80,0.15)' : 'transparent',
                  fontWeight: 700, fontSize: 11,
                  color: showCorrect ? '#052e16' : showWrong ? '#ff6060' : '#555',
                }}>
                  {showCorrect ? <Check size={12} color="#052e16" /> : showWrong ? <X size={12} color="#ff6060" /> : opt.label}
                </div>
                {safe(opt.text)}
              </motion.button>
            );
          })}
        </div>

        {/* Continue after answer */}
        <AnimatePresence>
          {answerState !== 'idle' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{
                padding: '12px 16px', borderRadius: 12, marginBottom: 8,
                background: answerState === 'correct' ? 'rgba(74,222,128,0.06)' : 'rgba(255,80,80,0.05)',
                border: `1px solid ${answerState === 'correct' ? 'rgba(74,222,128,0.25)' : 'rgba(255,80,80,0.15)'}`,
              }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: answerState === 'correct' ? '#4ade80' : '#ff8080', margin: 0 }}>
                  {answerState === 'correct'
                    ? s('correct', locale)
                    : s('notQuite', locale)}
                </p>
                {(() => {
                  const q = quiz[quizIndex];
                  const correctOpt = options.find(o => o.label === correctLabel);
                  if (!correctOpt) return null;

                  // Use DB explanation if available, otherwise generate generic one
                  const dbExpl = locale === 'sk' ? (q as any).explanation_sk : (q as any).explanation;
                  let explanation = dbExpl || '';
                  if (!explanation) {
                    if (q.question_type === 'true_false') {
                      explanation = correctLabel === 'T'
                        ? (locale === 'sk' ? 'Toto tvrdenie je pravdivé.' : 'This statement is true.')
                        : (locale === 'sk' ? 'Toto tvrdenie je nepravdivé.' : 'This statement is false.');
                    } else if (q.question_type === 'fill_code' && q.code_snippet) {
                      const filled = q.code_snippet.replace('___', correctOpt.text);
                      explanation = locale === 'sk'
                        ? `Správny kód je: ${filled}`
                        : `The correct code is: ${filled}`;
                    }
                  }

                  return (
                    <div style={{ margin: '8px 0 0' }}>
                      <p style={{ fontSize: 13, color: '#bbb', margin: '0 0 4px', lineHeight: 1.6 }}>
                        <strong style={{ color: '#fff' }}>{safe(correctOpt.text)}</strong>
                        {' - '}
                        <span style={{ color: '#888' }}>{explanation}</span>
                      </p>
                    </div>
                  );
                })()}
              </div>
              <motion.button
                onClick={handleQuizNext}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#EDEDED', color: '#0F0F0F', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 'none', cursor: 'pointer' }}
              >
                {quizIndex + 1 < quiz.length
                  ? s('nextQuestion', locale)
                  : s('finish', locale)}
                <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Done screen
  if (phase === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Byte mood="celebrating" size={100} equipment={equipment} />
        <h1 style={{ fontWeight: 800, fontSize: 28, color: '#fff', marginTop: 24, textAlign: 'center' }}>
          {s('lessonComplete', locale)}
        </h1>
        <p style={{ color: '#888', fontSize: 15, marginTop: 8, textAlign: 'center' }}>
          {safe(t(lesson, 'title', locale))}
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>{score}/{quiz.length}</p>
            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{s('quizScore', locale)}</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: 24, color: '#fff', margin: 0 }}>{score * 10 + sections.length * 5}</p>
            <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{s('xpEarned', locale)}</p>
          </div>
        </div>
        {reward && (() => {
          const item = cosmeticItems.find(c => c.id === reward);
          const slot = item?.type as keyof typeof equipment | undefined;
          // Preview equipment with new item
          const previewEquip = slot ? { ...equipment, [slot]: reward } : equipment;
          const rarityColors: Record<string, string> = { common: '#888', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b', mythic: '#ff3366' };
          const color = rarityColors[item?.rarity || 'common'] || '#888';
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              style={{ marginTop: 28, padding: 24, borderRadius: 16, background: '#111', border: `1px solid ${color}33`, textAlign: 'center', minWidth: 240 }}
            >
              <p style={{ fontSize: 11, color: '#888', margin: '0 0 12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {s('newWardrobeItem', locale)}
              </p>
              <Byte mood="celebrating" size={80} equipment={previewEquip} />
              <p style={{ fontSize: 17, color: '#fff', fontWeight: 800, margin: '12px 0 4px' }}>
                {item?.name || reward}
              </p>
              <p style={{ fontSize: 11, color, fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {item?.rarity}
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <motion.button
                  onClick={() => { if (slot) equip(slot, reward); router.push('/'); }}
                  whileTap={{ scale: 0.96 }}
                  style={{ padding: '10px 20px', borderRadius: 10, background: '#fff', color: '#000', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  {locale === 'sk' ? 'Nasadiť' : 'Equip now'}
                </motion.button>
                <motion.button
                  onClick={() => router.push('/')}
                  whileTap={{ scale: 0.96 }}
                  style={{ padding: '10px 20px', borderRadius: 10, background: '#222', color: '#888', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  {locale === 'sk' ? 'Neskôr' : 'Later'}
                </motion.button>
              </div>
            </motion.div>
          );
        })()}
        {!reward && (
          <motion.button
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ marginTop: 24, padding: '14px 40px', borderRadius: 12, background: '#fff', color: '#000', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}
          >
            {s('backHome', locale)}
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px', paddingTop: 'max(12px, 50px)', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ color: '#777', cursor: 'pointer', padding: 4, background: 'none', border: 'none' }}>
            <X size={20} />
          </button>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#111', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: '#fff', borderRadius: 2 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} size={14} fill={i < hearts ? '#fff' : 'none'} color={i < hearts ? '#fff' : '#2a2a2a'} />
            ))}
          </div>
        </div>
      </div>

      {/* Lesson title */}
      <div style={{ maxWidth: 520, margin: '0 auto', width: '100%', padding: '16px 20px 4px' }}>
        <p style={{ fontSize: 11, color: '#777', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          {safe(t(lesson, 'title', locale))}
        </p>
      </div>

      {/* Byte */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 8 }}>
        <Byte mood={byteMood} size={64} equipment={equipment} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', padding: '0 20px 120px' }}>
        <AnimatePresence mode="wait">
          {phase === 'quiz' ? renderQuiz() : renderTheorySection()}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Split content into paragraphs with basic formatting */
function isCodeLine(line: string): boolean {
  const t = line.trimStart();
  if (line.startsWith('  ') || line.startsWith('\t')) return true;
  if (/^(import |from |def |class |if |elif |else:|for |while |return |print\(|try:|except|finally:|raise |with |async |await |const |let |var |function |export |del |assert |yield |lambda )/.test(t)) return true;
  if (/^[a-zA-Z_]\w*\s*[=(]/.test(t) && (t.includes('(') || t.includes('=')) && !t.endsWith('.') && t.length < 120) return true;
  if (/^[a-zA-Z_]\w*(\s*,\s*[a-zA-Z_]\w*)+\s*=/.test(t)) return true; // a, b = 5, 10
  if (/^(#|\/\/)/.test(t)) return true;
  if (/^\w+\.\w+\(/.test(t)) return true;
  if (/^(print|len|type|str|int|float|list|dict|set|tuple|range|input|open|sorted|map|filter)\s*\(/.test(t)) return true;
  return false;
}

/** Render inline markdown: **bold** and `code` */
function renderInline(text: string, keyBase: string = 'il'): React.ReactNode {
  if (!text.includes('**') && !text.includes('`')) return text;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyBase}-${i}`} style={{ color: '#EDEDED', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${keyBase}-${i}`} style={{ background: '#1a1a1a', padding: '2px 6px', borderRadius: 4, fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: '#4ade80' }}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function formatContent(text: string) {
  if (!text) return null;

  // First pass: handle markdown ``` code blocks
  // Split by ``` and alternate between text and code
  const parts = text.split(/```(?:python|py|javascript|js|sql|html|css|tsx?|json|bash|sh)?\s*\n?/);
  const result: React.ReactNode[] = [];
  let keyCounter = 0;

  for (let p = 0; p < parts.length; p++) {
    if (p % 2 === 1) {
      // Code block (between ```)
      const code = parts[p].trim();
      if (code) {
        result.push(
          <pre key={`code-${keyCounter++}`} style={{
            background: '#111', border: '1px solid #1a1a1a', borderRadius: 10,
            padding: '14px 16px', fontSize: 13, color: '#ccc', lineHeight: 1.7,
            overflow: 'auto', marginBottom: 16, fontFamily: 'JetBrains Mono, Fira Code, monospace',
            whiteSpace: 'pre-wrap',
          }}>
            {code}
          </pre>
        );
      }
      continue;
    }

    // Text block - process paragraphs
    const blocks = parts[p].split('\n\n');

  for (let i = 0; i < blocks.length; i++) {
    const trimmed = blocks[i].trim();
    if (!trimmed) continue;

    // Skip GPT meta-lines like 'Lekcia "X" (Modul N: Y)' or 'Aktuálny obsah učenia'
    if (/^Lekcia\s+[""].*Modul\s+\d/i.test(trimmed)) continue;
    if (/^Lesson\s+[""].*Module\s+\d/i.test(trimmed)) continue;
    if (/^Aktuálny obsah učenia$/i.test(trimmed)) continue;
    if (/^Current learning content$/i.test(trimmed)) continue;
    if (/^TEXT:?$/i.test(trimmed)) continue;

    const lines = trimmed.split('\n');

    // Heading: single short line, no period, not code, no = sign (code assignment)
    if (lines.length === 1 && trimmed.length < 60 && !trimmed.endsWith('.') && !trimmed.startsWith('-') && !trimmed.startsWith('#') && !trimmed.includes(' = ') && !trimmed.includes('(') && !isCodeLine(trimmed)) {
      // Strip trailing colon for cleaner headings
      const heading = trimmed.endsWith(':') ? trimmed.slice(0, -1) : trimmed;
      result.push(
        <h3 key={`h-${keyCounter++}`} style={{ fontWeight: 700, fontSize: 17, color: '#EDEDED', marginTop: i > 0 ? 24 : 0, marginBottom: 10 }}>
          {heading}
        </h3>
      );
      continue;
    }

    // Code block: most lines look like code
    const codeLines = lines.filter(l => isCodeLine(l) || l.trim() === '');
    if (codeLines.length > lines.length * 0.5 && lines.some(l => isCodeLine(l))) {
      result.push(
        <pre key={`pre-${keyCounter++}`} style={{
          background: '#111', border: '1px solid #1a1a1a', borderRadius: 10,
          padding: '14px 16px', fontSize: 13, color: '#ccc', lineHeight: 1.7,
          overflow: 'auto', marginBottom: 16, fontFamily: 'JetBrains Mono, Fira Code, monospace',
          whiteSpace: 'pre-wrap',
        }}>
          {trimmed}
        </pre>
      );
      continue;
    }

    // Check if block contains bullet points (lines starting with "- ")
    const bulletLines = lines.filter(l => l.trimStart().startsWith('- '));
    if (bulletLines.length >= 2) {
      const nonBulletLines = lines.filter(l => !l.trimStart().startsWith('- '));
      const intro = nonBulletLines.filter(l => l.trim()).join(' ');
      result.push(
        <div key={`bl-${keyCounter++}`} style={{ marginBottom: 16 }}>
          {intro && <p style={{ margin: 0, marginBottom: 8 }}>{renderInline(intro, `bli-${keyCounter}`)}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {bulletLines.map((bl, bi) => (
              <div key={bi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: 14, lineHeight: 1.7, flexShrink: 0 }}>-</span>
                <span style={{ color: '#ccc', lineHeight: 1.7 }}>{renderInline(bl.trimStart().slice(2), `blt-${keyCounter}-${bi}`)}</span>
              </div>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // Regular paragraph
    result.push(
      <p key={`p-${keyCounter++}`} style={{ margin: 0, marginBottom: 16 }}>
        {renderInline(trimmed, `p-${keyCounter}`)}
      </p>
    );
  }
  } // end parts loop

  return result;
}

function formatFacts(text: string) {
  if (!text) return null;
  // Split by newlines, filter empties, treat each line as a fact
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  return lines.map((line, i) => {
    // Try to extract "Fun Fact #N:" or "Fact N:" prefix
    const match = line.match(/^(Fun Fact #?\d+|Fact \d+|#\d+)\s*[:—-]\s*/i);
    const label = match ? match[1] : `#${i + 1}`;
    const content = match ? line.slice(match[0].length) : line;

    return (
      <div key={i} style={{
        padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a',
        borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: '#161616',
          border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 11, fontWeight: 800, color: '#4ade80',
        }}>
          {i + 1}
        </div>
        <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.6, margin: 0 }}>{renderInline(content, `fact-${i}`)}</p>
      </div>
    );
  });
}

