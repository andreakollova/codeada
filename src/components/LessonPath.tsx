'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { curriculum } from '@/data/curriculum';
import { useRouter } from 'next/navigation';
import {
  BookOpen, Code, Hash, GitBranch, Repeat, Layers, Zap, Database,
  ChevronDown, Check, Play, Lock,
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

export default function LessonPath() {
  const { completedLessons } = useUserStore();
  const router = useRouter();
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({ 'python-basics': true });

  const toggleModule = (id: string) =>
    setOpenModules(s => ({ ...s, [id]: !s[id] }));

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {curriculum.map((module, mi) => {
        const isOpen = !!openModules[module.id];
        const allLessons = module.units.flatMap(u => u.lessons);
        const doneCount = allLessons.filter(l => completedLessons.includes(l.id)).length;
        const pct = allLessons.length ? Math.round((doneCount / allLessons.length) * 100) : 0;

        return (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.08 }}
            style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 20, overflow: 'hidden' }}
          >
            {/* Module header — tap to collapse */}
            <button
              onClick={() => toggleModule(module.id)}
              style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Code size={18} color="#666" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                  {module.title}
                </div>
                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#1a1a1a', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#fff', borderRadius: 2, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 11, color: '#555', fontFamily: 'Syne, sans-serif', fontWeight: 600, flexShrink: 0 }}>
                    {doneCount}/{allLessons.length}
                  </span>
                </div>
              </div>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={18} color="#444" />
              </motion.div>
            </button>

            {/* Units + lessons */}
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
                    {module.units.map((unit, ui) => (
                      <div key={unit.id}>
                        {/* Unit label */}
                        <div style={{ padding: '10px 20px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ height: 1, flex: 1, background: '#111' }} />
                          <span style={{ fontSize: 10, color: '#333', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {unit.title}
                          </span>
                          <div style={{ height: 1, flex: 1, background: '#111' }} />
                        </div>

                        {/* Lessons */}
                        {unit.lessons.map((lesson, li) => {
                          const done = completedLessons.includes(lesson.id);
                          const Icon = lessonIcons[lesson.id] ?? BookOpen;
                          const totalXp = lesson.exercises.reduce((s, e) => s + e.xp, 0);

                          return (
                            <motion.button
                              key={lesson.id}
                              onClick={() => router.push(`/lesson/${lesson.id}`)}
                              whileHover={{ background: '#111' }}
                              whileTap={{ scale: 0.99 }}
                              style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                                padding: '12px 20px', cursor: 'pointer', background: 'none', border: 'none', textAlign: 'left',
                                borderTop: li === 0 ? 'none' : '1px solid #0f0f0f',
                                transition: 'background 0.15s',
                              }}
                            >
                              {/* Icon */}
                              <div style={{
                                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? '#fff' : '#111',
                                border: done ? 'none' : '1px solid #1f1f1f',
                              }}>
                                {done
                                  ? <Check size={20} color="#000" strokeWidth={2.5} />
                                  : <Icon size={18} color="#555" />
                                }
                              </div>

                              {/* Text */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: done ? '#fff' : '#ccc', marginBottom: 2 }}>
                                  {lesson.title}
                                </div>
                                <div style={{ fontSize: 11, color: '#444' }}>
                                  {lesson.exercises.length} cvičení · {totalXp} XP
                                </div>
                              </div>

                              {/* Action */}
                              <div style={{
                                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: done ? 'transparent' : '#fff',
                                border: done ? '1px solid #1f1f1f' : 'none',
                              }}>
                                {done
                                  ? <Check size={14} color="#333" />
                                  : <Play size={13} color="#000" fill="#000" />
                                }
                              </div>
                            </motion.button>
                          );
                        })}

                        {/* Checkpoint badge */}
                        {unit.isCheckpoint && (
                          <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ height: 1, flex: 1, background: '#111' }} />
                            <span style={{ fontSize: 10, color: '#2a2a2a', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                              Checkpoint
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
  );
}
