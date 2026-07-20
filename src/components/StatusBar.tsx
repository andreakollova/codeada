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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', height: 44 }}>

        {/* Left: Streak + XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Flame size={14} color={streak > 0 ? '#EDEDED' : '#3A3A3A'} fill={streak > 0 ? '#EDEDED' : 'none'} />
            <span style={{ fontWeight: 600, fontSize: 13, color: streak > 0 ? '#EDEDED' : '#3A3A3A' }}>
              {streak}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Zap size={13} color="#EDEDED" fill="#EDEDED" />
            <span style={{ fontWeight: 600, fontSize: 13, color: '#EDEDED' }}>
              {xp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Right: Locale + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={toggle}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 10, fontWeight: 700, color: '#888',
              letterSpacing: '0.02em', padding: 0, lineHeight: 1,
            }}
            title={s('switchLang', locale)}
          >
            {locale === 'en' ? 'EN' : 'SK'}
          </button>

          <Link href="/settings">
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#1C1C1C',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Settings size={14} color="#6E6E6E" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
