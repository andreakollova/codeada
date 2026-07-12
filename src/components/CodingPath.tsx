'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { fetchModulesWithLessons, ModuleWithLessons } from '@/lib/curriculum-api';
import { useRouter } from 'next/navigation';
import Byte from './Byte';
import {
  BookOpen, Code, ChevronDown, Check, Play, Terminal,
} from 'lucide-react';

// === CHARACTER PATHS ===
interface CharacterPath {
  id: string;
  emoji: string;
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
    emoji: '👩‍💻',
    titleEn: 'The Builder',
    titleSk: 'Builder',
    subtitleEn: 'I want to build apps.',
    subtitleSk: 'Chcem vytvárať aplikácie.',
    descEn: 'Full Python curriculum for creating your own projects.',
    descSk: 'Kompletný Python kurz na tvorbu vlastných projektov.',
    modules: [30, 31, 32, 11, 14, 20, 21, 23, 24, 25, 26, 27, 28, 29, 33, 39, 40, 47, 45],
    equipment: { hat: 'hat-graduation', glasses: 'glasses-cool' },
  },
  {
    id: 'ai-pilot',
    emoji: '🤖',
    titleEn: 'The AI Pilot',
    titleSk: 'AI Pilot',
    subtitleEn: 'I want to understand AI and vibe coding.',
    subtitleSk: 'Chcem rozumieť AI a vibe codingu.',
    descEn: 'Learn enough Python to work with AI tools effectively.',
    descSk: 'Nauč sa dosť Pythonu na efektívnu prácu s AI nástrojmi.',
    modules: [30, 31, 11, 21, 25, 24, 32, 42],
    equipment: { hat: 'hat-galaxy', glasses: 'glasses-laser' },
  },
  {
    id: 'mechanic',
    emoji: '🛠️',
    titleEn: 'The Code Mechanic',
    titleSk: 'Mechanik',
    subtitleEn: 'I want to fix and understand existing code.',
    subtitleSk: 'Chcem opravovať a rozumieť existujúcemu kódu.',
    descEn: 'Perfect for people using Cursor, Claude Code or ChatGPT.',
    descSk: 'Ideálne pre ľudí používajúcich Cursor, Claude Code alebo ChatGPT.',
    modules: [30, 32, 42, 26, 27, 28, 39, 35],
    equipment: { hat: 'hat-pilot', glasses: 'glasses-aviator' },
  },
  {
    id: 'master',
    emoji: '🏆',
    titleEn: 'The Master',
    titleSk: 'Master',
    subtitleEn: 'I want to master Python from basics to professional level.',
    subtitleSk: 'Chcem ovládnuť Python od základov až po profesionálnu úroveň.',
    descEn: 'All 29 modules, 200+ lessons. Become a real Python developer.',
    descSk: 'Všetkých 29 modulov, 200+ lekcií. Staň sa skutočným Python vývojárom.',
    modules: [30, 31, 32, 11, 14, 20, 21, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
    equipment: { hat: 'hat-golden-crown', glasses: 'glasses-golden', accessory: 'acc-wings-gold' },
  },
];

// Syllabus groups for visual structure
const SYLLABUS = [
  { titleEn: 'Python Fundamentals', titleSk: 'Základy Pythonu',
    modules: [30, 31, 32] },
  { titleEn: 'Data Structures', titleSk: 'Dátové štruktúry',
    modules: [11, 14, 20, 21, 23] },
  { titleEn: 'Python Programming', titleSk: 'Python programovanie',
    modules: [24, 25, 26, 27, 28, 29] },
  { titleEn: 'Advanced Python', titleSk: 'Pokročilý Python',
    modules: [33, 34, 35, 36, 37, 38, 39, 40] },
  { titleEn: 'Professional Python', titleSk: 'Profesionálny Python',
    modules: [41, 42, 43, 44, 45, 46, 47] },
];

const ALL_CODING_MODULES = SYLLABUS.flatMap(g => g.modules);

