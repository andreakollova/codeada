'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { curriculum } from '@/data/curriculum';
import { Module, Unit, Lesson } from '@/types';
import Byte from './Byte';
import { useRouter } from 'next/navigation';
import { Lock, Check, Flag, BookOpen, Code, Hash, GitBranch, Repeat, Layers, Zap, Database } from 'lucide-react';

const moduleIcons: Record<string, any> = {
  'python-basics': Code,
  'my-projects': Zap,
};

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

interface PathNode {
  type: 'lesson' | 'checkpoint';
  lesson?: Lesson;
  unit?: Unit;
  module: Module;
  status: 'locked' | 'active' | 'completed';
  side: 'left' | 'right';
}

export default function LessonPath() {
  const { completedLessons, byteMood, equipment } = useUserStore();
  const router = useRouter();
  const nodes: PathNode[] = [];
  let sideIndex = 0;

  for (const module of curriculum) {
    for (const unit of module.units) {
      for (const lesson of unit.lessons) {
        const side = (sideIndex % 2 === 0 ? 'left' : 'right') as 'left' | 'right';
        sideIndex++;
        const isCompleted = completedLessons.includes(lesson.id);
        nodes.push({ type: 'lesson', lesson, unit, module, status: isCompleted ? 'completed' : 'active', side });
      }
      if (unit.isCheckpoint) {
        nodes.push({ type: 'checkpoint', unit, module, status: 'completed', side: 'left' });
      }
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px 120px', position: 'relative' }}>
      {curriculum.map((module) => {
        const ModuleIcon = moduleIcons[module.id] ?? Code;
        return (
          <div key={module.id}>
            {/* Module header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 32, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: 16 }}>
                <div style={{ width: 36, height: 36, background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ModuleIcon size={18} color="#888" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>{module.title}</div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 1 }}>{module.description}</div>
                </div>
              </div>
            </motion.div>

            {/* Nodes */}
            {nodes.filter(n => n.module.id === module.id).map((node, idx) => (
              <NodeItem
                key={node.lesson?.id ?? `ckpt-${idx}`}
                node={node}
                index={idx}
                byteMood={byteMood}
                equipment={equipment}
                onClick={() => node.lesson && router.push(`/lesson/${node.lesson.id}`)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function NodeItem({ node, index, byteMood, equipment, onClick }: any) {
  if (node.type === 'checkpoint') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.04 }}
        style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0d0d0d', border: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flag size={22} color="#555" />
          </div>
          <span style={{ fontSize: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.12em', color: '#444', textTransform: 'uppercase' }}>
            Checkpoint
          </span>
        </div>
      </motion.div>
    );
  }

  const lesson = node.lesson!;
  const isLeft = node.side === 'left';
  const isCompleted = node.status === 'completed';
  const LessonIcon = lessonIcons[lesson.id] ?? BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 220 }}
      style={{ display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end', marginBottom: 20 }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', position: 'relative', background: 'none', border: 'none' }}
      >
        {/* Byte on active node */}
        {!isCompleted && (
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: -64 }}>
            <Byte mood={byteMood} size={52} equipment={equipment} />
          </motion.div>
        )}

        {/* Node */}
        <div style={{
          width: 76, height: 76, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isCompleted ? '#fff' : '#0d0d0d',
          border: isCompleted ? 'none' : '1.5px solid #2a2a2a',
          boxShadow: isCompleted ? '0 0 0 1px #fff, 0 0 20px rgba(255,255,255,0.1)' : 'none',
        }}>
          {isCompleted
            ? <Check size={28} color="#000" strokeWidth={2.5} />
            : <LessonIcon size={24} color="#555" />
          }
        </div>

        {/* Label */}
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 11,
          textAlign: 'center', maxWidth: 90, lineHeight: 1.3,
          color: isCompleted ? '#fff' : '#555',
        }}>
          {lesson.title}
        </span>
      </motion.button>
    </motion.div>
  );
}
