'use client';

import StatusBar from '@/components/StatusBar';
import LessonPath from '@/components/LessonPath';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { checkStreak, byteMood } = useUserStore();

  useEffect(() => {
    checkStreak();
  }, []);

  return (
    <main style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <StatusBar />
      {/* App title */}
      <div className="max-w-lg mx-auto px-4 pt-6 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-baseline gap-2"
        >
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: '#DEFF4A' }}>
            CodeByte
          </h1>
          <span className="text-sm" style={{ color: '#888780' }}>— nauč sa programovať</span>
        </motion.div>
      </div>
      <LessonPath />
    </main>
  );
}
