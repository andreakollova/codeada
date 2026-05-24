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

// Eye shapes per mood (rx, ry, dy)
const eyes: Record<ByteMood, { rx: number; ry: number; dy: number; opacity: number }> = {
  happy:       { rx: 7,  ry: 9,  dy: 0,  opacity: 1   },
  celebrating: { rx: 9,  ry: 13, dy: -2, opacity: 1   },
  sleepy:      { rx: 11, ry: 2.5,dy: 3,  opacity: 0.7 },
  worried:     { rx: 7,  ry: 8,  dy: 0,  opacity: 1   },
  proud:       { rx: 9,  ry: 12, dy: -1, opacity: 1   },
  low_battery: { rx: 6,  ry: 3,  dy: 2,  opacity: 0.3 },
};

export default function Byte({ mood, size = 120, className = '', animate = true, equipment = {} }: ByteProps) {
  const eye = eyes[mood];

  const floatAnim = animate ? { animate: { y: [0, -5, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } } : {};
  const celebAnim = animate && mood === 'celebrating' ? { animate: { rotate: [-3, 3, -3], y: [0, -8, 0] }, transition: { duration: 0.45, repeat: Infinity } } : {};
  const wobbleAnim = animate && mood === 'worried' ? { animate: { rotate: [-2, 2, -2] }, transition: { duration: 0.8, repeat: Infinity } } : {};
  const mainAnim = mood === 'celebrating' ? celebAnim : mood === 'worried' ? wobbleAnim : floatAnim;

  const blinkAnim = animate && mood !== 'sleepy' && mood !== 'low_battery' ? {
    animate: { ry: [eye.ry, eye.ry * 0.1, eye.ry] },
    transition: { duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' as const },
  } : {};

  const worryL = mood === 'worried' ? 'rotate(-14deg)' : 'none';
  const worryR = mood === 'worried' ? 'rotate(14deg)' : 'none';

  return (
    <motion.div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }} {...mainAnim}>
      <svg width={size} height={size} viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* === ANTENNA === */}
        <AntennaTip type={equipment.antenna} animate={animate} />

        {/* Antenna stem */}
        <line x1="60" y1="20" x2="60" y2="32" stroke="#555" strokeWidth="2" strokeLinecap="round"/>

        {/* === HAT (renders above head) === */}
        {equipment.hat && <HatItem id={equipment.hat} />}

        {/* HEAD */}
        <ellipse cx="60" cy="75" rx="40" ry="36" fill="#0A0A0A" stroke="white" strokeWidth="2"/>

        {/* === GLASSES (renders over head, under eyes clip) === */}
        {equipment.glasses && <GlassesItem id={equipment.glasses} />}

        {/* LEFT EYE */}
        <motion.g style={{ transformOrigin: '43px 73px', transform: worryL }}>
          <motion.ellipse
            cx="43" cy={73 + eye.dy}
            rx={eye.rx} ry={eye.ry}
            fill="white" opacity={eye.opacity}
            style={{ filter: eye.opacity > 0.5 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }}
            {...blinkAnim}
          />
        </motion.g>

        {/* RIGHT EYE */}
        <motion.g style={{ transformOrigin: '77px 73px', transform: worryR }}>
          <motion.ellipse
            cx="77" cy={73 + eye.dy}
            rx={eye.rx} ry={eye.ry}
            fill="white" opacity={eye.opacity}
            style={{ filter: eye.opacity > 0.5 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }}
            {...(blinkAnim.animate ? { ...blinkAnim, transition: { ...blinkAnim.transition, delay: 0.05 } } : {})}
          />
        </motion.g>

        {/* SMILE */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'proud') && (
          <path
            d={mood === 'celebrating' ? 'M 44 90 Q 60 102 76 90' : 'M 47 89 Q 60 99 73 89'}
            stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none"
          />
        )}

        {/* LOW BATTERY indicator */}
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
            <motion.text x="88" y="50" fontSize="11" fill="rgba(255,255,255,0.4)" fontFamily="Syne,sans-serif"
              animate={animate ? { opacity: [0, 0.6, 0], y: [0, -8, -14] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}>Z</motion.text>
            <motion.text x="97" y="38" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="Syne,sans-serif"
              animate={animate ? { opacity: [0, 0.5, 0], y: [0, -6, -10] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>z</motion.text>
          </>
        )}

        {/* SPARKLES celebrating */}
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

        {/* === ACCESSORY (bow tie etc — renders below head bottom) === */}
        {equipment.accessory && <AccessoryItem id={equipment.accessory} />}
      </svg>
    </motion.div>
  );
}

/* ---- Sub-components for equipment ---- */

