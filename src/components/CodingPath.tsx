'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { fetchModulesWithLessons, ModuleWithLessons } from '@/lib/curriculum-api';
import { useRouter } from 'next/navigation';
import Byte from './Byte';
import {
  BookOpen, Code, ChevronDown, Check, Play, Terminal,
  Variable, Keyboard, GitBranch, Layers, Braces, Hash,
  List, Database, Repeat, Cpu, Zap, Shield, Globe, Server,
  FileCode, FolderOpen, Bug, Gauge, Lock, Package, Wrench,
  Puzzle, PenTool, Search, Filter, Clock, Bell, Settings,
  RefreshCw, Box, Lightbulb, Star, Heart, Eye, Sparkles,
  ArrowDownCircle, ArrowUpCircle, Gift,
} from 'lucide-react';

// Rotating icon set for lesson nodes (uniform lucide style)
const LESSON_ICONS = [
  Variable, Keyboard, Braces, Hash, List, Layers, Database,
  Repeat, Cpu, Zap, Shield, Globe, Server, FileCode, FolderOpen,
  Bug, Gauge, Lock, Package, Wrench, Puzzle, PenTool, Search,
  Filter, Clock, Bell, Settings, RefreshCw, Box, Lightbulb,
  Star, Eye, Sparkles, Code, GitBranch, Terminal,
];

// === CHARACTER PATHS ===
interface CharacterPath {
  id: string;
  emoji?: string;
  titleEn: string;
  titleSk: string;
  subtitleEn: string;
  subtitleSk: string;
  descEn: string;
  descSk: string;
  modules: number[]; // module_numbers to include
  equipment: Record<string, string>;
}

