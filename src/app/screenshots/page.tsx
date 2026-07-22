'use client';

const screens = [
  {
    badge: 'Learn to Code',
    title: 'Master Python\nStep by Step',
    subtitle: '300+ interactive lessons from beginner to advanced.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-course.png',
  },
  {
    badge: '4 Paths',
    title: 'Choose Your\nLearning Path',
    subtitle: 'Builder, AI Pilot, Mechanic, or Master - pick what fits you.',
    accent: '#a855f7',
    byte: '/byte-ai.png',
    screenshot: '/ss-paths.png',
  },
  {
    badge: 'Lessons',
    title: 'Learn with\nReal Code',
    subtitle: 'Theory, examples, and code snippets in every lesson.',
    accent: '#3b82f6',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-lesson.png',
  },
  {
    badge: 'Quiz',
    title: 'Test Your\nKnowledge',
    subtitle: 'Instant feedback with detailed explanations.',
    accent: '#22d3ee',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-quiz.png',
  },
  {
    badge: 'Arena',
    title: 'Battle Other\nCoders',
    subtitle: 'Challenge other players in real-time quiz battles.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
    screenshot: '/ss-arena.png',
  },
  {
    badge: 'Glossary',
    title: '60+ Terms\nExplained Simply',
    subtitle: 'Search and learn programming terms and abbreviations.',
    accent: '#ec4899',
    byte: '/byte-ai.png',
    screenshot: '/ss-glossary.png',
  },
  {
    badge: 'Workshop',
    title: 'Earn Rewards\nas You Learn',
    subtitle: 'Unlock hats, glasses, auras and more.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
    screenshot: '/ss-locker.png',
  },
  {
    badge: 'Progress',
    title: 'Track Your\nJourney',
    subtitle: 'XP, streaks, and path progress all in one place.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-builder.png',
  },
];

export default function ScreenshotsPage() {
  return (
    <div style={{ background: '#000', padding: 20, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', position: 'fixed', inset: 0, zIndex: 999, overflow: 'auto' }}>
      <p style={{ width: '100%', textAlign: 'center', color: '#555', fontSize: 12 }}>
        App Store Screenshots - Right-click &rarr; Save Image As
      </p>
      {screens.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 1290 / 3, height: 2796 / 3,
            background: '#0F0F0F',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Top: Logo + Byte + Text */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '52px 24px 16px', gap: 10, flexShrink: 0,
            }}>
              {/* Logo */}
              <img src="/logocoduy.png" alt="Coduy" style={{ height: 20, marginBottom: 2 }} />

              {/* Byte with glow */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -24,
                  background: `radial-gradient(circle, ${s.accent}30 0%, ${s.accent}10 50%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(14px)',
                }} />
                <img src={s.byte} alt="Byte" style={{ width: 80, height: 80, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
              </div>

              {/* Badge */}
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${s.accent}33`,
                color: s.accent,
                fontSize: 9, fontWeight: 700, padding: '4px 14px',
                borderRadius: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {s.badge}
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 28, fontWeight: 800, color: '#fff',
                textAlign: 'center', lineHeight: 1.12,
                letterSpacing: '-0.03em', margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {s.title}
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 11, color: 'rgba(255,255,255,0.45)',
                textAlign: 'center', lineHeight: 1.5,
                maxWidth: 260, margin: 0,
              }}>
                {s.subtitle}
              </p>
            </div>

            {/* Screenshot - smaller, pushed up, rounded, floating */}
            <div style={{
              flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
              padding: '0 66px 52px', width: '100%',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                borderRadius: 36,
                overflow: 'hidden',
                border: '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 4px 20px ${s.accent}12, inset 0 0.5px 0 rgba(255,255,255,0.1)`,
              }}>
                <img
                  src={s.screenshot}
                  alt={s.badge}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'top',
                    display: 'block',
                  }}
                />
                {/* Liquid glass reflection at top */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 40,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>
          </div>
          <span style={{ color: '#555', fontSize: 10 }}>#{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