function AntennaTip({ type, animate }: { type?: string; animate: boolean }) {
  if (!type) {
    return (
      <motion.circle cx="60" cy="14" r="5" fill="white" opacity={0.9}
        animate={animate ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }}
      />
    );
  }
  if (type === 'ant-heart') return (
    <motion.path d="M60,8 C60,8 53,2 53,7 C53,11 57,13 60,18 C63,13 67,11 67,7 C67,2 60,8 60,8 Z"
      fill="white" opacity={0.9}
      animate={animate ? { scale: [1, 1.2, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
    />
  );
  if (type === 'ant-star') return (
    <motion.polygon points="60,2 62,8 68,8 63,11 65,17 60,13 55,17 57,11 52,8 58,8"
      fill="white" opacity={0.9}
      animate={animate ? { rotate: [0, 15, 0, -15, 0] } : {}} transition={{ duration: 3, repeat: Infinity }}
      style={{ transformOrigin: '60px 10px', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }}
    />
  );
  if (type === 'ant-lightning') return (
    <motion.polygon points="63,0 55,10 61,10 57,20 66,8 60,8"
      fill="white" opacity={0.9}
      animate={animate ? { opacity: [0.6, 1, 0.6] } : {}} transition={{ duration: 0.8, repeat: Infinity }}
      style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.7))' }}
    />
  );
  return null;
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
      {/* Cap board */}
      <rect x="28" y="42" width="64" height="6" rx="2" fill="#111" stroke="white" strokeWidth="1.5"/>
      {/* Top */}
      <polygon points="60,28 30,48 90,48" fill="#111" stroke="white" strokeWidth="1.5"/>
      {/* Tassel */}
      <line x1="82" y1="42" x2="88" y2="56" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <circle cx="88" cy="58" r="3" fill="white" opacity={0.8}/>
    </g>
  );
  if (id === 'hat-crown') return (
    <g>
      <polygon points="34,50 42,34 50,44 60,28 70,44 78,34 86,50"
        fill="#111" stroke="white" strokeWidth="1.5"/>
      <rect x="34" y="48" width="52" height="8" rx="2" fill="#111" stroke="white" strokeWidth="1"/>
      {[42, 60, 78].map(x => <circle key={x} cx={x} cy="38" r="3" fill="white" opacity={0.8}/>)}
    </g>
  );
  if (id === 'hat-cowboy') return (
    <g>
      {/* Brim */}
      <ellipse cx="60" cy="52" rx="40" ry="6" fill="#111" stroke="white" strokeWidth="1.5"/>
      {/* Crown */}
      <path d="M36,52 C36,52 32,28 60,28 C88,28 84,52 84,52 Z" fill="#111" stroke="white" strokeWidth="1.5"/>
      {/* Band */}
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
  return null;
}

function GlassesItem({ id }: { id: string }) {
  const eyeY = 73;
  if (id === 'glasses-round') return (
    <g stroke="white" strokeWidth="1.8" fill="none" opacity={0.85}>
      <circle cx="43" cy={eyeY} r="14"/>
      <circle cx="77" cy={eyeY} r="14"/>
      <line x1="57" y1={eyeY} x2="63" y2={eyeY}/>
      <line x1="19" y1={eyeY - 2} x2="29" y2={eyeY}/>
      <line x1="91" y1={eyeY} x2="101" y2={eyeY - 2}/>
    </g>
  );
  if (id === 'glasses-cool') return (
    <g stroke="white" strokeWidth="1.8" fill="#111" opacity={0.9}>
      <rect x="29" y={eyeY - 10} width="28" height="14" rx="4"/>
      <rect x="63" y={eyeY - 10} width="28" height="14" rx="4"/>
      <line x1="57" y1={eyeY - 3} x2="63" y2={eyeY - 3}/>
      <line x1="18" y1={eyeY - 5} x2="29" y2={eyeY - 5}/>
      <line x1="91" y1={eyeY - 5} x2="102" y2={eyeY - 5}/>
    </g>
  );
  if (id === 'glasses-mono') return (
    <g stroke="white" strokeWidth="1.8" fill="none" opacity={0.9}>
      <circle cx="43" cy={eyeY} r="13"/>
      <line x1="56" y1={eyeY - 4} x2="70" y2={eyeY - 8}/>
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
  if (id === 'acc-medal') return (
    <g>
      <line x1="60" y1="110" x2="60" y2="118" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <circle cx="60" cy="122" r="7" fill="#111" stroke="white" strokeWidth="1.5"/>
      <text x="60" y="126" textAnchor="middle" fontSize="8" fill="white" fontFamily="Syne,sans-serif">1</text>
    </g>
  );
  return null;
}
