'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ByteMood } from '@/types';

interface ByteProps {
  mood: ByteMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

// Eye shapes per mood
const eyeShapes: Record<ByteMood, { rx: number; ry: number; dy?: number; opacity?: number; rotate?: number }> = {
  happy:       { rx: 7,  ry: 9,  dy: 0  },
  celebrating: { rx: 9,  ry: 13, dy: -2 },
  sleepy:      { rx: 10, ry: 3,  dy: 3  },
  worried:     { rx: 7,  ry: 8,  dy: 0  },
  proud:       { rx: 9,  ry: 11, dy: -1 },
  low_battery: { rx: 6,  ry: 4,  dy: 2, opacity: 0.4 },
};

const moodColors: Record<ByteMood, string> = {
  happy:       '#4ade80',
  celebrating: '#DEFF4A',
  sleepy:      '#4ade80',
  worried:     '#fb923c',
  proud:       '#DEFF4A',
  low_battery: '#6b7280',
};

const bodyColors: Record<ByteMood, string> = {
  happy:       '#0A0A0A',
  celebrating: '#0A0A0A',
  sleepy:      '#0A0A0A',
  worried:     '#0A0A0A',
  proud:       '#0A0A0A',
  low_battery: '#0A0A0A',
};

export default function Byte({ mood, size = 120, className = '', animate = true }: ByteProps) {
  const eye = eyeShapes[mood];
  const eyeColor = moodColors[mood];
  const eyeOpacity = eye.opacity ?? 1;
  const dy = eye.dy ?? 0;

  // Antenna visible on certain moods
  const showAntenna = mood !== 'low_battery';
  const antennaTip = mood === 'proud' ? '#DEFF4A' : mood === 'celebrating' ? '#DEFF4A' : '#4ade80';

  // Sparkles for celebrating
  const showSparkles = mood === 'celebrating' || mood === 'proud';

  // Worried eyebrow tilt
  const worryTiltL = mood === 'worried' ? 'rotate(-12deg)' : 'rotate(0deg)';
  const worryTiltR = mood === 'worried' ? 'rotate(12deg)' : 'rotate(0deg)';

  // ZZZ for sleepy
  const showZzz = mood === 'sleepy';

  // Battery bar for low_battery
  const showBattery = mood === 'low_battery';

  const floatAnim = animate ? {
    animate: { y: [0, -6, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  } : {};

  const celebrateAnim = animate && mood === 'celebrating' ? {
    animate: { rotate: [-3, 3, -3], y: [0, -8, 0] },
    transition: { duration: 0.5, repeat: Infinity },
  } : {};

  const wobbleAnim = animate && mood === 'worried' ? {
    animate: { rotate: [-2, 2, -2] },
    transition: { duration: 0.8, repeat: Infinity },
  } : {};

  const mainAnim = mood === 'celebrating' ? celebrateAnim : mood === 'worried' ? wobbleAnim : floatAnim;

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...mainAnim}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        {showAntenna && (
          <g>
            <line x1="60" y1="18" x2="60" y2="30" stroke="#888780" strokeWidth="2.5" strokeLinecap="round" />
            <motion.circle
              cx="60" cy="14" r="5"
              fill={antennaTip}
              animate={animate ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ filter: `drop-shadow(0 0 6px ${antennaTip})` }}
            />
          </g>
        )}

        {/* Head */}
        <ellipse
          cx="60" cy="72"
          rx="42" ry="38"
          fill={bodyColors[mood]}
          stroke="white"
          strokeWidth="2.5"
        />

        {/* Left eye */}
        <motion.g
          style={{ transformOrigin: '43px 70px', transform: worryTiltL }}
          animate={animate && mood === 'celebrating' ? { scaleY: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4, repeat: mood === 'celebrating' ? Infinity : 0 }}
        >
          <motion.ellipse
            cx="43"
            cy={70 + dy}
            rx={eye.rx}
            ry={eye.ry}
            fill={eyeColor}
            opacity={eyeOpacity}
            style={{ filter: `drop-shadow(0 0 8px ${eyeColor}) drop-shadow(0 0 16px ${eyeColor})` }}
            animate={animate && mood !== 'sleepy' && mood !== 'low_battery' ? {
              ry: [eye.ry, eye.ry * 0.15, eye.ry],
            } : {}}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
            }}
          />
        </motion.g>

        {/* Right eye */}
        <motion.g
          style={{ transformOrigin: '77px 70px', transform: worryTiltR }}
          animate={animate && mood === 'celebrating' ? { scaleY: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4, repeat: mood === 'celebrating' ? Infinity : 0, delay: 0.1 }}
        >
          <motion.ellipse
            cx="77"
            cy={70 + dy}
            rx={eye.rx}
            ry={eye.ry}
            fill={eyeColor}
            opacity={eyeOpacity}
            style={{ filter: `drop-shadow(0 0 8px ${eyeColor}) drop-shadow(0 0 16px ${eyeColor})` }}
            animate={animate && mood !== 'sleepy' && mood !== 'low_battery' ? {
              ry: [eye.ry, eye.ry * 0.15, eye.ry],
            } : {}}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
              delay: 0.05,
            }}
          />
        </motion.g>

        {/* Smile for happy/celebrating/proud */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'proud') && (
          <path
            d={mood === 'celebrating' ? 'M 44 88 Q 60 100 76 88' : 'M 46 87 Q 60 97 74 87'}
            stroke={eyeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />
        )}

        {/* Star for proud */}
        {mood === 'proud' && (
          <motion.text
            x="90" y="35"
            fontSize="16"
            textAnchor="middle"
            animate={animate ? { scale: [1, 1.4, 1], rotate: [0, 20, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '90px 30px' }}
          >
            ⭐
          </motion.text>
        )}

        {/* ZZZ for sleepy */}
        {showZzz && (
          <g>
            <motion.text x="88" y="45" fontSize="11" fill="#888780"
              animate={animate ? { opacity: [0, 1, 0], y: [0, -8, -16] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}>Z</motion.text>
            <motion.text x="96" y="32" fontSize="9" fill="#888780"
              animate={animate ? { opacity: [0, 1, 0], y: [0, -6, -12] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>z</motion.text>
          </g>
        )}

        {/* Battery for low_battery */}
        {showBattery && (
          <g>
            <rect x="75" y="50" width="28" height="14" rx="3" stroke="#888780" strokeWidth="1.5" fill="none"/>
            <rect x="103" y="54" width="3" height="6" rx="1" fill="#888780"/>
            <rect x="76.5" y="51.5" width="6" height="11" rx="2" fill="#D85A30" opacity={0.8}/>
          </g>
        )}

        {/* Sparkles for celebrating */}
        {showSparkles && (
          <>
            <motion.text x="18" y="50" fontSize="14"
              animate={animate ? { opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              style={{ transformOrigin: '18px 50px' }}>✦</motion.text>
            <motion.text x="96" y="55" fontSize="12"
              animate={animate ? { opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              style={{ transformOrigin: '96px 55px' }}>✦</motion.text>
            <motion.text x="25" y="90" fontSize="10"
              animate={animate ? { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              style={{ transformOrigin: '25px 90px' }}>✦</motion.text>
          </>
        )}
      </svg>
    </motion.div>
  );
}
