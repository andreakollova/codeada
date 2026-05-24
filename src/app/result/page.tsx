'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Byte from '@/components/Byte';
import { useUserStore } from '@/store/userStore';
import { getLessonById } from '@/data/curriculum';
import { Trophy, Gem, Flame, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { xp, gems, streak } = useUserStore();
  const lessonId = params.get('lessonId') ?? '';
  const xpEarned = parseInt(params.get('xp') ?? '0');
  const lesson = getLessonById(lessonId);

  const byteMessages = [
    'Tvoja prvá lekcia zvládnutá! Skoro som sa z radosti skratoval. ⚡',
    'Výborne! Každá lekcia ťa posúva bližšie k expertke. 🚀',
    'Úžasné! Toto bol rýchly. Vidím v tebe budúcu programátorku. 💡',
    'Perfektné! Byte je hrdý. A to nie je ľahké. ⭐',
    'Wow, to si zvládla ako pro! Pokračujeme? 🎉',
  ];
  const message = byteMessages[Math.floor(Math.random() * byteMessages.length)];

  const stats = [
    { icon: Trophy, label: 'XP získané', value: `+${xpEarned}`, color: '#DEFF4A' },
    { icon: Gem, label: 'Celkové gemy', value: gems, color: '#60a5fa' },
    { icon: Flame, label: 'Séria', value: `${streak} dní`, color: '#fb923c' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: '#0A0A0A' }}>
      <div className="max-w-lg w-full flex flex-col items-center gap-8">
        {/* Celebration Byte */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <Byte mood="celebrating" size={140} />
        </motion.div>

        {/* Lesson complete */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#DEFF4A' }}>
            Lekcia splnená!
          </h1>
          {lesson && (
            <p className="text-base" style={{ color: '#888780' }}>{lesson.title}</p>
          )}
        </motion.div>

        {/* Byte message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full rounded-2xl p-4"
          style={{ background: '#1E1E1E', border: '1.5px solid #2a2a2a' }}
        >
          <p className="text-sm leading-relaxed text-center" style={{ color: '#c9c7be', fontStyle: 'italic' }}>
            "{message}"
          </p>
          <p className="text-center text-xs mt-2" style={{ color: '#888780' }}>— Byte</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full grid grid-cols-3 gap-3"
        >
          {stats.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="rounded-2xl p-4 flex flex-col items-center gap-2"
              style={{ background: '#1E1E1E', border: `1.5px solid ${color}22` }}
            >
              <Icon size={20} style={{ color }} />
              <span className="text-lg font-black" style={{ color, fontFamily: 'Syne, sans-serif' }}>{value}</span>
              <span className="text-xs text-center" style={{ color: '#888780' }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          onClick={() => router.replace('/')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 glow-acid"
          style={{ background: '#DEFF4A', color: '#0A0A0A', fontFamily: 'Syne, sans-serif' }}
        >
          Ďalšia lekcia
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: '#0A0A0A' }} />}>
      <ResultContent />
    </Suspense>
  );
}
