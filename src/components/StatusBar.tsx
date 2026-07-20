'use client';

import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { Flame, Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export default function StatusBar() {
  const { streak, xp } = useUserStore();
  const { locale, setLocale } = useLocaleStore();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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

        {/* Right: Locale dropdown + Settings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#1C1C1C',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1,
              }}
            >
              {locale === 'en' ? '🇬🇧' : '🇸🇰'}
            </button>
            {langOpen && (
              <div style={{
                position: 'absolute', top: 38, right: 0, zIndex: 100,
                background: '#1C1C1C', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, overflow: 'hidden', minWidth: 140,
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              }}>
                {[
                  { code: 'sk' as const, flag: '🇸🇰', label: 'Slovenčina' },
                  { code: 'en' as const, flag: '🇬🇧', label: 'English' },
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                    style={{
                      width: '100%', padding: '10px 14px', border: 'none',
                      background: locale === lang.code ? '#2a2a2a' : 'transparent',
                      color: '#ccc', fontSize: 13, fontWeight: 500,
                      display: 'flex', alignItems: 'center', gap: 10,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{lang.flag}</span>
                    <span>{lang.label}</span>
                    {locale === lang.code && <span style={{ marginLeft: 'auto', color: '#4ade80', fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/settings" style={{ display: 'flex' }}>
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
