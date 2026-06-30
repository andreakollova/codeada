'use client';

import StatusBar from '@/components/StatusBar';
import TheoryHub from '@/components/TheoryHub';
import CodingPath from '@/components/CodingPath';
import NameModal from '@/components/NameModal';
import Byte from '@/components/Byte';
import BottomNav from '@/components/BottomNav';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Heart, Trophy, BookOpen } from 'lucide-react';

const greetings = (name: string, streak: number) => {
  if (streak === 0) return `Welcome back, ${name}.`;
  if (streak === 1) return `Hey ${name}. Day one.`;
  if (streak < 7) return `Hey ${name}. ${streak} days in a row.`;
  return `Hey ${name}. ${streak} day streak — impressive.`;
};

export default function HomePage() {
  const { checkStreak, name, byteMood, equipment, streak, completedLessons, xp, hearts, maxHearts, gems } = useUserStore();

  useEffect(() => { checkStreak(); }, []);

  return (
    <div className="page-shell">
      <NameModal />
      <BottomNav />

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
                  {name ? greetings(name, streak) : 'CodeByte'}
                </h1>
                <p style={{ fontSize: 14, color: '#999', lineHeight: 1.5 }}>
                  {completedLessons.length === 0
                    ? 'Pick a lesson and start learning.'
                    : `${completedLessons.length} lesson${completedLessons.length === 1 ? '' : 's'} completed.`
                  }
                </p>
              </div>
            </motion.div>

            {/* Theory Hub — reading section */}
            <TheoryHub />

            {/* Coding — hands-on exercises */}
            <CodingPath />
          </div>

          {/* Right sidebar — stats (desktop only) */}
          <div className="dashboard-sidebar">
            <h3 style={{ fontWeight: 700, fontSize: 13, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Your Stats
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="stat-card">
                <div className="stat-card-icon">
                  <Flame size={18} color={streak > 0 ? '#fff' : '#555'} />
                </div>
                <div>
                  <div className="stat-card-value">{streak}</div>
                  <div className="stat-card-label">Day Streak</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">
                  <Zap size={18} color="#fff" />
                </div>
                <div>
                  <div className="stat-card-value">{xp.toLocaleString()}</div>
                  <div className="stat-card-label">Total XP</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">
                  <BookOpen size={18} color="#fff" />
                </div>
                <div>
                  <div className="stat-card-value">{completedLessons.length}</div>
                  <div className="stat-card-label">Lessons Done</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">
                  <Heart size={18} color={hearts > 2 ? '#fff' : '#888'} />
                </div>
                <div>
                  <div className="stat-card-value">{hearts}/{maxHearts}</div>
                  <div className="stat-card-label">Hearts</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">
                  <Trophy size={18} color="#fff" />
                </div>
                <div>
                  <div className="stat-card-value">{gems}</div>
                  <div className="stat-card-label">Gems</div>
                </div>
              </div>
            </div>

            {/* Byte character on desktop */}
            <div style={{ marginTop: 32, padding: 24, background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, textAlign: 'center' }}>
              <Byte mood={byteMood} size={100} equipment={equipment} />
              <p style={{ fontSize: 13, color: '#888', marginTop: 12 }}>
                {byteMood === 'celebrating' ? 'Great job!' : byteMood === 'worried' ? 'Keep trying!' : byteMood === 'proud' ? 'On fire!' : 'Ready to learn?'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
