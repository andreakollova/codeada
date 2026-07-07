'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Byte from '@/components/Byte';
import { useUserStore } from '@/store/userStore';
import { getLessonById } from '@/data/curriculum';
import { getItemById, rarityConfig } from '@/data/cosmetics';
import { Zap, Flame, ArrowRight, Gift } from 'lucide-react';
import { Suspense, useState } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

const byteMessages = {
  en: [
    'Your first function! I almost short-circuited from joy.',
    'Excellent! Every lesson gets you closer to mastery.',
    'That was fast. I see a future developer in you.',
    "Perfect! Byte is proud. And that's not easy.",
    'I almost forgot to breathe. Wow.',
  ],
  sk: [
    'Tvoja prvá funkcia! Skoro som sa skratoval od radosti.',
    'Výborne! Každá lekcia ťa posúva bližšie k majstrovstvu.',
    'To bolo rýchle. Vidím v tebe budúceho vývojára.',
    'Perfektné! Byte je hrdý. A to nie je jednoduché.',
    'Skoro som zabudol dýchať. Wow.',
  ],
};

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { xp, streak, equipment } = useUserStore();
  const { locale } = useLocaleStore();
  const lessonId = params.get('lessonId') ?? '';
  const xpEarned = parseInt(params.get('xp') ?? '0');
  const rewardId = params.get('reward') ?? '';
  const lesson = getLessonById(lessonId);
  const reward = rewardId ? getItemById(rewardId) : null;
  const [itemRevealed, setItemRevealed] = useState(!reward);

  const msgs = byteMessages[locale];
  const message = msgs[Math.floor(Math.random() * msgs.length)];
  const rc = reward ? rarityConfig[reward.rarity] : null;

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
            {s('lessonComplete', locale)}
          </h1>
          {lesson && <p style={{ color: '#888', fontSize: 14, marginTop: 6 }}>{lesson.title}</p>}
        </motion.div>

        {/* Quote */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          style={{ padding: '14px 18px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16, width: '100%' }}>
          <p style={{ fontSize: 13, color: '#888', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
            &ldquo;{message}&rdquo;
          </p>
          <p style={{ fontSize: 11, color: '#777', margin: '6px 0 0' }}>&mdash; Byte</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {[
            { icon: Zap, label: s('xpEarned', locale), value: `+${xpEarned}` },
            { icon: Flame, label: s('streak', locale), value: `${streak} ${s('days', locale)}` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ padding: '14px 16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={18} color="#fff" />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#888' }}>{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Item reward */}
        {reward && rc && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} style={{ width: '100%' }}>
            <AnimatePresence>
              {!itemRevealed ? (
                <motion.button
                  key="reveal"
                  onClick={() => setItemRevealed(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{
                    width: '100%', padding: '18px', borderRadius: 16,
                    background: '#0a0a0a', border: '1.5px solid #2a2a2a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <Gift size={22} color="#fff" />
                  </motion.div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{s('openReward', locale)}</span>
                </motion.button>
              ) : (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, scale: 0.7, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    padding: '24px 20px', borderRadius: 16, textAlign: 'center',
                    background: '#0a0a0a',
                    border: `2px solid ${rc.border}`,
                    boxShadow: rc.glow !== 'none' ? rc.glow : undefined,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Animated glow background for epic+ */}
                  {(reward.rarity === 'epic' || reward.rarity === 'legendary' || reward.rarity === 'mythic') && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: reward.rarity === 'mythic' ? 4 : 6, repeat: Infinity, ease: 'linear' }}
                      style={{
                        position: 'absolute', inset: -40, borderRadius: '50%',
                        background: `conic-gradient(from 0deg, ${rc.color}22, transparent, ${rc.color}22, transparent)`,
                        filter: 'blur(20px)', zIndex: 0,
                      }}
                    />
                  )}

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Rarity label */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                        color: rc.color, textTransform: 'uppercase', marginBottom: 16,
                      }}
                    >
                      {rc.label}
                    </motion.div>

                    {/* Byte preview with item */}
                    <motion.div
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <Byte mood="proud" size={120} animate={true} equipment={{ [reward.type]: reward.id } as any} />
                    </motion.div>

                    {/* Item info */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      style={{ marginTop: 16 }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>{reward.name}</div>
                      <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>{reward.description}</div>
                      {reward.element && (
                        <div style={{
                          display: 'inline-block', marginTop: 10,
                          fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                          padding: '4px 12px', borderRadius: 20,
                          background: `${rc.color}15`, border: `1px solid ${rc.color}33`, color: rc.color,
                        }}>
                          {reward.element}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Mythic particles */}
                  {reward.rarity === 'mythic' && (
                    <>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -60 - i * 10] }}
                          transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, delay: i * 0.3 }}
                          style={{
                            position: 'absolute',
                            bottom: '30%',
                            left: `${15 + i * 10}%`,
                            width: 3, height: 3, borderRadius: '50%',
                            background: i % 2 === 0 ? rc.color : '#a855f7',
                            boxShadow: `0 0 6px ${rc.color}`,
                            zIndex: 0,
                          }}
                        />
                      ))}
                    </>
                  )}

                  {/* Legendary sparkles */}
                  {reward.rarity === 'legendary' && (
                    <>
                      {[0, 1, 2, 3, 4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0, 0.8, 0], scale: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                          style={{
                            position: 'absolute',
                            top: `${15 + i * 16}%`,
                            left: i % 2 === 0 ? '8%' : '85%',
                            width: 4, height: 4, borderRadius: '50%',
                            background: rc.color,
                            boxShadow: `0 0 8px ${rc.color}`,
                            zIndex: 0,
                          }}
                        />
                      ))}
                    </>
                  )}
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
          {s('nextLesson', locale)}
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
