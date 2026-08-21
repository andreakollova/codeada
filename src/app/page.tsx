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
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry { display_name: string; xp: number; }

// Generate deterministic bot leaderboard — grows by ~3 users/day
function generateBots(): LeaderboardEntry[] {
  const names = [
    'Emma','Liam','Sofia','Noah','Mia','Lucas','Ella','Oliver','Aria','Ethan',
    'Luna','James','Zara','Leo','Nora','Kai','Lily','Finn','Ivy','Oscar',
    'Ruby','Max','Eva','Adam','Sara','Ben','Maya','Tom','Lea','Sam',
    'Nina','Dan','Hana','Alex','Zoe','Jake','Iris','Cole','Ema','Hugo',
    'Anna','Erik','Lucia','Mark','Petra','Jaro','Katka','Filip','Simona','Tomas',
    'Marek','Jana','Patrik','Monika','Lukas','Tereza','Matej','Natalia','David','Veronika',
    'Peter','Alena','Roman','Diana','Jakub','Kristina','Martin','Barbora','Juraj','Lenka',
    'Stefan','Ivana','Andrej','Silvia','Michal','Denisa','Riso','Zuzana','Pavol','Martina',
    'Miro','Danka','Vlado','Erika','Tibor','Renata','Boris','Lucia2','Igor','Andrea2',
    'Otto','Vera','Rado','Sonja','Jozef','Maria','Fero','Dasa','Karol','Betka',
    'Dusan','Gabika','Marcel','Timea','Robert','Tamara','Viktor','Nikola','Adrian','Viki',
    'Simon','Klara','Denis','Sarka','Kevin','Rebeka','Matias','Viktoria','Dominik','Amelia',
    'Leon','Clara','Felix','Stella','Noel','Alma','Aaron','Viola','Ryan','Helena',
    'Tyler','Elisa','Caleb','Freya','Blake','Chloe','Chase','Alina','Kyle','Nadia',
    'Sean','Tina','Joel','Greta','Paul','Lena','Toby','Dora','Jack','Rosa',
    'Owen','Maja','Axel','Lia','Troy','Kira','Dean','Ines','Reid','Tara',
    'Brent','Olga','Carl','Paula','Drew','Rita','Glen','Mara','Hank','Nela',
    'Ivan','Sona','Lars','Nika','Neil','Lina','Ralf','Bela','Aron','Gabi',
    'Emil','Dina','Hans','Lara','Rene','Nina2','Luis','Aneta','Rudo','Linda',
    'Alan','Beata','Chris','Daria','Elias','Flora','Georg','Hanna','Isak','Julia',
    'Kamil','Laura','Matus','Nicol','Oskar','Patrizia','Quentin','Rachel','Samo','Tessa',
    'Uros','Valeria','Walter','Xenia','Yuri','Zlata','Albert','Brigita','Conrad','Dalma',
    'Eduard','Frida','Gustav','Helga','Ilona','Johan','Karla','Leopold','Magda','Norbert',
    'Ondrej','Paulina','Richard','Sabina','Teodor','Ursula','Viliam','Wendel','Xaver','Yvona',
    'Zdeno','Alicia','Bruno','Carmen','Damian','Elina','Fabian','Gloria','Henrik','Ingrid',
    'Jason','Katarina','Lorenzo','Milena','Nathan','Olivia','Patrick','Quinn','Roxana','Sandra',
    'Tristan','Ulrika','Vanesa','Wesley','Ximena','Yasmin','Zoran','Abel','Bianca','Cyril',
    'Dario','Elena','Franco','Gina','Hugo2','Ida','Jiri','Karin','Leos','Monica',
    'Natan','Oleg','Paco','Raisa','Sergio','Tatiana','Urban','Vesna','Xander','Yana',
    'Zita','Anton','Blanka','Cesar','Danka2','Enrico','Fiona','Gregor','Hilda','Imrich',
    'Judit','Klaus','Liana','Milos','Noemi','Omar','Petra2','Rafael','Stella2','Tudor',
    'Ula','Vida','Waldo','Xena','Yolanda','Zeno','Artur','Bozena','Cyrus','Dita',
    'Eugen','Felicia','Goran','Hedviga','Ivor','Joana','Konrad','Livia','Milan','Nadia2',
    'Orest','Paloma','Rasto','Sonja2','Tibor2','Uma','Vilma','Werner','Xeno','Yveta',
  ];
  // Remove any names with numbers
  const cleanNames = names.filter(n => !/\d/.test(n));

  const startDate = new Date('2026-07-01');
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / 86400000);
  const totalBots = 120 + daysSinceStart * 3;

  // Seeded random for consistency within same day
  const seed = (n: number) => {
    let x = Math.sin(n * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  // Shuffle names deterministically
  const shuffled = [...cleanNames].sort((a, b) => seed(a.charCodeAt(0) * 100 + b.charCodeAt(0)) - 0.5);

  const bots: LeaderboardEntry[] = [];
  for (let i = 0; i < totalBots; i++) {
    const name = shuffled[i % shuffled.length];
    // XP: steep decay so many users have low XP (realistic distribution)
    const rank = i + 1;
    const baseXp = Math.round(6000 * Math.pow(0.985, rank));
    const dailyVariation = Math.round(seed(i * 1000 + daysSinceStart) * 40 - 15);
    const xp = Math.max(0, baseXp + dailyVariation);
    bots.push({ display_name: name, xp });
  }
  return bots;
}

const greetings = (name: string, streak: number, locale: 'en' | 'sk', lessonsCount: number) => {
  const h = new Date().getHours();
  const timeEn = h < 12 ? 'Good morning' : h < 17 ? 'Hey' : 'Good evening';
  const timeSk = h < 12 ? 'Dobré ránko' : h < 17 ? 'Čauko' : 'Pekný večer';

  if (locale === 'sk') return `${timeSk}, ${name}.`;
  return `${timeEn}, ${name}.`;
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
  const { name, byteMood, equipment, streak, completedLessons, xp, hearts, maxHearts, gems, coffees } = useUserStore();
  const { locale } = useLocaleStore();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Streak is checked only on real actions (opening lessons, completing quizzes, etc.)

  // Fetch real leaderboard from Supabase
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('user_state').select('display_name, xp').order('xp', { ascending: false }).limit(50);
        const realUsers: LeaderboardEntry[] = (data || []).filter((u: any) => u.display_name && u.xp > 0);
        const bots = generateBots();
        const combined = [...realUsers, ...bots].sort((a, b) => b.xp - a.xp);
        // Deduplicate by name
        const seen = new Set<string>();
        setLeaderboard(combined.filter(u => { if (seen.has(u.display_name)) return false; seen.add(u.display_name); return true; }));
      } catch { }
    })();
  }, []);

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
              style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, marginTop: 16 }}
            >
              <Byte mood={byteMood} size={72} equipment={equipment} />
              <div>
                <h1 style={{ fontWeight: 700, fontSize: 24, color: '#EDEDED', marginBottom: 4, letterSpacing: '-0.03em' }}>
                  {name ? greetings(name, streak, locale, completedLessons.length) : 'Coduy'}
                </h1>
                {streak >= 2 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Flame size={12} color="#f97316" fill="#f97316" style={{ filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.6))' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f97316' }}>
                      {streak}{locale === 'sk' ? '-dňový streak' : '-day streak'}
                    </span>
                  </div>
                )}
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
                { icon: BookOpen, value: completedLessons.filter(l => l.startsWith('theory-')).length, label: s('lessonsDone', locale), tooltip: s('lessonsTooltip', locale), iconColor: '#fff' },
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

              {/* Leaderboard — real users + bots */}
              {leaderboard.length > 0 && (() => {
                // Find current user's rank
                const myIdx = leaderboard.findIndex(u => u.display_name === name);
                const myRank = myIdx >= 0 ? myIdx + 1 : leaderboard.length + 1;
                // Show 3 above + user + 3 below
                const startIdx = Math.max(0, (myIdx >= 0 ? myIdx : leaderboard.length) - 3);
                const slice = leaderboard.slice(startIdx, startIdx + 7);
                // If user not in leaderboard, insert them above others with same XP
                if (myIdx < 0 && name) {
                  const insertIdx = slice.findIndex(u => u.xp <= xp);
                  slice.splice(insertIdx >= 0 ? insertIdx : slice.length, 0, { display_name: name, xp });
                }
                return (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {locale === 'sk' ? 'Rebríček' : 'Leaderboard'}
                    </div>
                    {slice.map((u, i) => {
                      const actualRank = myIdx < 0 && u.display_name === name ? myRank : startIdx + i + 1;
                      const isYou = u.display_name === name;
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: isYou ? '8px 8px' : '8px 0',
                          borderTop: i > 0 ? '1px solid #111' : 'none',
                          background: isYou ? 'rgba(74,222,128,0.04)' : 'transparent',
                          margin: isYou ? '0 -8px' : 0,
                          borderRadius: isYou ? 8 : 0,
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: isYou ? '#4ade80' : '#444', width: 28 }}>#{actualRank}</span>
                          <span style={{ fontSize: 12, fontWeight: isYou ? 700 : 500, color: isYou ? '#4ade80' : '#888', flex: 1 }}>
                            {u.display_name}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#555' }}>{u.xp.toLocaleString()} XP</span>
                        </div>
                      );
                    })}
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
