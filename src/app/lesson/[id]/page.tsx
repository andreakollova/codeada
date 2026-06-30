'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonById } from '@/data/curriculum';
import { useUserStore } from '@/store/userStore';
import { Exercise } from '@/types';
import ExplainCard from '@/components/exercises/ExplainCard';
import McqExercise from '@/components/exercises/McqExercise';
import FillExercise from '@/components/exercises/FillExercise';
import WriteExercise from '@/components/exercises/WriteExercise';
import Byte from '@/components/Byte';
import { X, Heart } from 'lucide-react';

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const lesson = getLessonById(id);
  const { hearts, loseHeart, completeLesson, setByteMood, byteMood, equipment } = useUserStore();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showHeartLost, setShowHeartLost] = useState(false);

  useEffect(() => { setByteMood('happy'); }, []);

  if (!lesson) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Lekcia nenájdená</p>
    </div>
  );

  const exercises = lesson.exercises;
  const current = exercises[exerciseIndex];
  const progress = (exerciseIndex / exercises.length) * 100;

  const handleCorrect = () => {
    setByteMood('celebrating');
    const newXp = xpEarned + current.xp;
    setTimeout(() => setByteMood('happy'), 1800);
    if (exerciseIndex + 1 >= exercises.length) {
      const reward = completeLesson(lesson.id, newXp);
      const params = new URLSearchParams({ lessonId: lesson.id, xp: String(newXp) });
      if (reward) params.set('reward', reward);
      router.replace(`/result?${params.toString()}`);
    } else {
      setXpEarned(newXp);
      setExerciseIndex(i => i + 1);
    }
  };

  const handleWrong = () => {
    setByteMood('worried');
    loseHeart();
    setShowHeartLost(true);
    setTimeout(() => { setShowHeartLost(false); setByteMood('happy'); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '12px 20px', background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/')} style={{ color: '#777', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
          {/* Progress */}
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#111', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', background: '#fff', borderRadius: 2 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
          {/* Hearts */}
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} size={14} fill={i < hearts ? '#fff' : 'none'} color={i < hearts ? '#fff' : '#2a2a2a'} />
            ))}
          </div>
        </div>
      </div>

      {/* Heart lost toast */}
      <AnimatePresence>
        {showHeartLost && (
          <motion.div initial={{ opacity: 0, y: -16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: 64, left: '50%', transform: 'translateX(-50%)', zIndex: 100, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 40, color: '#fff' }}>
            <Heart size={14} fill="#fff" color="#fff" />
            <span style={{ fontWeight: 700, fontSize: 13 }}>−1 srdce</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Byte */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, paddingBottom: 8 }}>
        <Byte mood={byteMood} size={80} equipment={equipment} />
      </div>

      {/* Exercise */}
      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', padding: '0 20px 40px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={exerciseIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            {current.type === 'explain' && <ExplainCard exercise={current} onNext={handleCorrect} />}
            {current.type === 'mcq'     && <McqExercise exercise={current} onCorrect={handleCorrect} onWrong={handleWrong} />}
            {current.type === 'fill'    && <FillExercise exercise={current} onCorrect={handleCorrect} onWrong={handleWrong} />}
            {current.type === 'write'   && <WriteExercise exercise={current} onCorrect={handleCorrect} onWrong={handleWrong} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
