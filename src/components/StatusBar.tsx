'use client';

import { useUserStore } from '@/store/userStore';
import { Flame, Gem, Heart, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatusBar() {
  const { streak, gems, hearts, maxHearts, xp } = useUserStore();

  return (
    <div className="sticky top-0 z-50 w-full" style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1E1E1E' }}>
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        {/* Streak */}
        <motion.div
          className="flex items-center gap-1.5"
          whileTap={{ scale: 0.9 }}
        >
          <Flame size={20} className={streak > 0 ? 'text-orange-400' : 'text-gray-600'} fill={streak > 0 ? 'currentColor' : 'none'} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', color: streak > 0 ? '#fb923c' : '#888780' }}>
            {streak}
          </span>
        </motion.div>

        {/* XP */}
        <motion.div
          className="flex items-center gap-1.5"
          whileTap={{ scale: 0.9 }}
        >
          <Trophy size={18} style={{ color: '#DEFF4A' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', color: '#DEFF4A' }}>
            {xp.toLocaleString()}
          </span>
        </motion.div>

        {/* Gems */}
        <motion.div
          className="flex items-center gap-1.5"
          whileTap={{ scale: 0.9 }}
        >
          <Gem size={18} style={{ color: '#60a5fa' }} />
          <span className="font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif', color: '#60a5fa' }}>
            {gems}
          </span>
        </motion.div>

        {/* Hearts */}
        <div className="flex items-center gap-1">
          {Array.from({ length: maxHearts }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={i < hearts ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={17}
                fill={i < hearts ? '#ef4444' : 'none'}
                className={i < hearts ? 'text-red-500' : 'text-gray-700'}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
