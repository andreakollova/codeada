'use client';

import { useUserStore } from '@/store/userStore';
import { Flame, Zap, Heart, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function StatusBar() {
  const { streak, xp, hearts, maxHearts } = useUserStore();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(15,15,15,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0, padding: '0 16px', height: 52 }}>

        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <Flame size={15} color={streak > 0 ? '#EDEDED' : '#3A3A3A'} fill={streak > 0 ? '#EDEDED' : 'none'} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: streak > 0 ? '#EDEDED' : '#3A3A3A' }}>
            {streak}
          </span>
        </div>

        {/* XP — center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
          <Zap size={14} color="#EDEDED" fill="#EDEDED" />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: '#EDEDED' }}>
            {xp.toLocaleString()} XP
          </span>
        </div>

        {/* Hearts + workshop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: maxHearts }).map((_, i) => (
              <Heart key={i} size={13} fill={i < hearts ? '#EDEDED' : 'none'} color={i < hearts ? '#EDEDED' : '#3A3A3A'} />
            ))}
          </div>
          <Link href="/workshop">
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Wrench size={13} color="#6E6E6E" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