const PATHS: CharacterPath[] = [
  {
    id: 'builder',
    titleEn: 'The Builder',
    titleSk: 'Builder',
    subtitleEn: 'I want to build apps.',
    subtitleSk: 'Chcem vytvárať aplikácie.',
    descEn: 'Full Python curriculum for creating your own projects.',
    descSk: 'Kompletný Python kurz na tvorbu vlastných projektov.',
    modules: [1, 31, 32, 33, 12, 15, 21, 22, 24, 25, 26, 27, 28, 29, 30, 34, 40, 41, 48, 46],
    equipment: { hat: 'hat-graduation', glasses: 'glasses-cool', accessory: 'acc-crystal', aura: 'aura-green' },
  },
  {
    id: 'ai-pilot',
    titleEn: 'The AI Pilot',
    titleSk: 'AI Pilot',
    subtitleEn: 'I want to understand AI and vibe coding.',
    subtitleSk: 'Chcem rozumieť AI a vibe codingu.',
    descEn: 'Learn enough Python to work with AI tools effectively.',
    descSk: 'Nauč sa dosť Pythonu na efektívnu prácu s AI nástrojmi.',
    modules: [1, 31, 32, 12, 22, 26, 25, 33, 43],
    equipment: { hat: 'hat-galaxy', glasses: 'glasses-laser', antenna: 'ant-lightning', aura: 'aura-galaxy' },
  },
  {
    id: 'mechanic',
    titleEn: 'The Code Mechanic',
    titleSk: 'Mechanik',
    subtitleEn: 'I want to fix and understand existing code.',
    subtitleSk: 'Chcem opravovať a rozumieť existujúcemu kódu.',
    descEn: 'Perfect for people using Cursor, Claude Code or ChatGPT.',
    descSk: 'Ideálne pre ľudí používajúcich Cursor, Claude Code alebo ChatGPT.',
    modules: [1, 31, 33, 43, 27, 28, 29, 40, 36],
    equipment: { hat: 'hat-samurai', glasses: 'glasses-frost', accessory: 'acc-chain', aura: 'aura-blue' },
  },
  {
    id: 'master',
    titleEn: 'The Master',
    titleSk: 'Master',
    subtitleEn: 'I want to master Python from basics to professional level.',
    subtitleSk: 'Chcem ovládnuť Python od základov až po profesionálnu úroveň.',
    descEn: 'All modules, 200+ lessons. Become a real Python developer.',
    descSk: 'Všetky moduly, 200+ lekcií. Staň sa skutočným Python vývojárom.',
    modules: [1, 31, 32, 33, 12, 15, 21, 22, 24, 25, 26, 27, 28, 29, 30, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
    equipment: { hat: 'hat-golden-crown', glasses: 'glasses-golden', accessory: 'acc-wings-gold', aura: 'aura-golden' },
  },
];

// Syllabus groups for visual structure
const SYLLABUS = [
  { titleEn: 'Introduction', titleSk: 'Úvod',
    modules: [1] },
  { titleEn: 'Python Fundamentals', titleSk: 'Základy Pythonu',
    modules: [31, 32, 33] },
  { titleEn: 'Data Structures', titleSk: 'Dátové štruktúry',
    modules: [12, 15, 21, 22, 24] },
  { titleEn: 'Python Programming', titleSk: 'Python programovanie',
    modules: [25, 26, 27, 28, 29, 30] },
  { titleEn: 'Advanced Python', titleSk: 'Pokročilý Python',
    modules: [34, 35, 36, 37, 38, 39, 40, 41] },
  { titleEn: 'Professional Python', titleSk: 'Profesionálny Python',
    modules: [42, 43, 44, 45, 46, 47, 48] },
];

const ALL_CODING_MODULES = SYLLABUS.flatMap(g => g.modules);

export default function CodingPath() {
  const { completedLessons, wrongQuestionIds } = useUserStore();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [dbModules, setDbModules] = useState<ModuleWithLessons[]>([]);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('coduy-path');
    return null;
  });
  const nextLessonRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [unlockModal, setUnlockModal] = useState<{ lessonId: number; title: string; step: 1 | 2 } | null>(null);

  useEffect(() => {
    fetchModulesWithLessons().then(mods => {
      const codingMods = mods.filter(m => ALL_CODING_MODULES.includes(m.module_number));
      setDbModules(codingMods);
      // If path is selected, open all modules by default
      const saved = localStorage.getItem('coduy-path');
      if (saved && saved !== 'all') {
        const open: Record<number, boolean> = {};
        codingMods.forEach(m => { open[m.id] = true; });
        setOpenModules(open);
      }
    });
  }, []);

  const selectPath = (pathId: string) => {
    setSelectedPath(pathId);
    localStorage.setItem('coduy-path', pathId);
    // Open all modules when selecting a path
    const open: Record<number, boolean> = {};
    dbModules.forEach(m => { open[m.id] = true; });
    setOpenModules(open);
  };

  const toggleModule = (id: number) =>
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  // Show path selection even before modules load
  const isAllMode = selectedPath === 'all';
  const activePath = isAllMode ? null : PATHS.find(p => p.id === selectedPath);
  const activeModuleNumbers = activePath ? activePath.modules : ALL_CODING_MODULES;

  const filteredGroups = SYLLABUS.map(group => ({
    ...group,
    modules: group.modules.filter(mn => activeModuleNumbers.includes(mn)),
  })).filter(g => g.modules.length > 0);

  const allLessons = dbModules
    .filter(m => activeModuleNumbers.includes(m.module_number))
    .flatMap(m => m.lessons);
  const doneCount = allLessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;

  // === PATH SELECTION SCREEN ===
  if (!selectedPath) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal size={16} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
              {locale === 'sk' ? 'Vyber si svoju cestu' : 'Choose your path'}
            </h2>
            <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
              {locale === 'sk' ? 'Čo chceš vedieť?' : 'What do you want to learn?'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PATHS.map((path) => {
            const pathModules = dbModules.filter(m => path.modules.includes(m.module_number));
            const lessonCount = pathModules.reduce((sum, m) => sum + m.lessons.length, 0);

            return (
              <motion.button
                key={path.id}
                onClick={() => selectPath(path.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: '100%', padding: '20px', display: 'flex', alignItems: 'center', gap: 16,
                  background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16,
                  cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <Byte mood="happy" size={56} equipment={path.equipment} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>
                    {locale === 'sk' ? path.titleSk : path.titleEn}
                  </div>
                  <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 6px', fontStyle: 'italic' }}>
                    „{locale === 'sk' ? path.subtitleSk : path.subtitleEn}"
                  </p>
                  <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                    {locale === 'sk' ? path.descSk : path.descEn}
                  </p>
                  <p style={{ fontSize: 11, color: '#555', margin: '6px 0 0', fontWeight: 600 }}>
                    {path.modules.length} {locale === 'sk' ? 'modulov' : 'modules'} · {lessonCount} {locale === 'sk' ? 'lekcií' : 'lessons'}
                  </p>
                </div>
                <Play size={16} color="#555" />
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#222' }} />
          <span style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>
            {locale === 'sk' ? 'alebo' : 'or'}
          </span>
          <div style={{ flex: 1, height: 1, background: '#222' }} />
        </div>

        {/* Browse all */}
        <motion.button
          onClick={() => selectPath('all')}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#111', border: '1px solid #222', borderRadius: 12,
            cursor: 'pointer', fontSize: 14, color: '#888', fontWeight: 600,
          }}
        >
          <BookOpen size={16} />
          {locale === 'sk' ? 'Zobraziť všetky moduly' : 'Browse all modules'}
        </motion.button>
      </div>
    );
  }

  // === CURRICULUM VIEW ===
  if (dbModules.length === 0) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: '#555', fontSize: 13 }}>{locale === 'sk' ? 'Načítavam...' : 'Loading...'}</p>
    </div>
  );
  return (
    <div>
      {/* Path hero */}
      {activePath && (
        <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Byte mood="happy" size={72} equipment={activePath.equipment} />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {locale === 'sk' ? activePath.titleSk : activePath.titleEn}
              </h2>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8, fontStyle: 'italic' }}>
                &bdquo;{locale === 'sk' ? activePath.subtitleSk : activePath.subtitleEn}&ldquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>
                  {activeModuleNumbers.length} {locale === 'sk' ? 'modulov' : 'modules'} - {allLessons.length} {locale === 'sk' ? 'lekcií' : 'lessons'}
                </span>
                <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                  {doneCount} {locale === 'sk' ? (doneCount === 1 ? 'hotová' : doneCount >= 2 && doneCount <= 4 ? 'hotové' : 'hotových') : 'done'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setSelectedPath(null); localStorage.removeItem('coduy-path'); }}
            style={{
              marginTop: 14, width: '100%', padding: '10px', borderRadius: 10,
              background: '#161616', border: '1px solid #222', color: '#888',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {locale === 'sk' ? 'Zmeniť cestu' : 'Change path'}
          </button>
          {wrongQuestionIds.length > 0 && (
            <button
              onClick={() => router.push('/practice')}
              style={{
                padding: '10px 20px', borderRadius: 10,
                background: '#1a0a0a', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {locale === 'sk' ? `Precvičiť chyby (${wrongQuestionIds.length})` : `Practice mistakes (${wrongQuestionIds.length})`}
            </button>
          )}
        </div>
      )}

      {!activePath && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
                {locale === 'sk' ? 'Všetky moduly' : 'All modules'}
              </h2>
              <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
                {doneCount} / {allLessons.length} {locale === 'sk' ? (doneCount === 1 ? 'lekcia hotová' : doneCount >= 2 && doneCount <= 4 ? 'lekcie hotové' : 'lekcií hotových') : 'lessons done'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedPath(null); localStorage.removeItem('coduy-path'); }}
            style={{
              width: '100%', padding: '10px', borderRadius: 10,
              background: '#161616', border: '1px solid #222', color: '#888',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            {locale === 'sk' ? 'Zmeniť cestu' : 'Change path'}
          </button>
        </div>
      )}

      {/* Path trail */}
      {(() => {
        const pathLessons: { lesson: any; modTitle: string; groupTitle: string; isFirstInGroup: boolean }[] = [];
        filteredGroups.forEach(group => {
          const groupMods = group.modules.map(mn => dbModules.find(m => m.module_number === mn)).filter(Boolean) as ModuleWithLessons[];
          const groupTitle = locale === 'sk' ? group.titleSk : group.titleEn;
          let first = true;
          groupMods.forEach(mod => {
            const modTitle = locale === 'sk' && mod.title_sk ? mod.title_sk : mod.title;
            mod.lessons.forEach(lesson => {
              pathLessons.push({ lesson, modTitle, groupTitle, isFirstInGroup: first });
              first = false;
            });
          });
        });

        // Unlock logic: first 3 + all completed + next after last completed
        const nextIdx = pathLessons.findIndex(p => !completedLessons.includes(`theory-${p.lesson.id}`));
        const UNLOCK_AHEAD = 3;

        return (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
            {pathLessons.map((item, i) => {
              const done = completedLessons.includes(`theory-${item.lesson.id}`);
              const isNext = i === nextIdx;
              const unlocked = done || i < UNLOCK_AHEAD || (nextIdx >= 0 && i <= nextIdx + UNLOCK_AHEAD);
              const locked = !unlocked;
              const lessonTitle = locale === 'sk' && item.lesson.title_sk ? item.lesson.title_sk : item.lesson.title;

              // Zigzag: even=left, odd=right
              const xPos = i % 2 === 0 ? 60 : 240;  // left or right in 300-wide viewBox
              const prevXPos = i > 0 ? ((i - 1) % 2 === 0 ? 60 : 240) : 150;
              const nodeSize = isNext ? 58 : 48;
              const trailDone = done || isNext;
              const connectorH = 40;

              return (
                <div key={item.lesson.id} style={{ width: '100%' }}>
                  {/* Group label */}
                  {item.isFirstInGroup && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: i === 0 ? '0 0 20px' : '28px 0 20px' }}>
                      <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                        {item.groupTitle}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                    </div>
                  )}

                  {/* Curved connector trail */}
                  {i > 0 && !item.isFirstInGroup && (
                    <div style={{ height: connectorH, position: 'relative' }}>
                      <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{ width: '100%', height: connectorH, display: 'block' }}>
                        <path
                          d={`M ${prevXPos} 0 C ${prevXPos} 20, ${xPos} 20, ${xPos} 40`}
                          stroke={trailDone ? '#333' : '#1a1a1a'}
                          strokeWidth="3"
                          strokeDasharray={trailDone ? 'none' : '6 6'}
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Lesson node */}
                  <div
                    ref={isNext ? nextLessonRef : undefined}
                    style={{
                      display: 'flex',
                      justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
                      paddingLeft: i % 2 === 0 ? 20 : 0,
                      paddingRight: i % 2 === 1 ? 20 : 0,
                    }}
                  >
                    <motion.button
                      onClick={() => {
                        if (!locked) {
                          router.push(`/theory/${item.lesson.id}`);
                        } else {
                          setUnlockModal({ lessonId: item.lesson.id, title: lessonTitle, step: 1 });
                        }
                      }}
                      whileHover={!locked ? { scale: 1.06 } : {}}
                      whileTap={!locked ? { scale: 0.95 } : {}}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        cursor: locked ? 'default' : 'pointer',
                        opacity: locked ? 0.3 : 1,
                        background: 'none', border: 'none', padding: '4px 8px',
                      }}
                    >
                      {/* Circle node */}
                      {(() => {
                        const LessonIcon = LESSON_ICONS[i % LESSON_ICONS.length];
                        return (
                          <div style={{
                            width: nodeSize, height: nodeSize, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: done ? '#4ade80' : isNext ? '#fff' : locked ? '#111' : '#1a1a1a',
                            border: done || isNext ? 'none' : `2px solid ${locked ? '#1a1a1a' : '#333'}`,
                            boxShadow: isNext ? '0 0 24px rgba(255,255,255,0.2), 0 0 48px rgba(255,255,255,0.05)' : done ? '0 0 12px rgba(74,222,128,0.15)' : 'none',
                            transition: 'all 0.2s',
                          }}>
                            {done
                              ? <Check size={22} color="#052e16" strokeWidth={3} />
                              : isNext
                                ? <Play size={20} color="#000" fill="#000" />
                                : <LessonIcon size={locked ? 14 : 18} color={locked ? '#333' : '#666'} strokeWidth={1.8} />
                            }
                          </div>
                        );
                      })()}
                      {/* Label */}
                      <div style={{ textAlign: 'center', maxWidth: 140 }}>
                        <div style={{
                          fontWeight: isNext ? 700 : 500,
                          fontSize: isNext ? 12 : 11,
                          color: done ? '#888' : isNext ? '#fff' : locked ? '#333' : '#aaa',
                          lineHeight: 1.3,
                        }}>
                          {lessonTitle}
                        </div>
                        {/* Reward badge - every 5th lesson or 1st/3rd */}
                        {(() => {
                          const lessonNum = i + 1;
                          const getsReward = lessonNum === 1 || lessonNum === 3 || lessonNum % 5 === 0;
                          if (!getsReward) return null;
                          const pathColor = activePath?.id === 'builder' ? '#4ade80'
                            : activePath?.id === 'ai-pilot' ? '#a855f7'
                            : activePath?.id === 'mechanic' ? '#60a5fa'
                            : activePath?.id === 'master' ? '#f59e0b'
                            : '#f59e0b';
                          const badgeColor = done ? '#888' : pathColor;
                          return (
                            <div style={{
                              marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '3px 10px', borderRadius: 20,
                              background: `${badgeColor}12`,
                              backdropFilter: 'blur(8px)',
                              WebkitBackdropFilter: 'blur(8px)',
                              border: `1px solid ${badgeColor}25`,
                              boxShadow: done ? 'none' : `0 0 12px ${badgeColor}15, inset 0 1px 0 ${badgeColor}15`,
                            }}>
                              <Gift size={10} color={badgeColor} strokeWidth={2.5} />
                              <span style={{ fontSize: 9, fontWeight: 700, color: badgeColor, letterSpacing: '0.04em' }}>
                                {locale === 'sk' ? 'Odmena' : 'Reward'}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Scroll to next lesson button */}
      {nextLessonRef.current && !hasScrolled && (() => {
        const rect = nextLessonRef.current?.getBoundingClientRect();
        const isBelow = rect ? rect.top > window.innerHeight : true;
        const ArrowIcon = isBelow ? ArrowDownCircle : ArrowUpCircle;
        return (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => {
              nextLessonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setHasScrolled(true);
            }}
            style={{
              position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 50,
              padding: '10px 20px', borderRadius: 20,
              background: '#fff', color: '#000', fontWeight: 700, fontSize: 13,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            <ArrowIcon size={16} />
            {locale === 'sk' ? 'Pokračovať' : 'Continue'}
          </motion.button>
        );
      })()}

      {/* Unlock modal */}
      <AnimatePresence>
        {unlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUnlockModal(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 24, maxWidth: 320, width: '100%', textAlign: 'center' }}
            >
              {unlockModal.step === 1 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                    <Lock size={28} color="#f97316" />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>
                    {locale === 'sk' ? 'Odomknúť lekciu?' : 'Unlock lesson?'}
                  </h3>
                  <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5, margin: '0 0 20px' }}>
                    {unlockModal.title}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setUnlockModal(null)}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    >
                      {locale === 'sk' ? 'Zrušiť' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => setUnlockModal({ ...unlockModal, step: 2 })}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#EDEDED', border: 'none', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      {locale === 'sk' ? 'Odomknúť' : 'Unlock'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
                  <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 8px' }}>
                    {locale === 'sk' ? 'Si si istý/á?' : 'Are you sure?'}
                  </h3>
                  <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5, margin: '0 0 20px' }}>
                    {locale === 'sk'
                      ? 'Táto lekcia môže obsahovať pojmy, ktoré si ešte nepreberal/a v predchádzajúcich lekciách.'
                      : 'This lesson may contain concepts you have not covered in previous lessons.'}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setUnlockModal(null)}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#888', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    >
                      {locale === 'sk' ? 'Späť' : 'Back'}
                    </button>
                    <button
                      onClick={() => { setUnlockModal(null); router.push(`/theory/${unlockModal.lessonId}`); }}
                      style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#f97316', border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      {locale === 'sk' ? 'Pokračovať' : 'Continue'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
