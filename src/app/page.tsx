'use client';

import StatusBar from '@/components/StatusBar';
import LessonPath from '@/components/LessonPath';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { checkStreak } = useUserStore();
  useEffect(() => { checkStreak(); }, []);

  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <StatusBar />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 20px 8px' }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', margin: 0 }}>
            CodeByte
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>
            Nauč sa programovať. Krok za krokom.
          </p>
        </motion.div>
      </div>
      <LessonPath />
    </main>
  );
}
