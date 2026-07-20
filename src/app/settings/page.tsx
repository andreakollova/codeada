'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import StatusBar from '@/components/StatusBar';
import AuthModal from '@/components/AuthModal';
import { LogIn, LogOut, Globe, User, Trash2, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const { locale, toggle } = useLocaleStore();
  const { name, setName, coffees, favDrink, setFavDrink } = useUserStore();
  const [authUser, setAuthUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(name || '');

  useEffect(() => {
    const sb = getSupabase();
    if (sb) {
      sb.auth.getSession().then(({ data }) => setAuthUser(data?.session?.user || null));
      sb.auth.onAuthStateChange((_event, session) => setAuthUser(session?.user || null));
    }
  }, []);

  const handleLogout = async () => {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    localStorage.removeItem('coduy-user');
    localStorage.removeItem('coduy-path');
    localStorage.removeItem('coduy-locale');
    window.location.href = '/';
  };

  const handleDeleteData = () => {
    if (confirm(locale === 'sk' ? 'Naozaj chceš vymazať všetky dáta? Toto sa nedá vrátiť.' : 'Really delete all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 24 }}>
          {locale === 'sk' ? 'Nastavenia' : 'Settings'}
        </h1>

        {/* Account */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'sk' ? 'Účet' : 'Account'}
          </h3>

          {authUser ? (
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="#4ade80" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{name || 'User'}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{authUser.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '12px 16px', borderTop: '1px solid #111',
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: '#888', fontSize: 13, fontWeight: 600,
                }}
              >
                <LogOut size={16} />
                {locale === 'sk' ? 'Odhlásiť sa' : 'Log out'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 14,
                background: '#0a0a0a', border: '1px solid #1a1a1a',
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', color: '#ccc', fontSize: 14, fontWeight: 600,
              }}
            >
              <LogIn size={18} color="#4ade80" />
              <span style={{ flex: 1 }}>{locale === 'sk' ? 'Prihlásiť sa' : 'Log in'}</span>
              <ChevronRight size={16} color="#333" />
            </button>
          )}
        </div>

        {/* Preferences */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'sk' ? 'Preferencie' : 'Preferences'}
          </h3>

          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
            {/* Language */}
            <button
              onClick={toggle}
              style={{
                width: '100%', padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <Globe size={16} color="#888" />
              <span style={{ flex: 1, fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                {locale === 'sk' ? 'Jazyk' : 'Language'}
              </span>
              <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>
                {locale === 'sk' ? 'Slovenčina' : 'English'}
              </span>
            </button>

            {/* Name */}
            <div style={{ borderTop: '1px solid #111' }}>
              {editName ? (
                <div style={{ padding: '10px 16px', display: 'flex', gap: 8 }}>
                  <input
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    autoFocus
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#111', border: '1px solid #222', color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                  />
                  <button
                    onClick={() => { if (nameVal.trim()) setName(nameVal.trim()); setEditName(false); }}
                    style={{ padding: '8px 14px', borderRadius: 8, background: '#fff', color: '#000', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer' }}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setNameVal(name || ''); setEditName(true); }}
                  style={{
                    width: '100%', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <User size={16} color="#888" />
                  <span style={{ flex: 1, fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                    {locale === 'sk' ? 'Meno' : 'Name'}
                  </span>
                  <span style={{ fontSize: 13, color: '#888' }}>{name || '-'}</span>
                </button>
              )}
            </div>
            {/* Drink preference */}
            <div style={{ borderTop: '1px solid #111' }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                    {locale === 'sk' ? 'Obľúbený nápoj' : 'Favorite drink'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {([
                    { id: 'coffee' as const, label: locale === 'sk' ? 'Káva' : 'Coffee' },
                    { id: 'tea' as const, label: locale === 'sk' ? 'Čaj' : 'Tea' },
                    { id: 'energy' as const, label: 'Energy' },
                    { id: 'juice' as const, label: locale === 'sk' ? 'Džús' : 'Juice' },
                    { id: 'water' as const, label: locale === 'sk' ? 'Voda' : 'Water' },
                  ]).map(d => (
                    <button
                      key={d.id}
                      onClick={() => setFavDrink(d.id)}
                      style={{
                        padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: favDrink === d.id ? 'rgba(74,222,128,0.1)' : '#111',
                        border: `1px solid ${favDrink === d.id ? 'rgba(74,222,128,0.4)' : '#1a1a1a'}`,
                        color: favDrink === d.id ? '#4ade80' : '#888',
                        cursor: 'pointer',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'sk' ? 'Notifikácie' : 'Notifications'}
          </h3>
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                {locale === 'sk' ? 'Push notifikácie' : 'Push notifications'}
              </span>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && 'Notification' in window) {
                    if (Notification.permission === 'granted') {
                      // Already granted - toggle local preference
                      const current = localStorage.getItem('coduy-notifications') !== 'off';
                      localStorage.setItem('coduy-notifications', current ? 'off' : 'on');
                      window.location.reload();
                    } else {
                      Notification.requestPermission();
                    }
                  }
                }}
                style={{
                  width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', position: 'relative',
                  background: (typeof window !== 'undefined' && localStorage.getItem('coduy-notifications') !== 'off') ? '#4ade80' : '#333',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3,
                  left: (typeof window !== 'undefined' && localStorage.getItem('coduy-notifications') !== 'off') ? 21 : 3,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {locale === 'sk' ? 'Právne' : 'Legal'}
          </h3>
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
            <a href="/privacy" style={{ display: 'block', padding: '14px 16px', color: '#ccc', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid #111' }}>
              {locale === 'sk' ? 'Zásady ochrany súkromia' : 'Privacy Policy'}
            </a>
            <a href="/terms" style={{ display: 'block', padding: '14px 16px', color: '#ccc', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
              {locale === 'sk' ? 'Podmienky používania' : 'Terms of Use'}
            </a>
          </div>
        </div>

        {/* Delete data */}
        <button
          onClick={handleDeleteData}
          style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'none', border: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', color: '#555', fontSize: 11, fontWeight: 500,
            opacity: 0.6,
          }}
        >
          <Trash2 size={12} />
          {locale === 'sk' ? 'Vymazať všetky dáta' : 'Delete all data'}
        </button>
      </div>
    </div>
  );
}
