'use client';

import { useUserStore } from '@/store/userStore';
import { Flame, Zap, Heart, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function StatusBar() {
  const { streak, xp, hearts, maxHearts } = useUserStore();

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #1a1a1a', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>

        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Flame size={17} color={streak > 0 ? '#fff' : '#444'} fill={streak > 0 ? '#fff' : 'none'} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: streak > 0 ? '#fff' : '#444' }}>
            {streak}
          </span>
        </div>

        {/* XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={16} color="#fff" fill="#fff" />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>
            {xp.toLocaleString()} XP
          </span>
        </div>

        {/* Hearts */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: maxHearts }).map((_, i) => (
            <Heart key={i} size={15} fill={i < hearts ? '#fff' : 'none'} color={i < hearts ? '#fff' : '#333'} />
          ))}
        </div>

        {/* Workshop link */}
        <Link href="/workshop">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 32, height: 32, borderRadius: 8, background: '#111', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Wrench size={15} color="#888" />
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
