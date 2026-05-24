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
  const { hearts, loseHeart, completeLesson, setByteMood, byteMood } = useUserStore();

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showHeartLost, setShowHeartLost] = useState(false);

  useEffect(() => {
    setByteMood('happy');
  }, []);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p style={{ color: '#888780' }}>Lekcia nenájdená</p>
      </div>
    );
  }

  const exercises = lesson.exercises;
  const current = exercises[exerciseIndex];
  const progress = ((exerciseIndex) / exercises.length) * 100;

  const goNext = (xp: number = 0) => {
    setXpEarned((e) => e + xp);
    setDirection(1);
    if (exerciseIndex + 1 >= exercises.length) {
      // Lesson complete
      const totalXp = xpEarned + xp;
      completeLesson(lesson.id, totalXp);
      router.replace(`/result?lessonId=${lesson.id}&xp=${totalXp}`);
    } else {
      setExerciseIndex((i) => i + 1);
    }
  };

  const handleCorrect = () => {
    setByteMood('celebrating');
    setTimeout(() => setByteMood('happy'), 2000);
    goNext(current.xp);
  };

  const handleWrong = () => {
    setByteMood('worried');
    loseHeart();
    setShowHeartLost(true);
    setTimeout(() => {
      setShowHeartLost(false);
      setByteMood('happy');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 px-4 pt-4 pb-3"
        style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Close */}
          <button onClick={() => router.push('/')} className="p-1 rounded-lg" style={{ color: '#888780' }}>
            <X size={22} />
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: '#1E1E1E' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#DEFF4A' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} size={16} fill={i < hearts ? '#ef4444' : 'none'}
                className={i < hearts ? 'text-red-500' : 'text-gray-700'} />
            ))}
          </div>
        </div>
      </div>

      {/* Heart lost animation */}
      <AnimatePresence>
        {showHeartLost && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-16 left-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ transform: 'translateX(-50%)', background: '#D85A30', color: 'white' }}
          >
            <Heart size={16} fill="white" />
            <span className="text-sm font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>−1 srdce</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Byte companion */}
      <div className="flex justify-center pt-4 pb-2">
        <Byte mood={byteMood} size={80} />
      </div>

      {/* Exercise */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={exerciseIndex}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25 }}
          >
            <ExerciseRenderer
              exercise={current}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ExerciseRenderer({ exercise, onCorrect, onWrong }: {
  exercise: Exercise;
  onCorrect: () => void;
  onWrong: () => void;
}) {
  switch (exercise.type) {
    case 'explain':
      return <ExplainCard exercise={exercise} onNext={() => onCorrect()} />;
    case 'mcq':
      return <McqExercise exercise={exercise} onCorrect={onCorrect} onWrong={onWrong} />;
    case 'fill':
      return <FillExercise exercise={exercise} onCorrect={onCorrect} onWrong={onWrong} />;
    case 'write':
      return <WriteExercise exercise={exercise} onCorrect={onCorrect} onWrong={onWrong} />;
  }
}
