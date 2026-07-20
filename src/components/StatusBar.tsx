'use client';

import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { Flame, Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function StatusBar() {
  const { streak, xp } = useUserStore();
  const { locale, toggle } = useLocaleStore();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: '#0F0F0F',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      paddingTop: 'max(env(safe-area-inset-top, 0px), 50px)',
    }}>
      <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0, padding: '0 12px', height: 48 }}>

        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <Flame size={15} color={streak > 0 ? '#EDEDED' : '#3A3A3A'} fill={streak > 0 ? '#EDEDED' : 'none'} />
          <span style={{ fontWeight: 600, fontSize: 13, color: streak > 0 ? '#EDEDED' : '#3A3A3A' }}>
            {streak}
          </span>
        </div>

        {/* XP - center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
          <Zap size={14} color="#EDEDED" fill="#EDEDED" />
          <span style={{ fontWeight: 600, fontSize: 13, color: '#EDEDED' }}>
            {xp.toLocaleString()} XP
          </span>
        </div>

        {/* Locale + settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          {/* Language toggle */}
          <button
            onClick={toggle}
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 10, fontWeight: 600, color: '#999',
              letterSpacing: '0.02em', padding: 0, boxSizing: 'border-box',
              lineHeight: 1,
            }}
            title={s('switchLang', locale)}
          >
            {locale === 'en' ? 'EN' : 'SK'}
          </button>

          <Link href="/settings">
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Settings size={13} color="#6E6E6E" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