export default function CodingPath() {
  const { completedLessons } = useUserStore();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [dbModules, setDbModules] = useState<ModuleWithLessons[]>([]);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  // Persist selected path
  useEffect(() => {
    const saved = localStorage.getItem('coduy-path');
    if (saved) setSelectedPath(saved);
  }, []);

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{path.emoji}</span>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#fff' }}>
                      {locale === 'sk' ? path.titleSk : path.titleEn}
                    </span>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{activePath.emoji}</span>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em' }}>
                  {locale === 'sk' ? activePath.titleSk : activePath.titleEn}
                </h2>
              </div>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 8, fontStyle: 'italic' }}>
                &bdquo;{locale === 'sk' ? activePath.subtitleSk : activePath.subtitleEn}&ldquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>
                  {activeModuleNumbers.length} {locale === 'sk' ? 'modulov' : 'modules'} - {allLessons.length} {locale === 'sk' ? 'lekcií' : 'lessons'}
                </span>
                <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                  {doneCount} {locale === 'sk' ? 'hotových' : 'done'}
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
        </div>
      )}

      {!activePath && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal size={16} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
              {locale === 'sk' ? 'Všetky moduly' : 'All modules'}
            </h2>
            <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
              {doneCount} / {allLessons.length} {locale === 'sk' ? 'lekcií hotových' : 'lessons done'}
            </p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ height: 3, borderRadius: 2, background: '#1a1a1a', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: allLessons.length > 0 ? '#4ade80' : '#333', borderRadius: 2, width: `${allLessons.length > 0 ? (doneCount / allLessons.length) * 100 : 0}%`, transition: 'width 0.4s' }} />
      </div>

      {/* Modules grouped by syllabus */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredGroups.map((group, gi) => {
          const groupMods = group.modules.map(mn => dbModules.find(m => m.module_number === mn)).filter(Boolean) as ModuleWithLessons[];
          if (groupMods.length === 0) return null;
          const groupLessons = groupMods.flatMap(m => m.lessons);
          const groupDone = groupLessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
          const groupTitle = locale === 'sk' ? group.titleSk : group.titleEn;

          return (
            <div key={gi}>
              <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{groupTitle}</span>
                <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{groupDone}/{groupLessons.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groupMods.map((mod) => {
                  const isOpen = !!openModules[mod.id];
                  const modDone = mod.lessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
                  const pct = mod.lessons.length ? Math.round((modDone / mod.lessons.length) * 100) : 0;
                  const modTitle = locale === 'sk' && mod.title_sk ? mod.title_sk : mod.title;

                  return (
                    <motion.div
                      key={mod.id}
                      style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, overflow: 'hidden' }}
                    >
                      <button
                        onClick={() => toggleModule(mod.id)}
                        style={{ width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Code size={18} color="#888" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                            {modTitle}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: '#fff', borderRadius: 2, transition: 'width 0.4s' }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#888', fontWeight: 600, flexShrink: 0 }}>
                              {modDone}/{mod.lessons.length}
                            </span>
                          </div>
                        </div>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown size={18} color="#555" />
                        </motion.div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ borderTop: '1px solid #111' }}>
                              {mod.lessons.map((lesson, li) => {
                                const done = completedLessons.includes(`theory-${lesson.id}`);
                                const lessonTitle = locale === 'sk' && lesson.title_sk ? lesson.title_sk : lesson.title;

                                return (
                                  <motion.button
                                    key={lesson.id}
                                    onClick={() => router.push(`/theory/${lesson.id}`)}
                                    whileHover={{ background: '#111' }}
                                    whileTap={{ scale: 0.99 }}
                                    style={{
                                      width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                                      padding: '12px 20px', cursor: 'pointer', textAlign: 'left',
                                      borderTop: li === 0 ? 'none' : '1px solid #0f0f0f',
                                      transition: 'background 0.15s',
                                    }}
                                  >
                                    <div style={{
                                      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      background: done ? '#4ade80' : '#111',
                                      border: done ? 'none' : '1px solid #1f1f1f',
                                    }}>
                                      {done
                                        ? <Check size={20} color="#052e16" strokeWidth={2.5} />
                                        : <BookOpen size={18} color="#888" />
                                      }
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontWeight: 500, fontSize: 14, color: done ? '#fff' : '#ccc', marginBottom: 2 }}>
                                        {lessonTitle}
                                      </div>
                                      <div style={{ fontSize: 11, color: '#777' }}>
                                        {s('lesson', locale)} {lesson.lesson_number}
                                      </div>
                                    </div>
                                    <div style={{
                                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      background: done ? 'transparent' : '#fff',
                                      border: done ? '1px solid #1f1f1f' : 'none',
                                    }}>
                                      {done
                                        ? <Check size={14} color="#888" />
                                        : <Play size={13} color="#000" fill="#000" />
                                      }
                                    </div>
                                  </motion.button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
