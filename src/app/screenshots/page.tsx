'use client';

const screens = [
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1a10 100%)',
    badge: 'Learn to Code',
    title: 'Master Python\nStep by Step',
    subtitle: '290+ interactive lessons from beginner to advanced.',
    accent: '#4ade80',
    byte: '/byte-builder.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #0a1020 100%)',
    badge: 'Quiz Arena',
    title: 'Battle Other\nCoders',
    subtitle: 'Test your skills in real-time quiz battles.',
    accent: '#22d3ee',
    byte: '/byte-mechanic.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a1a 100%)',
    badge: 'Write Code',
    title: 'Type Real\nCode',
    subtitle: 'Fill-in-the-blank and write-code exercises.',
    accent: '#a855f7',
    byte: '/byte-ai.png',
  },
  {
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #1a1200 100%)',
    badge: 'Daily Widget',
    title: 'Learn a New\nTerm Every Day',
    subtitle: 'Home screen widget with programming glossary.',
    accent: '#f59e0b',
    byte: '/byte-master.png',
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
          justifyContent: 'space-between',
          padding: '50px 32px 40px',
          position: 'relative',
        }}>
          {/* Logo top */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logocoduy.png" alt="Coduy" style={{ height: 24 }} />
          </div>

          {/* Center - Byte + text */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* Byte character with glow */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -30,
                background: `radial-gradient(circle, ${s.accent}40 0%, ${s.accent}15 40%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(20px)',
              }} />
              <img src={s.byte} alt="Byte" style={{ width: 140, height: 140, objectFit: 'contain', position: 'relative', zIndex: 1 }} />
            </div>

            {/* Badge */}
            <div style={{
              background: s.accent, color: '#000',
              fontSize: 11, fontWeight: 800, padding: '4px 14px',
              borderRadius: 20, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {s.badge}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 38, fontWeight: 800, color: '#fff',
              textAlign: 'center', lineHeight: 1.1,
              letterSpacing: '-0.03em', margin: 0,
              whiteSpace: 'pre-line',
            }}>
              {s.title}
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.5)',
              textAlign: 'center', lineHeight: 1.5,
              maxWidth: 260, margin: 0,
            }}>
              {s.subtitle}
            </p>
          </div>

          {/* Bottom dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[0, 1, 2, 3].map(j => (
              <div key={j} style={{
                width: 8, height: 8, borderRadius: 4,
                background: j === i ? s.accent : 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
