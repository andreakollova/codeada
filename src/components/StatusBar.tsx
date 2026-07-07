'use client';

import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { Flame, Zap, Heart, Wrench, Globe } from 'lucide-react';
import Link from 'next/link';

export default function StatusBar() {
  const { streak, xp, hearts, maxHearts } = useUserStore();
  const { locale, toggle } = useLocaleStore();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(15,15,15,0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0, padding: '0 24px', height: 52 }}>

        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <Flame size={15} color={streak > 0 ? '#EDEDED' : '#3A3A3A'} fill={streak > 0 ? '#EDEDED' : 'none'} />
          <span style={{ fontWeight: 600, fontSize: 13, color: streak > 0 ? '#EDEDED' : '#3A3A3A' }}>
            {streak}
          </span>
        </div>

        {/* XP — center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
          <Zap size={14} color="#EDEDED" fill="#EDEDED" />
          <span style={{ fontWeight: 600, fontSize: 13, color: '#EDEDED' }}>
            {xp.toLocaleString()} XP
          </span>
        </div>

        {/* Hearts + locale + workshop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: maxHearts }).map((_, i) => (
              <Heart key={i} size={13} fill={i < hearts ? '#EDEDED' : 'none'} color={i < hearts ? '#EDEDED' : '#3A3A3A'} />
            ))}
          </div>

          {/* Language toggle */}
          <button
            onClick={toggle}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#aaa',
              letterSpacing: '0.02em',
            }}
            title={locale === 'en' ? 'Switch to Slovak' : 'Prepnúť na angličtinu'}
          >
            {locale === 'en' ? 'EN' : 'SK'}
          </button>

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
