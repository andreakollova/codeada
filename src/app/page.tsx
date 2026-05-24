'use client';

import StatusBar from '@/components/StatusBar';
import LessonPath from '@/components/LessonPath';
import NameModal from '@/components/NameModal';
import Byte from '@/components/Byte';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const greetings = (name: string, streak: number) => {
  if (streak === 0) return `Vitaj späť, ${name}.`;
  if (streak === 1) return `Ahoj, ${name}. Prvý deň séria.`;
  if (streak < 7)  return `Ahoj, ${name}. ${streak} dní za sebou.`;
  return `Ahoj, ${name}. ${streak} dní — to je sila.`;
};

export default function HomePage() {
  const { checkStreak, name, byteMood, equipment, streak, completedLessons } = useUserStore();

  useEffect(() => { checkStreak(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F' }}>
      <NameModal />
      <StatusBar />

      {/* Hero */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}
        >
          <Byte mood={byteMood} size={72} equipment={equipment} />
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 4 }}>
              {name ? greetings(name, streak) : 'CodeByte'}
            </h1>
            <p style={{ fontSize: 13, color: '#6E6E6E', lineHeight: 1.5 }}>
              {completedLessons.length === 0
                ? 'Vyber lekciu a začni programovať.'
                : `${completedLessons.length} ${completedLessons.length === 1 ? 'lekcia' : 'lekcií'} dokončených.`
              }
            </p>
          </div>
        </motion.div>

        <LessonPath />
      </div>
    </div>
  );
}
