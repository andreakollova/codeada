'use client';

const screens = [
  {
    bg: '#0F0F0F',
    badge: 'Learn to Code',
    title: 'Master Python\nStep by Step',
    subtitle: '300+ interactive lessons from beginner to advanced.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
    screenshot: '/ss-course.png',
  },
  {
    bg: '#0F0F0F',
    badge: '4 Paths',
    title: 'Choose Your\nLearning Path',
    subtitle: 'Builder, AI Pilot, Mechanic, or Master - pick what fits you.',
    accent: '#a855f7',
    byte: '/byte-ai.png',
    screenshot: '/ss-paths.png',
  },
  {
    bg: '#0F0F0F',
    badge: 'Lessons',
    title: 'Learn with\nReal Code',
    subtitle: 'Theory, examples, and code snippets in every lesson.',
    accent: '#3b82f6',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-lesson.png',
  },
  {
    bg: '#0F0F0F',
    badge: 'Quiz',
    title: 'Test Your\nKnowledge',
    subtitle: 'Instant feedback with detailed explanations.',
    accent: '#22d3ee',
    byte: '/byte-mechanic.png',
    screenshot: '/ss-quiz.png',
  },
  {
    bg: '#0F0F0F',
    badge: 'Arena',
    title: 'Battle Other\nCoders',
    subtitle: 'Challenge other players in real-time quiz battles.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
    screenshot: '/ss-arena.png',
  },
  {
    bg: '#0F0F0F',
    badge: 'Glossary',
    title: '60+ Terms\nExplained Simply',
    subtitle: 'Search and learn programming terms and abbreviations.',
    accent: '#ec4899',
    byte: '/byte-ai.png',
    screenshot: '/ss-glossary.png',
  },
  {
    bg: '#0F0F0F',
    badge: 'Workshop',
    title: 'Earn Rewards\nas You Learn',
    subtitle: 'Unlock hats, glasses, auras and more for your Byte.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
    screenshot: '/ss-locker.png',
  },
  {
    bg: 'linear-gradient(170deg, #0a0a0a 0%, #0a2618 60%, #0d3520 100%)',
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
            {/* Top section - text + byte - compact */}
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '28px 24px 8px', gap: 6, flexShrink: 0,
            }}>
              {/* Logo */}
              <img src="/logocoduy.png" alt="Coduy" style={{ height: 16, marginBottom: 2 }} />

              {/* Badge */}
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${s.accent}44`,
                color: s.accent,
                fontSize: 8, fontWeight: 700, padding: '3px 12px',
                borderRadius: 16, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {s.badge}
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: '#fff',
                textAlign: 'center', lineHeight: 1.15,
                letterSpacing: '-0.03em', margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {s.title}
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 9, color: 'rgba(255,255,255,0.45)',
                textAlign: 'center', lineHeight: 1.4,
                maxWidth: 220, margin: 0,
              }}>
                {s.subtitle}
              </p>
            </div>

            {/* iPhone mockup */}
            <div style={{
              flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
              paddingTop: 8, width: '100%',
            }}>
              {/* iPhone frame */}
              <div style={{
                width: '78%',
                height: '100%',
                position: 'relative',
              }}>
                {/* Side button - right (power) */}
                <div style={{
                  position: 'absolute', right: -3, top: 50, width: 3, height: 32,
                  background: '#2a2a2a', borderRadius: '0 2px 2px 0',
                }} />
                {/* Side buttons - left (volume up) */}
                <div style={{
                  position: 'absolute', left: -3, top: 36, width: 3, height: 18,
                  background: '#2a2a2a', borderRadius: '2px 0 0 2px',
                }} />
                {/* Side buttons - left (volume down) */}
                <div style={{
                  position: 'absolute', left: -3, top: 60, width: 3, height: 18,
                  background: '#2a2a2a', borderRadius: '2px 0 0 2px',
                }} />

                {/* Phone body */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#000',
                  borderRadius: '30px 30px 0 0',
                  overflow: 'hidden',
                  border: '3px solid #2a2a2a',
                  borderBottom: 'none',
                  boxShadow: `0 -8px 40px ${s.accent}15, 0 0 60px rgba(0,0,0,0.5)`,
                  position: 'relative',
                }}>
                  {/* Dynamic Island */}
                  <div style={{
                    position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                    width: 68, height: 16, background: '#000', borderRadius: 20,
                    zIndex: 2,
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
                  }} />
                  {/* Screen content */}
                  <div style={{
                    width: '100%', height: '100%',
                    overflow: 'hidden',
                    borderRadius: '27px 27px 0 0',
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
                  </div>
                </div>
              </div>
            </div>

            {/* Byte floating on the side */}
            <div style={{
              position: 'absolute',
              bottom: 60,
              right: 12,
              zIndex: 3,
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -14,
                  background: `radial-gradient(circle, ${s.accent}35 0%, ${s.accent}10 50%, transparent 70%)`,
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                }} />
                <img src={s.byte} alt="Byte" style={{ width: 48, height: 48, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
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
