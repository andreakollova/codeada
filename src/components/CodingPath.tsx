'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { curriculum } from '@/data/curriculum';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Code, Hash, GitBranch, Repeat, Layers, Zap, Database,
  ChevronDown, Check, Play, Terminal,
} from 'lucide-react';

const lessonIcons: Record<string, any> = {
  'what-is-variable': Hash,
  'data-types': Layers,
  'strings': BookOpen,
  'math-operators': Hash,
  'comparison-operators': GitBranch,
  'if-else': GitBranch,
  'elif': GitBranch,
  'for-loop': Repeat,
  'async-await': Zap,
  'destructuring': Layers,
  'ts-types': Code,
  'react-hooks': Repeat,
  'supabase-queries': Database,
};

export default function CodingPath() {
  const { completedLessons } = useUserStore();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({ 'python-basics': true });

  const toggleModule = (id: string) =>
    setOpenModules(prev => ({ ...prev, [id]: !prev[id] }));

  const allLessons = curriculum.flatMap(m => m.units.flatMap(u => u.lessons));
  const doneCount = allLessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Terminal size={16} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
            {s('coding', locale)}
          </h2>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
            {doneCount} / {allLessons.length} {s('exercisesCompleted', locale)}
          </p>
        </div>
      </div>

      {/* Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {curriculum.map((module, mi) => {
          const isOpen = !!openModules[module.id];
          const modLessons = module.units.flatMap(u => u.lessons);
          const modDone = modLessons.filter(l => completedLessons.includes(l.id)).length;
          const pct = modLessons.length ? Math.round((modDone / modLessons.length) * 100) : 0;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.08 }}
              style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, overflow: 'hidden' }}
            >
              <button
                onClick={() => toggleModule(module.id)}
                style={{ width: '100%', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Code size={18} color="#888" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                    {module.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#fff', borderRadius: 2, transition: 'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#888', fontWeight: 600, flexShrink: 0 }}>
                      {modDone}/{modLessons.length}
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
                      {module.units.map((unit) => (
                        <div key={unit.id}>
                          <div style={{ padding: '10px 20px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 1, flex: 1, background: '#111' }} />
                            <span style={{ fontSize: 10, color: '#888', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              {unit.title}
                            </span>
                            <div style={{ height: 1, flex: 1, background: '#111' }} />
                          </div>

                          {unit.lessons.map((lesson, li) => {
                            const done = completedLessons.includes(lesson.id);
                            const Icon = lessonIcons[lesson.id] ?? BookOpen;
                            const totalXp = lesson.exercises.reduce((acc, e) => acc + e.xp, 0);

                            return (
                              <motion.button
                                key={lesson.id}
                                onClick={() => router.push(`/lesson/${lesson.id}`)}
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
                                    : <Icon size={18} color="#888" />
                                  }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 500, fontSize: 14, color: done ? '#fff' : '#ccc', marginBottom: 2 }}>
                                    {lesson.title}
                                  </div>
                                  <div style={{ fontSize: 11, color: '#777' }}>
                                    {lesson.exercises.length} {s('exercises', locale)} · {totalXp} XP
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

                          {unit.isCheckpoint && (
                            <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ height: 1, flex: 1, background: '#111' }} />
                              <span style={{ fontSize: 10, color: '#555', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                {s('checkpoint', locale)}
                              </span>
                              <div style={{ height: 1, flex: 1, background: '#111' }} />
                            </div>
                          )}
                        </div>
                      ))}
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
}
