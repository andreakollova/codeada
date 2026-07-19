'use client';

import { motion } from 'framer-motion';
import { ByteMood, ByteEquipment } from '@/types';

interface ByteProps {
  mood: ByteMood;
  size?: number;
  className?: string;
  animate?: boolean;
  equipment?: ByteEquipment;
}

const eyes: Record<ByteMood, { rx: number; ry: number; dy: number; opacity: number }> = {
  happy:       { rx: 7,  ry: 9,  dy: 0,  opacity: 1   },
  celebrating: { rx: 9,  ry: 13, dy: -2, opacity: 1   },
  sleepy:      { rx: 11, ry: 2.5,dy: 3,  opacity: 0.7 },
  worried:     { rx: 7,  ry: 8,  dy: 0,  opacity: 1   },
  proud:       { rx: 9,  ry: 12, dy: -1, opacity: 1   },
  low_battery: { rx: 6,  ry: 3,  dy: 2,  opacity: 0.3 },
};

// Aura color configs
const auraColors: Record<string, { c1: string; c2: string; c3?: string }> = {
  'aura-soft':    { c1: 'rgba(255,255,255,0.08)', c2: 'rgba(255,255,255,0.03)' },
  'aura-blue':    { c1: 'rgba(74,158,255,0.15)',  c2: 'rgba(74,158,255,0.05)' },
  'aura-green':   { c1: 'rgba(74,222,128,0.15)',  c2: 'rgba(74,222,128,0.05)' },
  'aura-fire':    { c1: 'rgba(255,100,30,0.35)',   c2: 'rgba(255,60,10,0.15)',  c3: 'rgba(255,200,50,0.2)' },
  'aura-water':   { c1: 'rgba(30,144,255,0.3)',    c2: 'rgba(0,100,255,0.12)',  c3: 'rgba(100,200,255,0.15)' },
  'aura-earth':   { c1: 'rgba(139,119,80,0.3)',    c2: 'rgba(74,222,128,0.15)', c3: 'rgba(200,170,100,0.1)' },
  'aura-air':     { c1: 'rgba(200,230,255,0.25)',   c2: 'rgba(180,220,255,0.1)', c3: 'rgba(255,255,255,0.15)' },
  'aura-golden':  { c1: 'rgba(245,158,11,0.4)',    c2: 'rgba(255,200,50,0.15)', c3: 'rgba(255,230,100,0.2)' },
  'aura-galaxy':  { c1: 'rgba(168,85,247,0.18)',   c2: 'rgba(59,130,246,0.1)',  c3: 'rgba(236,72,153,0.08)' },
  'aura-void':    { c1: 'rgba(255,51,102,0.35)',    c2: 'rgba(168,85,247,0.25)', c3: 'rgba(0,0,0,0.3)' },
  'aura-cosmic':  { c1: 'rgba(168,85,247,0.4)',    c2: 'rgba(255,51,102,0.25)', c3: 'rgba(59,130,246,0.2)' },
  'aura-pro':     { c1: 'rgba(74,222,128,0.4)',   c2: 'rgba(34,211,238,0.3)',  c3: 'rgba(168,85,247,0.25)' },
};

