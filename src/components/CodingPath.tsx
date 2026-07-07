'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { fetchModulesWithLessons, ModuleWithLessons } from '@/lib/curriculum-api';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Code, ChevronDown, Check, Play, Terminal,
} from 'lucide-react';

// Python coding modules grouped by syllabus sections
// Maps syllabus group name to module_numbers in correct order
const SYLLABUS = [
  { titleEn: 'Python Fundamentals', titleSk: 'Základy Pythonu',
    modules: [30, 31, 32] }, // Python Basics, Strings, Error Handling
  { titleEn: 'Python Data Structures', titleSk: 'Dátové štruktúry',
    modules: [11, 14, 20, 21, 23] }, // Lists, Tuples, Sets, Dictionaries, Collections
  { titleEn: 'Python Programming', titleSk: 'Python Programovanie',
    modules: [24, 25, 26, 27, 28, 29] }, // Modules, Files, OOP, Special Methods, Iterators, FP
  { titleEn: 'Advanced Python', titleSk: 'Pokročilý Python',
    modules: [33, 34, 35, 36, 37, 38, 39, 40] }, // Decorators, Context Mgrs, Types, Dataclasses, Enums, Regex, Logging, Venvs
  { titleEn: 'Professional Python', titleSk: 'Profesionálny Python',
    modules: [41, 42, 43, 44, 45, 46, 47] }, // Testing, Debugging, Performance, Concurrency, Packaging, Internals, Best Practices
];

const ALL_CODING_MODULES = SYLLABUS.flatMap(s => s.modules);

export default function CodingPath() {
  const { completedLessons } = useUserStore();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [dbModules, setDbModules] = useState<ModuleWithLessons[]>([]);
  const [openModules, setOpenModules] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchModulesWithLessons().then(mods => {
      const codingMods = mods.filter(m => ALL_CODING_MODULES.includes(m.module_number));
      setDbModules(codingMods);
    });
  }, []);

  const toggleModule = (id: number) =>
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  if (dbModules.length === 0) return null;

  const allLessons = dbModules.flatMap(m => m.lessons);
  const doneCount = allLessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Terminal size={16} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
            {s('coding', locale)}
          </h2>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
            {doneCount} / {allLessons.length} {s('lessonsCompleted', locale)}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SYLLABUS.map((group, gi) => {
          const groupMods = group.modules.map(mn => dbModules.find(m => m.module_number === mn)).filter(Boolean) as ModuleWithLessons[];
          if (groupMods.length === 0) return null;
          const groupLessons = groupMods.flatMap(m => m.lessons);
          const groupDone = groupLessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
          const groupPct = groupLessons.length ? Math.round((groupDone / groupLessons.length) * 100) : 0;
          const groupTitle = locale === 'sk' ? group.titleSk : group.titleEn;

          return (
            <div key={gi}>
              {/* Syllabus group header */}
              <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{groupTitle}</span>
                <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
                <span style={{ fontSize: 11, color: '#555', fontWeight: 600 }}>{groupDone}/{groupLessons.length}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groupMods.map((mod, mi) => {
          const isOpen = !!openModules[mod.id];
          const modDone = mod.lessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
          const pct = mod.lessons.length ? Math.round((modDone / mod.lessons.length) * 100) : 0;
          const modTitle = locale === 'sk' && mod.title_sk ? mod.title_sk : mod.title;

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.05 }}
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
                              background: done ? '#fff' : '#111',
                              border: done ? 'none' : '1px solid #1f1f1f',
                            }}>
                              {done
                                ? <Check size={20} color="#000" strokeWidth={2.5} />
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
