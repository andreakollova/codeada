'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import StatusBar from '@/components/StatusBar';
import AuthModal from '@/components/AuthModal';
import { LogIn, LogOut, Globe, User, Trash2, ChevronRight, Sun, Moon, Smartphone, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { locale, toggle } = useLocaleStore();
  const { name, setName, coffees, favDrink, setFavDrink } = useUserStore();
  const [authUser, setAuthUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [editName, setEditName] = useState(false);
  const [nameVal, setNameVal] = useState(name || '');
  const [notifOn, setNotifOn] = useState(true);
  const [isApp, setIsApp] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    setNotifOn(localStorage.getItem('coduy-notifications') !== 'off');
    setIsApp(!!(window as any).Capacitor?.isNativePlatform?.());
    // Load saved theme
    const saved = localStorage.getItem('coduy-theme') as 'dark' | 'light' | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute('data-theme', saved); }
  }, []);

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
    localStorage.removeItem('coduy-last-auth-code');
    localStorage.removeItem('coduy-sb-auth');
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

        {/* Subscription - web only */}
        {authUser && !isApp && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              {locale === 'sk' ? 'Predplatne' : 'Subscription'}
            </h3>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
              <button
                onClick={async () => {
                  setBillingLoading(true);
                  try {
                    const sb = getSupabase();
                    const user = sb ? (await sb.auth.getUser()).data.user : null;
                    if (!user) return;
                    const res = await fetch('/api/billing-portal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user.id }),
                    });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      alert(locale === 'sk' ? 'Ziadne aktivne predplatne.' : 'No active subscription found.');
                    }
                  } catch {
                    alert(locale === 'sk' ? 'Nastala chyba.' : 'Something went wrong.');
                  } finally {
                    setBillingLoading(false);
                  }
                }}
                disabled={billingLoading}
                style={{
                  width: '100%', padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <CreditCard size={16} color="#888" />
                <span style={{ flex: 1, fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                  {billingLoading
                    ? (locale === 'sk' ? 'Nacitavam...' : 'Loading...')
                    : (locale === 'sk' ? 'Spravovat predplatne' : 'Manage subscription')}
                </span>
                <ChevronRight size={14} color="#555" />
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#555', marginTop: 6, paddingLeft: 4 }}>
              {locale === 'sk'
                ? 'Zobraz faktury, zmen kartu alebo zrus predplatne.'
                : 'View invoices, update card or cancel subscription.'}
            </p>
          </div>
        )}

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

            {/* Theme */}
            <div style={{ borderTop: '1px solid var(--border-light, #111)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {theme === 'dark' ? <Moon size={16} color="var(--text-hint, #888)" /> : <Sun size={16} color="var(--text-hint, #888)" />}
                <span style={{ fontSize: 14, color: 'var(--text, #ccc)', fontWeight: 500 }}>
                  {locale === 'sk' ? 'Režim' : 'Theme'}
                </span>
              </div>
              <div style={{ display: 'flex', background: 'var(--bg-surface, #111)', borderRadius: 8, padding: 2 }}>
                {(['dark', 'light'] as const).map(t => (
                  <button key={t} onClick={() => {
                    setTheme(t);
                    localStorage.setItem('coduy-theme', t);
                    document.documentElement.setAttribute('data-theme', t);
                  }} style={{
                    padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: theme === t ? 'var(--bg-raised, #1a1a1a)' : 'transparent',
                    color: theme === t ? 'var(--text, #fff)' : 'var(--text-dim, #555)',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {t === 'dark' ? (locale === 'sk' ? 'Tmavý' : 'Dark') : (locale === 'sk' ? 'Svetlý' : 'Light')}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ borderTop: '1px solid var(--border-light, #111)' }}>
              {editName ? (
                <div style={{ padding: '10px 16px', display: 'flex', gap: 8 }}>
                  <input
                    value={nameVal}
                    onChange={e => setNameVal(e.target.value)}
                    autoFocus
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: '#111', border: '1px solid #222', color: '#fff', fontSize: 16, fontFamily: 'inherit', outline: 'none' }}
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
                  <span style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {name || '-'}
                    <ChevronRight size={14} color="#555" />
                  </span>
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

        {/* Notifications - only in app */}
        {isApp && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              {locale === 'sk' ? 'Notifikácie' : 'Notifications'}
            </h3>
            <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>
                  {locale === 'sk' ? 'Push notifikácie' : 'Push notifications'}
                </span>
                <div
                  onClick={async () => {
                    const next = !notifOn;
                    if (next && (window as any).Capacitor) {
                      try {
                        const { PushNotifications } = await import('@capacitor/push-notifications');
                        const perm = await PushNotifications.checkPermissions();
                        if (perm.receive === 'prompt') {
                          const r = await PushNotifications.requestPermissions();
                          if (r.receive !== 'granted') return;
                        } else if (perm.receive === 'denied') {
                          window.open('app-settings:', '_system');
                          return;
                        }
                        // Add listener before register to catch token
                        await PushNotifications.addListener('registration', async (token) => {
                          console.log('Push token from settings:', token.value);
                          localStorage.setItem('coduy-push-token', token.value);
                          try {
                            const sb = getSupabase();
                            const user = sb ? (await sb.auth.getUser()).data.user : null;
                            if (user) {
                              await fetch('/api/push/register', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user.id, token: token.value, locale }),
                              });
                              console.log('Push token saved via settings toggle');
                            }
                          } catch {}
                        });
                        await PushNotifications.register();
                      } catch {}
                    }
                    setNotifOn(next);
                    localStorage.setItem('coduy-notifications', next ? 'on' : 'off');
                  }}
                  style={{
                    width: 48, height: 28, borderRadius: 14, cursor: 'pointer', position: 'relative',
                    background: notifOn ? '#4ade80' : '#333',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3,
                    left: notifOn ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 11, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            FAQ
          </h3>
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14, overflow: 'hidden' }}>
            {([
              {
                q: locale === 'sk' ? 'Ako pridať widget na plochu? (iOS)' : 'How to add a widget? (iOS)',
                a: locale === 'sk'
                  ? 'WIDGET_WIZARD'
                  : 'WIDGET_WIZARD',
              },
              {
                q: locale === 'sk' ? 'Ako zrušiť predplatné?' : 'How to cancel subscription?',
                a: locale === 'sk'
                  ? isApp
                    ? 'Nastavenia telefónu → tvoje meno → Predplatné → Coduy → Zrušiť. Predplatné zostáva aktívne do konca obdobia.'
                    : 'Klikni na "Spravovať predplatné" vyššie. Tam môžeš zrušiť predplatné, zmeniť kartu alebo si pozrieť faktúry.'
                  : isApp
                    ? 'Phone Settings → your name → Subscriptions → Coduy → Cancel. Your subscription stays active until the end of the period.'
                    : 'Click "Manage subscription" above. There you can cancel, update your card or view invoices.',
              },
              {
                q: locale === 'sk' ? 'Funguje to aj offline?' : 'Does it work offline?',
                a: locale === 'sk'
                  ? 'Na načítanie lekcií potrebuješ internet. Po načítaní môžeš čítať aj bez pripojenia.'
                  : 'You need internet to load lessons. Once loaded, you can read without connection.',
              },
            ] as { q: string; a: string }[]).map((faq, i) => (
              <details key={i} style={{ borderBottom: i < 2 ? '1px solid #111' : 'none' }}>
                <summary style={{ padding: '14px 16px', color: '#ccc', fontSize: 14, fontWeight: 500, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <ChevronRight size={14} color="#555" />
                </summary>
                <div style={{ padding: '0 16px 14px', color: '#888', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  {faq.a === 'WIDGET_WIZARD' ? (
                    <button
                      onClick={() => { import('@/components/WidgetTip').then(m => m.triggerWidgetWizard()); }}
                      style={{
                        background: '#22c55e', color: '#000', fontWeight: 700, fontSize: 13,
                        border: 'none', borderRadius: 10, padding: '10px 18px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      <Smartphone size={14} />
                      {locale === 'sk' ? 'Ukázať návod' : 'Show tutorial'}
                    </button>
                  ) : faq.a}
                </div>
              </details>
            ))}
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

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'none', border: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', gap: 8,
            cursor: 'pointer', color: '#888', fontSize: 11, fontWeight: 500,
          }}
        >
          <LogOut size={12} />
          {locale === 'sk' ? 'Odhlásiť sa' : 'Log out'}
        </button>

        {/* Delete data */}
        <button
          onClick={handleDeleteData}
          style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'none', border: 'none',
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