export default function Byte({ mood, size = 120, className = '', animate = true, equipment = {} }: ByteProps) {
  const eye = eyes[mood];

  const floatAnim = animate ? { animate: { y: [0, -2, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } } : {};
  const celebAnim = animate && mood === 'celebrating' ? { animate: { rotate: [-3, 3, -3], y: [0, -8, 0] }, transition: { duration: 0.45, repeat: Infinity } } : {};
  const wobbleAnim = animate && mood === 'worried' ? { animate: { rotate: [-2, 2, -2] }, transition: { duration: 0.8, repeat: Infinity } } : {};
  const mainAnim = mood === 'celebrating' ? celebAnim : mood === 'worried' ? wobbleAnim : floatAnim;

  const blinkAnim = animate && mood !== 'sleepy' && mood !== 'low_battery' ? {
    animate: { ry: [eye.ry, eye.ry * 0.1, eye.ry] },
    transition: { duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' as const },
  } : {};

  const worryL = mood === 'worried' ? 'rotate(-14deg)' : 'none';
  const worryR = mood === 'worried' ? 'rotate(14deg)' : 'none';

  const aura = equipment.aura ? auraColors[equipment.aura] : null;

  return (
    <motion.div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size, position: 'relative' }} {...mainAnim}>

      {/* === AURA EFFECT === */}
      {aura && animate && <AuraEffect auraId={equipment.aura!} colors={aura} size={size} />}

      <svg width={size} height={size} viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>

        {/* === ANTENNA === */}
        <AntennaTip type={equipment.antenna} animate={animate} />
        <line x1="60" y1="20" x2="60" y2="32" stroke="#555" strokeWidth="2" strokeLinecap="round"/>

        {/* === HAT === */}
        {equipment.hat && <HatItem id={equipment.hat} />}

        {/* HEAD */}
        <ellipse cx="60" cy="75" rx="40" ry="36" fill="#0A0A0A" stroke="white" strokeWidth="2"/>

        {/* === GLASSES === */}
        {equipment.glasses && <GlassesItem id={equipment.glasses} />}

        {/* LEFT EYE */}
        <motion.g style={{ transformOrigin: '43px 73px', transform: worryL }}>
          <motion.ellipse cx="43" cy={73 + eye.dy} rx={eye.rx} ry={eye.ry}
            fill="white" opacity={eye.opacity}
            style={{ filter: eye.opacity > 0.5 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }}
            {...blinkAnim} />
        </motion.g>

        {/* RIGHT EYE */}
        <motion.g style={{ transformOrigin: '77px 73px', transform: worryR }}>
          <motion.ellipse cx="77" cy={73 + eye.dy} rx={eye.rx} ry={eye.ry}
            fill="white" opacity={eye.opacity}
            style={{ filter: eye.opacity > 0.5 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }}
            {...(blinkAnim.animate ? { ...blinkAnim, transition: { ...blinkAnim.transition, delay: 0.05 } } : {})} />
        </motion.g>

        {/* SMILE */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'proud') && (
          <path d={mood === 'celebrating' ? 'M 44 90 Q 60 102 76 90' : 'M 47 89 Q 60 99 73 89'}
            stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* LOW BATTERY */}
        {mood === 'low_battery' && (
          <g>
            <rect x="74" y="56" width="24" height="12" rx="2.5" stroke="#555" strokeWidth="1.5" fill="none"/>
            <rect x="98" y="59" width="3" height="6" rx="1" fill="#555"/>
            <rect x="75.5" y="57.5" width="5" height="9" rx="1.5" fill="rgba(255,255,255,0.25)"/>
          </g>
        )}

        {/* ZZZ sleepy */}
        {mood === 'sleepy' && (
          <>
            <motion.text x="88" y="50" fontSize="11" fill="rgba(255,255,255,0.4)"
              animate={animate ? { opacity: [0, 0.6, 0], y: [0, -8, -14] } : {}}
              transition={{ duration: 2, repeat: Infinity }}>Z</motion.text>
            <motion.text x="97" y="38" fontSize="8" fill="rgba(255,255,255,0.3)"
              animate={animate ? { opacity: [0, 0.5, 0], y: [0, -6, -10] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>z</motion.text>
          </>
        )}

        {/* SPARKLES */}
        {(mood === 'celebrating' || mood === 'proud') && (
          <>
            {[{ x: 16, y: 55, d: 0 }, { x: 100, y: 58, d: 0.3 }, { x: 22, y: 95, d: 0.6 }].map((s, i) => (
              <motion.text key={i} x={s.x} y={s.y} fontSize="13" fill="rgba(255,255,255,0.7)"
                textAnchor="middle"
                animate={animate ? { opacity: [0, 0.8, 0], scale: [0.4, 1.1, 0.4] } : {}}
                transition={{ duration: 1, repeat: Infinity, delay: s.d }}
                style={{ transformOrigin: `${s.x}px ${s.y}px` }}>✦</motion.text>
            ))}
          </>
        )}

        {/* === ACCESSORY === */}
        {equipment.accessory && <AccessoryItem id={equipment.accessory} />}
      </svg>
    </motion.div>
  );
}

/* ============ AURA EFFECT ============ */

function AuraEffect({ auraId, colors, size }: { auraId: string; colors: { c1: string; c2: string; c3?: string }; size: number }) {
  const isMythic = auraId.includes('void') || auraId.includes('cosmic');
  const isLegendary = auraId.includes('golden') || auraId.includes('galaxy');
  const isEpic = !isMythic && !isLegendary && (auraId.includes('fire') || auraId.includes('water') || auraId.includes('earth') || auraId.includes('air'));

  return (
    <div style={{ position: 'absolute', inset: -size * 0.15, zIndex: 1, pointerEvents: 'none' }}>
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isMythic ? 4 : isLegendary ? 6 : 8, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: `conic-gradient(from 0deg, ${colors.c1}, ${colors.c2}, ${colors.c3 || colors.c1}, ${colors.c2}, ${colors.c1})`,
          filter: `blur(${isMythic ? 16 : isLegendary ? 12 : 8}px)`,
        }}
      />

      {/* Inner pulse */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: isMythic ? 1.5 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: '10%', borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.c1}, transparent 70%)`,
          filter: `blur(${isMythic ? 10 : 6}px)`,
        }}
      />

      {/* Mythic particles */}
      {isMythic && (
        <>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              animate={{
                rotate: [i * 60, i * 60 + 360],
                scale: [0.5, 1, 0.5],
                opacity: [0, 0.9, 0],
              }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: 4, height: 4, borderRadius: '50%',
                background: i % 2 === 0 ? colors.c1 : (colors.c3 || colors.c2),
                boxShadow: `0 0 8px ${colors.c1}`,
                transformOrigin: `0 -${size * 0.4}px`,
              }}
            />
          ))}
        </>
      )}

      {/* Legendary sparkles */}
      {isLegendary && (
        <>
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
              style={{
                position: 'absolute',
                top: `${20 + i * 20}%`,
                left: `${10 + (i % 2) * 70}%`,
                width: 3, height: 3, borderRadius: '50%',
                background: colors.c1,
                boxShadow: `0 0 6px ${colors.c1}`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

/* ============ EQUIPMENT SUB-COMPONENTS ============ */

function AntennaTip({ type, animate }: { type?: string; animate: boolean }) {
  // Epic+ antenna tips get colored glow
  const getGlow = (id: string) => {
    if (id.includes('flame') || id.includes('fire') || id.includes('sun')) return 'drop-shadow(0 0 8px rgba(255,100,30,0.7))';
    if (id.includes('frost') || id.includes('crystal')) return 'drop-shadow(0 0 8px rgba(100,180,255,0.7))';
    if (id.includes('golden')) return 'drop-shadow(0 0 10px rgba(245,158,11,0.8))';
    if (id.includes('blackhole') || id.includes('void')) return 'drop-shadow(0 0 12px rgba(168,85,247,0.8))';
    return 'drop-shadow(0 0 6px rgba(255,255,255,0.5))';
  };

  if (!type) {
    return (
      <motion.circle cx="60" cy="14" r="5" fill="white" opacity={0.9}
        animate={animate ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }} />
    );
  }
  if (type === 'ant-heart') return (
    <motion.path d="M60,8 C60,8 53,2 53,7 C53,11 57,13 60,18 C63,13 67,11 67,7 C67,2 60,8 60,8 Z"
      fill="white" opacity={0.9}
      animate={animate ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: getGlow(type) }} />
  );
  if (type === 'ant-star') return (
    <motion.polygon points="60,2 62,8 68,8 63,11 65,17 60,13 55,17 57,11 52,8 58,8"
      fill="white" opacity={0.9}
      animate={animate ? { rotate: [0, 15, 0, -15, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: getGlow(type) }} />
  );
  if (type === 'ant-lightning') return (
    <motion.polygon points="63,0 55,10 61,10 57,20 66,8 60,8"
      fill="white" opacity={0.9}
      animate={animate ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 0.8, repeat: Infinity }}
      style={{ filter: getGlow(type) }} />
  );
  if (type === 'ant-diamond') return (
    <motion.polygon points="60,2 67,10 60,18 53,10"
      fill="white" opacity={0.9}
      animate={animate ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: getGlow(type) }} />
  );
  if (type === 'ant-flame-orb') return (
    <motion.circle cx="60" cy="12" r="7" fill="#ff6030" opacity={0.9}
      animate={animate ? { scale: [0.9, 1.2, 0.9], opacity: [0.7, 1, 0.7] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
      style={{ filter: 'drop-shadow(0 0 10px rgba(255,80,20,0.8))' }} />
  );
  if (type === 'ant-frost-crystal') return (
    <motion.polygon points="60,2 64,8 70,10 64,12 60,18 56,12 50,10 56,8"
      fill="#80d0ff" opacity={0.9}
      animate={animate ? { rotate: [0, 90, 180, 270, 360] } : {}}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '60px 10px', filter: 'drop-shadow(0 0 8px rgba(100,180,255,0.8))' }} />
  );
  if (type === 'ant-golden-star') return (
    <motion.polygon points="60,0 62.5,7 70,8 64,13 66,20 60,16 54,20 56,13 50,8 57.5,7"
      fill="#f5a623" opacity={0.95}
      animate={animate ? { scale: [1, 1.2, 1], rotate: [0, 10, 0, -10, 0] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.9))' }} />
  );
  if (type === 'ant-sun') return (
    <motion.circle cx="60" cy="12" r="8" fill="#f5a623" opacity={0.95}
      animate={animate ? { scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] } : {}}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{ filter: 'drop-shadow(0 0 14px rgba(245,158,11,1))' }} />
  );
  if (type === 'ant-blackhole') return (
    <>
      <motion.circle cx="60" cy="12" r="6" fill="#111"
        animate={animate ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.9))' }} />
      <motion.circle cx="60" cy="12" r="10" fill="none" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5"
        animate={animate ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '60px 12px' }} />
    </>
  );
  return (
    <motion.circle cx="60" cy="14" r="5" fill="white" opacity={0.9}
      animate={animate ? { scale: [1, 1.25, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ filter: getGlow(type) }} />
  );
}

function HatItem({ id }: { id: string }) {
  if (id === 'hat-beanie') return (
    <g>
      <ellipse cx="60" cy="40" rx="30" ry="16" fill="#111" stroke="white" strokeWidth="1.5"/>
      <rect x="30" y="50" width="60" height="7" rx="3.5" fill="#1a1a1a" stroke="white" strokeWidth="1"/>
      <circle cx="60" cy="26" r="8" fill="white" opacity={0.9}/>
    </g>
  );
  if (id === 'hat-graduation') return (
    <g>
      <rect x="28" y="42" width="64" height="6" rx="2" fill="#111" stroke="white" strokeWidth="1.5"/>
      <polygon points="60,28 30,48 90,48" fill="#111" stroke="white" strokeWidth="1.5"/>
      <line x1="82" y1="42" x2="88" y2="56" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <circle cx="88" cy="58" r="3" fill="white" opacity={0.8}/>
    </g>
  );
  if (id === 'hat-crown' || id === 'hat-golden-crown') return (
    <g style={id === 'hat-golden-crown' ? { filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' } : {}}>
      <polygon points="34,50 42,34 50,44 60,28 70,44 78,34 86,50"
        fill={id === 'hat-golden-crown' ? '#1a1200' : '#111'} stroke={id === 'hat-golden-crown' ? '#f5a623' : 'white'} strokeWidth="1.5"/>
      <rect x="34" y="48" width="52" height="8" rx="2" fill={id === 'hat-golden-crown' ? '#1a1200' : '#111'} stroke={id === 'hat-golden-crown' ? '#f5a623' : 'white'} strokeWidth="1"/>
      {[42, 60, 78].map(x => <circle key={x} cx={x} cy="38" r="3" fill={id === 'hat-golden-crown' ? '#f5a623' : 'white'} opacity={0.8}/>)}
    </g>
  );
  if (id === 'hat-cowboy') return (
    <g>
      <ellipse cx="60" cy="52" rx="40" ry="6" fill="#111" stroke="white" strokeWidth="1.5"/>
      <path d="M36,52 C36,52 32,28 60,28 C88,28 84,52 84,52 Z" fill="#111" stroke="white" strokeWidth="1.5"/>
      <path d="M36,52 C36,46 84,46 84,52" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
    </g>
  );
  if (id === 'hat-party') return (
    <g>
      <polygon points="60,22 38,56 82,56" fill="#111" stroke="white" strokeWidth="1.5"/>
      <circle cx="60" cy="22" r="4" fill="white"/>
      {[{ x: 48, y: 44 }, { x: 60, y: 36 }, { x: 72, y: 44 }].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="white" opacity={0.6}/>
      ))}
    </g>
  );
  if (id === 'hat-headband') return (
    <g>
      <rect x="25" y="48" width="70" height="6" rx="3" fill="#111" stroke="white" strokeWidth="1.2"/>
    </g>
  );
  if (id === 'hat-pilot') return (
    <g>
      <ellipse cx="60" cy="42" rx="32" ry="18" fill="#111" stroke="white" strokeWidth="1.5"/>
      <rect x="28" y="50" width="64" height="6" rx="3" fill="#1a1a1a" stroke="white" strokeWidth="1"/>
      <circle cx="60" cy="34" r="8" fill="#1a1a1a" stroke="white" strokeWidth="1.2"/>
    </g>
  );
  if (id === 'hat-fire-crown') return (
    <g style={{ filter: 'drop-shadow(0 0 10px rgba(255,80,20,0.6))' }}>
      <polygon points="34,50 42,34 50,44 60,28 70,44 78,34 86,50"
        fill="#1a0800" stroke="#ff6030" strokeWidth="1.5"/>
      <rect x="34" y="48" width="52" height="8" rx="2" fill="#1a0800" stroke="#ff6030" strokeWidth="1"/>
      {[42, 60, 78].map(x => <circle key={x} cx={x} cy="38" r="3" fill="#ff6030" opacity={0.9}/>)}
    </g>
  );
  if (id === 'hat-ice-crown') return (
    <g style={{ filter: 'drop-shadow(0 0 10px rgba(100,180,255,0.6))' }}>
      <polygon points="34,50 42,34 50,44 60,28 70,44 78,34 86,50"
        fill="#001020" stroke="#80d0ff" strokeWidth="1.5"/>
      <rect x="34" y="48" width="52" height="8" rx="2" fill="#001020" stroke="#80d0ff" strokeWidth="1"/>
      {[42, 60, 78].map(x => <circle key={x} cx={x} cy="38" r="3" fill="#80d0ff" opacity={0.9}/>)}
    </g>
  );
  if (id === 'hat-samurai') return (
    <g>
      <path d="M25,52 L60,22 L95,52 Z" fill="#111" stroke="white" strokeWidth="1.5"/>
      <rect x="30" y="48" width="60" height="8" rx="2" fill="#111" stroke="white" strokeWidth="1"/>
      <circle cx="60" cy="36" r="5" fill="white" opacity={0.3}/>
    </g>
  );
  if (id === 'hat-galaxy') return (
    <g style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.5))' }}>
      <ellipse cx="60" cy="40" rx="34" ry="18" fill="#0a0020" stroke="#a855f7" strokeWidth="1.5"/>
      <rect x="26" y="48" width="68" height="8" rx="3" fill="#0a0020" stroke="#a855f7" strokeWidth="1"/>
      {[40, 55, 70, 80].map((x, i) => <circle key={i} cx={x} cy={36 + (i % 2) * 4} r="1.5" fill={i % 2 === 0 ? '#a855f7' : '#60a5fa'} opacity={0.8}/>)}
    </g>
  );
  if (id === 'hat-void-crown') return (
    <g style={{ filter: 'drop-shadow(0 0 14px rgba(255,51,102,0.7))' }}>
      <polygon points="34,50 42,34 50,44 60,24 70,44 78,34 86,50"
        fill="#0a0010" stroke="#ff3366" strokeWidth="2"/>
      <rect x="34" y="48" width="52" height="8" rx="2" fill="#0a0010" stroke="#ff3366" strokeWidth="1.5"/>
      {[42, 60, 78].map(x => <circle key={x} cx={x} cy="38" r="3.5" fill="#ff3366" opacity={0.9}/>)}
    </g>
  );
  return null;
}

function GlassesItem({ id }: { id: string }) {
  const eyeY = 73;
  if (id === 'glasses-round' || id === 'glasses-reading') return (
    <g stroke="white" strokeWidth="1.8" fill="none" opacity={0.85}>
      <circle cx="43" cy={eyeY} r="14"/>
      <circle cx="77" cy={eyeY} r="14"/>
      <line x1="57" y1={eyeY} x2="63" y2={eyeY}/>
      <line x1="19" y1={eyeY - 2} x2="29" y2={eyeY}/>
      <line x1="91" y1={eyeY} x2="101" y2={eyeY - 2}/>
    </g>
  );
  if (id === 'glasses-cool' || id === 'glasses-aviator') return (
    <g stroke="white" strokeWidth="1.8" fill="#111" opacity={0.9}>
      <rect x="29" y={eyeY - 10} width="28" height="14" rx="4"/>
      <rect x="63" y={eyeY - 10} width="28" height="14" rx="4"/>
      <line x1="57" y1={eyeY - 3} x2="63" y2={eyeY - 3}/>
      <line x1="18" y1={eyeY - 5} x2="29" y2={eyeY - 5}/>
      <line x1="91" y1={eyeY - 5} x2="102" y2={eyeY - 5}/>
    </g>
  );
  if (id === 'glasses-mono' || id === 'glasses-golden') return (
    <g stroke={id === 'glasses-golden' ? '#f5a623' : 'white'} strokeWidth="1.8" fill="none" opacity={0.9}
      style={id === 'glasses-golden' ? { filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' } : {}}>
      <circle cx="43" cy={eyeY} r="13"/>
      <line x1="56" y1={eyeY - 4} x2="70" y2={eyeY - 8}/>
    </g>
  );
  if (id === 'glasses-flame') return (
    <g stroke="#ff6030" strokeWidth="1.8" fill="rgba(255,80,20,0.15)" opacity={0.9}
      style={{ filter: 'drop-shadow(0 0 6px rgba(255,80,20,0.5))' }}>
      <rect x="29" y={eyeY - 10} width="28" height="14" rx="4"/>
      <rect x="63" y={eyeY - 10} width="28" height="14" rx="4"/>
      <line x1="57" y1={eyeY - 3} x2="63" y2={eyeY - 3}/>
    </g>
  );
  if (id === 'glasses-frost') return (
    <g stroke="#80d0ff" strokeWidth="1.8" fill="rgba(100,180,255,0.1)" opacity={0.9}
      style={{ filter: 'drop-shadow(0 0 6px rgba(100,180,255,0.5))' }}>
      <circle cx="43" cy={eyeY} r="14"/>
      <circle cx="77" cy={eyeY} r="14"/>
      <line x1="57" y1={eyeY} x2="63" y2={eyeY}/>
    </g>
  );
  if (id === 'glasses-laser') return (
    <g stroke="#ff3030" strokeWidth="2" fill="rgba(255,30,30,0.2)" opacity={0.95}
      style={{ filter: 'drop-shadow(0 0 10px rgba(255,30,30,0.7))' }}>
      <rect x="29" y={eyeY - 8} width="28" height="10" rx="5"/>
      <rect x="63" y={eyeY - 8} width="28" height="10" rx="5"/>
      <line x1="57" y1={eyeY - 3} x2="63" y2={eyeY - 3}/>
    </g>
  );
  if (id === 'glasses-void') return (
    <g stroke="#ff3366" strokeWidth="2" fill="rgba(255,51,102,0.15)" opacity={0.95}
      style={{ filter: 'drop-shadow(0 0 12px rgba(255,51,102,0.6))' }}>
      <circle cx="43" cy={eyeY} r="14"/>
      <circle cx="77" cy={eyeY} r="14"/>
      <line x1="57" y1={eyeY} x2="63" y2={eyeY}/>
    </g>
  );
  return null;
}

function AccessoryItem({ id }: { id: string }) {
  if (id === 'acc-bowtie') return (
    <g transform="translate(60, 110)" opacity={0.9}>
      <polygon points="-14,-6 0,0 14,-6 14,6 0,0 -14,6" fill="#111" stroke="white" strokeWidth="1.5"/>
      <circle cx="0" cy="0" r="3" fill="white"/>
    </g>
  );
  if (id === 'acc-scarf') return (
    <g opacity={0.9}>
      <path d="M28,105 C28,105 40,98 60,100 C80,102 92,95 92,105 C92,112 80,116 60,114 C40,112 28,112 28,105 Z"
        fill="#111" stroke="white" strokeWidth="1.5"/>
      <path d="M60,100 L58,120 L68,118 L66,100" fill="#111" stroke="white" strokeWidth="1"/>
    </g>
  );
  if (id === 'acc-medal' || id === 'acc-chain') return (
    <g>
      <line x1="60" y1="110" x2="60" y2="118" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <circle cx="60" cy="122" r="7" fill="#111" stroke="white" strokeWidth="1.5"/>
      <text x="60" y="126" textAnchor="middle" fontSize="8" fill="white">★</text>
    </g>
  );
  if (id === 'acc-fire-cape') return (
    <g style={{ filter: 'drop-shadow(0 0 8px rgba(255,80,20,0.5))' }}>
      <path d="M30,100 C30,100 35,120 60,125 C85,120 90,100 90,100 L85,115 C85,115 70,128 60,130 C50,128 35,115 35,115 Z"
        fill="#1a0800" stroke="#ff6030" strokeWidth="1.5"/>
    </g>
  );
  if (id === 'acc-crystal') return (
    <g style={{ filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.5))' }}>
      <line x1="60" y1="108" x2="60" y2="114" stroke="rgba(74,222,128,0.6)" strokeWidth="1.5"/>
      <polygon points="60,114 55,120 60,128 65,120" fill="#0a1a10" stroke="#4ade80" strokeWidth="1.5"/>
    </g>
  );
  if (id === 'acc-wings-gold') return (
    <g style={{ filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.5))' }}>
      <path d="M28,85 C20,80 10,90 15,100 C18,95 25,92 30,95 Z" fill="#1a1200" stroke="#f5a623" strokeWidth="1.5"/>
      <path d="M92,85 C100,80 110,90 105,100 C102,95 95,92 90,95 Z" fill="#1a1200" stroke="#f5a623" strokeWidth="1.5"/>
    </g>
  );
  if (id === 'acc-diamond') return (
    <g>
      <line x1="60" y1="110" x2="60" y2="116" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <polygon points="60,116 54,122 60,130 66,122" fill="#111" stroke="white" strokeWidth="1.5"/>
    </g>
  );
  if (id === 'acc-cosmic-cape') return (
    <g style={{ filter: 'drop-shadow(0 0 12px rgba(168,85,247,0.5))' }}>
      <path d="M28,98 C28,98 35,122 60,128 C85,122 92,98 92,98 L88,118 C88,118 72,132 60,134 C48,132 32,118 32,118 Z"
        fill="#0a0020" stroke="#a855f7" strokeWidth="1.5"/>
      {[40, 55, 70].map((x, i) => <circle key={i} cx={x} cy={115 + i * 3} r="1.5" fill={i % 2 === 0 ? '#a855f7' : '#ff3366'} opacity={0.7}/>)}
    </g>
  );
  return null;
}
