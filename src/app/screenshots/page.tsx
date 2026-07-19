'use client';

const screens = [
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
    badge: 'Learn to Code',
    title: 'Master Python\nStep by Step',
    subtitle: '290+ interactive lessons from beginner to advanced.',
    accent: '#4ade80',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
    badge: 'Quiz Arena',
    title: 'Battle Other\nCoders',
    subtitle: 'Test your skills in real-time quiz battles.',
    accent: '#22d3ee',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 100%)',
    badge: 'Write Code',
    title: 'Type Real\nCode',
    subtitle: 'Fill-in-the-blank and write-code exercises.',
    accent: '#a855f7',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a1200 100%)',
    badge: 'Daily Widget',
    title: 'Learn a New\nTerm Every Day',
    subtitle: 'Home screen widget with programming glossary.',
    accent: '#f59e0b',
  },
];

export default function ScreenshotsPage() {
  return (
    <div style={{ background: '#000', padding: 20, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
      <p style={{ width: '100%', textAlign: 'center', color: '#555', fontSize: 12 }}>
        Right-click each → Save Image As (or screenshot on iPhone: 1290x2796)
      </p>
      {screens.map((s, i) => (
        <div key={i} style={{
          width: 375, height: 812,
          background: s.bg,
          borderRadius: 20,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 32px',
          position: 'relative',
        }}>
          {/* Coduy logo */}
          <div style={{ position: 'absolute', top: 50, left: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{ width: 5, height: 6, borderRadius: '50%', background: '#fff', position: 'absolute', left: 7, top: 11 }} />
              <div style={{ width: 5, height: 6, borderRadius: '50%', background: '#fff', position: 'absolute', right: 7, top: 11 }} />
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#fff', position: 'absolute', top: -5 }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>coduy</span>
          </div>

          {/* Badge */}
          <div style={{
            background: s.accent, color: '#000',
            fontSize: 11, fontWeight: 800, padding: '4px 14px',
            borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            {s.badge}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 42, fontWeight: 800, color: '#fff',
            textAlign: 'center', lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 16,
            whiteSpace: 'pre-line',
          }}>
            {s.title}
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.6)',
            textAlign: 'center', lineHeight: 1.5,
            maxWidth: 280,
          }}>
            {s.subtitle}
          </p>

          {/* Decorative dots */}
          <div style={{ position: 'absolute', bottom: 60, display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3].map(j => (
              <div key={j} style={{
                width: 8, height: 8, borderRadius: 4,
                background: j === i ? s.accent : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>

          {/* Bottom accent line */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
            background: s.accent, opacity: 0.5,
          }} />
        </div>
      ))}
    </div>
  );
}
