'use client';

import StatusBar from '@/components/StatusBar';
import TheoryHub from '@/components/TheoryHub';
import CodingPath from '@/components/CodingPath';
import NameModal from '@/components/NameModal';
import Byte from '@/components/Byte';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s, skLessons, skStreak } from '@/data/strings';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Heart, Trophy, BookOpen, Info } from 'lucide-react';

const greetings = (name: string, streak: number, locale: 'en' | 'sk', lessonsCount: number) => {
  const h = new Date().getHours();
  const timeEn = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const timeSk = h < 12 ? 'Dobré ráno' : h < 18 ? 'Ahoj' : 'Dobrý večer';

  if (locale === 'sk') {
    if (lessonsCount === 0) return `${timeSk}, ${name}.`;
    if (streak === 0) return `${timeSk}, ${name}.`;
    if (streak === 1) return `${timeSk}, ${name}. 1-dňový streak.`;
    return `${timeSk}, ${name}. ${streak}-dňový streak.`;
  }
  if (lessonsCount === 0) return `${timeEn}, ${name}.`;
  if (streak <= 1) return `${timeEn}, ${name}.`;
  if (streak < 7) return `${timeEn}, ${name}. ${streak}-day streak.`;
  return `${timeEn}, ${name}. ${streak}-day streak - impressive.`;
};

const COUNTDOWN_ENABLED = false;
const COUNTDOWN_TARGET = new Date('2026-07-08T09:00:00+02:00'); // 48h from now

function CountdownOverlay() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, COUNTDOWN_TARGET.getTime() - Date.now());
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
    }}>
      <img src="/logocoduy.png" alt="Coduy" style={{ height: 40, objectFit: 'contain' }} />
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { val: timeLeft.h, label: 'hours' },
          { val: timeLeft.m, label: 'min' },
          { val: timeLeft.s, label: 'sec' },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              minWidth: 80,
            }}>
              {String(val).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 13, color: '#555', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { checkStreak, name, byteMood, equipment, streak, completedLessons, xp, hearts, maxHearts, gems, coffees } = useUserStore();
  const { locale } = useLocaleStore();

  useEffect(() => { checkStreak(); }, []);

  if (COUNTDOWN_ENABLED && Date.now() < COUNTDOWN_TARGET.getTime()) {
    return <CountdownOverlay />;
  }

  return (
    <div className="page-shell">
      <NameModal />

      <div className="dashboard">
        <StatusBar />

        <div className="dashboard-content">
          {/* Main column */}
          <div className="dashboard-main">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}
            >
              <Byte mood={byteMood} size={72} equipment={equipment} />
              <div>
                <h1 style={{ fontWeight: 700, fontSize: 24, color: '#EDEDED', marginBottom: 4, letterSpacing: '-0.03em' }}>
                  {name ? greetings(name, streak, locale, completedLessons.length) : 'Coduy'}
                </h1>
                <p style={{ fontSize: 14, color: '#999', lineHeight: 1.5 }}>
                  {completedLessons.length === 0
                    ? s('pickLesson', locale)
                    : `${skLessons(completedLessons.length, locale)}.`
                  }
                </p>
              </div>
            </motion.div>

            {/* Theory Hub - reading section */}
            <TheoryHub />

            {/* Coding - hands-on exercises */}
            <CodingPath />
          </div>

          {/* Right sidebar - stats (desktop only) */}
          <div className="dashboard-sidebar">
            <h3 style={{ fontWeight: 700, fontSize: 13, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              {s('yourStats', locale)}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: Flame, value: skStreak(streak, locale), label: s('dayStreakLabel', locale), tooltip: s('streakTooltip', locale), iconColor: streak > 0 ? '#fff' : '#555' },
                { icon: Zap, value: xp.toLocaleString(), label: s('totalXp', locale), tooltip: s('xpTooltip', locale), iconColor: '#fff' },
                { icon: BookOpen, value: completedLessons.length, label: s('lessonsDone', locale), tooltip: s('lessonsTooltip', locale), iconColor: '#fff' },
              ].map(({ icon: Icon, value, label, tooltip, iconColor }) => (
                <div className="stat-card" key={label} style={{ position: 'relative' }}>
                  <div className="stat-card-icon">
                    <Icon size={18} color={iconColor} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="stat-card-value">{value}</div>
                    <div className="stat-card-label">{label}</div>
                  </div>
                  <div className="stat-info-trigger" style={{ position: 'relative', cursor: 'pointer' }}>
                    <Info size={13} color="#333" />
                    <div className="stat-info-tooltip">{tooltip}</div>
                  </div>
                </div>
              ))}

              <div className="stat-card" style={{ position: 'relative' }}>
                <div className="stat-card-icon">
                  <Trophy size={18} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="stat-card-value">{gems}</div>
                  <div className="stat-card-label">{s('gems', locale)}</div>
                </div>
                <div className="stat-info-trigger" style={{ position: 'relative', cursor: 'pointer' }}>
                  <Info size={13} color="#333" />
                  <div className="stat-info-tooltip">{s('gemsTooltip', locale)}</div>
                </div>
              </div>

            </div>

            {/* Byte character + mini leaderboard on desktop */}
            <div style={{ marginTop: 20, padding: 24, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, textAlign: 'center' }}>
              <Byte mood={byteMood} size={100} equipment={equipment} />
              <p style={{ fontSize: 13, color: '#888', marginTop: 8, marginBottom: 16 }}>
                {byteMood === 'celebrating' ? s('greatJob', locale) : byteMood === 'worried' ? s('keepTrying', locale) : byteMood === 'proud' ? s('onFire', locale) : s('readyToLearn', locale)}
              </p>

              {/* Mini leaderboard */}
              {(() => {
                const rank = Math.max(1, Math.floor(10000 / Math.max(1, xp)));
                const fakeUsers = [
                  { name: 'Matej', xp: Math.floor(xp * 1.4), rank: Math.max(1, rank - 2) },
                  { name: 'Sofia', xp: Math.floor(xp * 1.15), rank: Math.max(1, rank - 1) },
                  { name: name || 'You', xp, rank, isYou: true },
                  { name: 'Lukáš', xp: Math.floor(xp * 0.85), rank: rank + 1 },
                  { name: 'Emma', xp: Math.floor(xp * 0.7), rank: rank + 2 },
                ];
                return (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {locale === 'sk' ? 'Rebríček' : 'Leaderboard'}
                    </div>
                    {fakeUsers.map((u, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                        borderTop: i > 0 ? '1px solid #111' : 'none',
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: u.isYou ? '#4ade80' : '#444', width: 24 }}>#{u.rank}</span>
                        <span style={{ fontSize: 12, fontWeight: u.isYou ? 700 : 500, color: u.isYou ? '#4ade80' : '#888', flex: 1 }}>{u.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#555' }}>{u.xp.toLocaleString()} XP</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
