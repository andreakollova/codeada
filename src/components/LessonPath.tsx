'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { curriculum } from '@/data/curriculum';
import { Module, Unit, Lesson } from '@/types';
import Byte from './Byte';
import { useRouter } from 'next/navigation';
import { Lock, CheckCircle, Flag } from 'lucide-react';

interface PathNode {
  type: 'lesson' | 'checkpoint';
  lesson?: Lesson;
  unit?: Unit;
  module: Module;
  status: 'locked' | 'active' | 'completed';
  side: 'left' | 'center' | 'right';
}

export default function LessonPath() {
  const { completedLessons } = useUserStore();
  const router = useRouter();
  const { byteMood } = useUserStore();

  // Build flat list of nodes from curriculum
  const nodes: PathNode[] = [];
  let sideIndex = 0;
  const sides: Array<'left' | 'right'> = ['left', 'right'];

  for (const module of curriculum) {
    for (const unit of module.units) {
      for (const lesson of unit.lessons) {
        const side = sides[sideIndex % 2] as 'left' | 'right';
        sideIndex++;

        // Determine status — all unlocked for testing
        const isCompleted = completedLessons.includes(lesson.id);
        const status = isCompleted ? 'completed' : 'active';

        nodes.push({ type: 'lesson', lesson, unit, module, status, side });
      }

      if (unit.isCheckpoint) {
        nodes.push({ type: 'checkpoint', unit, module, status: 'completed', side: 'center' });
      }
    }
  }

  const handleLessonClick = (node: PathNode) => {
    if (node.status === 'locked' || !node.lesson) return;
    router.push(`/lesson/${node.lesson.id}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Module headers tracked inline */}
      {curriculum.map((module) => (
        <div key={module.id}>
          {/* Module header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 mt-4"
          >
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: module.color + '22', border: `1.5px solid ${module.color}44` }}>
              <span className="text-2xl">{module.icon}</span>
              <div>
                <div className="font-bold text-base" style={{ fontFamily: 'Syne, sans-serif' }}>{module.title}</div>
                <div className="text-xs" style={{ color: '#888780' }}>{module.description}</div>
              </div>
            </div>
          </motion.div>

          {/* Nodes for this module */}
          {nodes
            .filter(n => n.module.id === module.id)
            .map((node, idx) => (
              <PathNodeItem
                key={node.lesson?.id ?? `ckpt-${idx}`}
                node={node}
                index={idx}
                byteMood={byteMood}
                onClick={() => handleLessonClick(node)}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

function PathNodeItem({ node, index, byteMood, onClick }: {
  node: PathNode;
  index: number;
  byteMood: any;
  onClick: () => void;
}) {
  if (node.type === 'checkpoint') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex justify-center my-6"
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center glow-purple"
            style={{ background: '#534AB7', border: '3px solid #7c6fd0' }}
          >
            <Flag size={24} className="text-white" />
          </div>
          <span className="text-xs font-semibold" style={{ color: '#534AB7', fontFamily: 'Syne, sans-serif' }}>
            CHECKPOINT
          </span>
        </div>
      </motion.div>
    );
  }

  const lesson = node.lesson!;
  const isLeft = node.side === 'left';
  const isActive = node.status === 'active';
  const isCompleted = node.status === 'completed';
  const isLocked = node.status === 'locked';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
      className={`flex mb-4 ${isLeft ? 'justify-start' : 'justify-end'}`}
    >
      <motion.button
        onClick={onClick}
        disabled={isLocked}
        whileHover={!isLocked ? { scale: 1.05 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        className="flex flex-col items-center gap-1 relative"
        style={{ cursor: isLocked ? 'not-allowed' : 'pointer' }}
      >
        {/* Byte sits on active node */}
        {isActive && (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-14"
          >
            <Byte mood={byteMood} size={52} />
          </motion.div>
        )}

        {/* Node circle */}
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl relative
            ${isActive ? 'glow-acid' : isCompleted ? 'glow-teal' : ''}`}
          style={{
            background: isActive
              ? '#DEFF4A'
              : isCompleted
              ? '#1D9E75'
              : '#1E1E1E',
            border: isActive
              ? '3px solid #c8e800'
              : isCompleted
              ? '3px solid #15805e'
              : '2px solid #2a2a2a',
            transition: 'all 0.3s',
          }}
        >
          {isLocked ? (
            <Lock size={22} style={{ color: '#888780' }} />
          ) : isCompleted ? (
            <CheckCircle size={26} style={{ color: 'white' }} />
          ) : (
            <span style={{ filter: isActive ? 'none' : 'grayscale(0.3)' }}>{lesson.icon}</span>
          )}
        </div>

        {/* Label */}
        <div
          className="text-xs font-semibold text-center max-w-24"
          style={{
            fontFamily: 'Syne, sans-serif',
            color: isActive ? '#DEFF4A' : isCompleted ? '#1D9E75' : '#888780',
          }}
        >
          {isActive ? 'ŠTART' : lesson.title}
        </div>
      </motion.button>
    </motion.div>
  );
}
