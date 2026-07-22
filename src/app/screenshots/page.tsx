'use client';

const screens = [
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
    badge: 'Learn to Code',
    title: 'Master Python\nStep by Step',
    subtitle: '300+ interactive lessons from beginner to advanced.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-course.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 100%)',
    badge: '4 Paths',
    title: 'Choose Your\nLearning Path',
    subtitle: 'Builder, AI Pilot, Mechanic, or Master - pick what fits you.',
    accent: '#a855f7',
    byte: '/byte-ai.png',
    screenshot: '/ss-paths.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
    badge: 'Lessons',
    title: 'Learn with\nReal Code',
    subtitle: 'Theory, examples, and code snippets in every lesson.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-lesson.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1020 100%)',
    badge: 'Quiz',
    title: 'Test Your\nKnowledge',
    subtitle: 'Instant feedback with detailed explanations.',
    accent: '#22d3ee',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-quiz.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1020 100%)',
    badge: 'Arena',
    title: 'Battle Other\nCoders',
    subtitle: 'Challenge bots in real-time quiz battles.',
    accent: '#22d3ee',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-arena.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
    badge: 'Glossary',
    title: '60+ Terms\nExplained Simply',
    subtitle: 'Search and learn programming terms and abbreviations.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-glossary.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a1200 100%)',
    badge: 'Workshop',
    title: 'Earn Rewards\nas You Learn',
    subtitle: 'Unlock hats, glasses, auras and more for your Byte.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
    screenshot: '/ss-locker.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
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
        App Store Screenshots - 1290x2796 (6.7&quot;) - Right-click &rarr; Save Image As
      </p>
      {screens.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 1290 / 3, height: 2796 / 3,
            background: s.bg,
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}>
            {/* Top section - text + byte */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '36px 24px 16px', gap: 10, flexShrink: 0,
            }}>
              {/* Logo */}
              <img src="/logocoduy.png" alt="Coduy" style={{ height: 18, marginBottom: 4 }} />

              {/* Byte with glow */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -20,
                  background: `radial-gradient(circle, ${s.accent}40 0%, ${s.accent}15 40%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(16px)',
                }} />
                <img src={s.byte} alt="Byte" style={{ width: 72, height: 72, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
              </div>

              {/* Badge */}
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${s.accent}44`,
                color: s.accent,
                fontSize: 9, fontWeight: 700, padding: '4px 14px',
                borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {s.badge}
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 24, fontWeight: 700, color: '#fff',
                textAlign: 'center', lineHeight: 1.1,
                letterSpacing: '-0.03em', margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {s.title}
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 10, color: 'rgba(255,255,255,0.5)',
                textAlign: 'center', lineHeight: 1.4,
                maxWidth: 240, margin: 0,
              }}>
                {s.subtitle}
              </p>
            </div>

            {/* Phone mockup with screenshot */}
            <div style={{
              flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
              paddingBottom: 0, width: '100%',
            }}>
              <div style={{
                width: '78%',
                height: '62%',
                background: '#1a1a1a',
                borderRadius: '24px 24px 0 0',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.1)',
                borderBottom: 'none',
                boxShadow: `0 -8px 40px ${s.accent}20, 0 0 60px rgba(0,0,0,0.5)`,
                position: 'relative',
              }}>
                {/* Notch */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 80, height: 16, background: '#000', borderRadius: '0 0 12px 12px',
                  zIndex: 2,
                }} />
                <img
                  src={s.screenshot}
                  alt={s.badge}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'top',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </div>
          <span style={{ color: '#555', fontSize: 10 }}>#{i + 1}</span>
        </div>
      ))}
      <p style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 13, marginTop: 20 }}>
        Right-click each screenshot &rarr; &quot;Save Image As&quot;
      </p>
    </div>
  );
}
