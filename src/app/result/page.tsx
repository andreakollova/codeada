'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Byte from '@/components/Byte';
import { useUserStore } from '@/store/userStore';
import { getLessonById } from '@/data/curriculum';
import { getItemById, rarityLabel } from '@/data/cosmetics';
import { Zap, Flame, ArrowRight, Gift } from 'lucide-react';
import { Suspense, useState } from 'react';

const byteMessages = [
  'Tvoja prvá funkcia! Skoro som sa z radosti skratoval.',
  'Výborne! Každá lekcia ťa posúva bližšie k expertke.',
  'To bolo rýchle. Vidím v tebe budúcu programátorku.',
  'Perfektné! Byte je hrdý. A to nie je ľahké.',
  'Skoro som zabudol dýchať. Wow.',
];

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { xp, streak, equipment, byteMood } = useUserStore();
  const lessonId = params.get('lessonId') ?? '';
  const xpEarned = parseInt(params.get('xp') ?? '0');
  const rewardId = params.get('reward') ?? '';
  const lesson = getLessonById(lessonId);
  const reward = rewardId ? getItemById(rewardId) : null;
  const [itemRevealed, setItemRevealed] = useState(!reward);

  const message = byteMessages[Math.floor(Math.random() * byteMessages.length)];

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px' }}>
      <div style={{ maxWidth: 440, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Byte */}
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}>
          <Byte mood="celebrating" size={160} equipment={equipment} />
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 800, fontSize: 32, margin: 0, letterSpacing: '-0.03em' }}>
            Lekcia splnená
          </h1>
          {lesson && <p style={{ color: '#555', fontSize: 14, marginTop: 6, fontFamily: 'DM Sans, sans-serif' }}>{lesson.title}</p>}
        </motion.div>

        {/* Quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          style={{ padding: '14px 18px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, width: '100%' }}>
          <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic', margin: 0, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif' }}>
            "{message}"
          </p>
          <p style={{ fontSize: 11, color: '#444', marginTop: 6, margin: '6px 0 0', fontFamily: 'Syne, sans-serif' }}>— Byte</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {[
            { icon: Zap, label: 'XP získané', value: `+${xpEarned}` },
            { icon: Flame, label: 'Séria', value: `${streak} dní` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={18} color="#fff" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Item reward */}
        {reward && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} style={{ width: '100%' }}>
            <AnimatePresence>
              {!itemRevealed ? (
                <motion.button
                  key="reveal"
                  onClick={() => setItemRevealed(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ width: '100%', padding: '18px', borderRadius: 16, background: '#0a0a0a', border: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <Gift size={22} color="#fff" />
                  </motion.div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Otvoriť odmenu</span>
                </motion.button>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  style={{
                    padding: '20px', borderRadius: 16, textAlign: 'center',
                    background: reward.rarity === 'legendary' ? '#0f0f0f' : '#0a0a0a',
                    border: `1.5px solid ${reward.rarity === 'legendary' ? '#fff' : reward.rarity === 'rare' ? '#444' : '#222'}`,
                    boxShadow: reward.rarity === 'legendary' ? '0 0 40px rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#555', textTransform: 'uppercase', marginBottom: 12 }}>
                    Nový predmet
                  </div>
                  <Byte mood="proud" size={100} animate={true} equipment={{ [reward.type]: reward.id } as any} />
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{reward.name}</div>
                    <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{reward.description}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: reward.rarity === 'legendary' ? '#fff' : '#666', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {rarityLabel[reward.rarity]}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <motion.button
          onClick={() => router.replace('/')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reward ? 0.9 : 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#fff', color: '#000', fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', border: 'none' }}
        >
          Ďalšia lekcia
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#000' }} />}>
      <ResultContent />
    </Suspense>
  );
}
