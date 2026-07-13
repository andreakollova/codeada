'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { Mail, ArrowRight } from 'lucide-react';
import Byte from './Byte';
import type { ByteEquipment } from '@/types';

const LOGIN_SKINS: ByteEquipment[] = [
  {},
  { hat: 'hat-graduation', glasses: 'glasses-cool', accessory: 'acc-crystal', aura: 'aura-green' },
  { hat: 'hat-galaxy', glasses: 'glasses-laser', antenna: 'ant-lightning', aura: 'aura-galaxy' },
  { hat: 'hat-samurai', glasses: 'glasses-frost', accessory: 'acc-chain', aura: 'aura-blue' },
  { hat: 'hat-golden-crown', glasses: 'glasses-golden', accessory: 'acc-wings-gold', aura: 'aura-golden' },
];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleStore();
  const { setUserId } = useUserStore();
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'start' | 'email' | 'otp'>('start');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [skinIndex, setSkinIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkinIndex(prev => (prev + 1) % LOGIN_SKINS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setAuthed(true); setChecking(false); return; }

    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setAuthed(true);
      }
      setChecking(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setAuthed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogle = async () => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  };

  const handleSendOtp = async () => {
    const sb = getSupabase();
    if (!sb || !email.trim()) return;
    setLoading(true);
    setError(null);

    const { error: err } = await sb.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    if (err) {
      setError(err.message);
    } else {
      setStep('otp');
      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const sb = getSupabase();
    if (!sb || !otp.trim()) return;
    setLoading(true);
    setError(null);

    const { error: err } = await sb.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    });

    if (err) {
      setError(locale === 'sk' ? 'Nespravny kod. Skus znova.' : 'Invalid code. Try again.');
    }
    setLoading(false);
  };

  // Loading state
  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Byte mood="happy" size={80} />
      </div>
    );
  }

  // Authed - show app
  if (authed) return <>{children}</>;

  // Login screen
  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 380, width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', height: 110 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={skinIndex}
              initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.92 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(12px)', scale: 1.05 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Byte mood="happy" size={100} equipment={LOGIN_SKINS[skinIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20, marginBottom: 4 }}>
            <img src="/logocoduy.png" alt="Coduy" style={{ height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.1em',
              background: 'rgba(74,222,128,0.1)', padding: '3px 8px', borderRadius: 6 }}>Beta</span>
          </div>
          <p style={{ fontSize: 15, color: '#fff', fontWeight: 700, marginBottom: 4, marginTop: 12 }}>
            {locale === 'sk'
              ? 'Registruj sa teraz zadarmo.'
              : 'Register now for free.'}
          </p>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
            {locale === 'sk'
              ? 'Prihlásenie je potrebné na ukladanie tvojho progressu.'
              : 'Sign in to save your progress across all devices.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'start' && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Google */}
              <button
                onClick={handleGoogle}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: '#fff', color: '#000', fontWeight: 700, fontSize: 14,
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 10,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {locale === 'sk' ? 'Pokracovat s Google' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0' }}>
                <div style={{ flex: 1, height: 1, background: '#222' }} />
                <span style={{ fontSize: 11, color: '#555' }}>{locale === 'sk' ? 'alebo' : 'or'}</span>
                <div style={{ flex: 1, height: 1, background: '#222' }} />
              </div>

              {/* Email button */}
              <button
                onClick={() => setStep('email')}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: '#161616', color: '#ccc', fontWeight: 600, fontSize: 14,
                  border: '1px solid #222', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                }}
              >
                <Mail size={16} />
                {locale === 'sk' ? 'Pokracovat s emailom' : 'Continue with email'}
              </button>
            </motion.div>
          )}

          {step === 'email' && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                autoFocus
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: '#111', border: '1px solid #222', color: '#fff',
                  fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 12,
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSendOtp}
                disabled={loading || !email.trim()}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: email.trim() ? '#fff' : '#222',
                  color: email.trim() ? '#000' : '#555',
                  fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {loading
                  ? (locale === 'sk' ? 'Posielam...' : 'Sending...')
                  : (locale === 'sk' ? 'Poslat prihlasovaci kod' : 'Send login code')}
              </button>
              <button
                onClick={() => setStep('start')}
                style={{ marginTop: 12, background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer' }}
              >
                {locale === 'sk' ? 'Spat' : 'Back'}
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>
                {locale === 'sk' ? `Poslali sme kod na ${email}` : `We sent a code to ${email}`}
              </p>
              <input
                type="text"
                placeholder={locale === 'sk' ? '6-miestny kod' : '6-digit code'}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                autoFocus
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: '#111', border: '1px solid #222', color: '#fff',
                  fontSize: 24, fontFamily: 'monospace', outline: 'none', marginBottom: 12,
                  textAlign: 'center', letterSpacing: '0.3em', boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 6}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12,
                  background: otp.length >= 6 ? '#fff' : '#222',
                  color: otp.length >= 6 ? '#000' : '#555',
                  fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <ArrowRight size={16} />
                {loading
                  ? (locale === 'sk' ? 'Overujem...' : 'Verifying...')
                  : (locale === 'sk' ? 'Overit kod' : 'Verify code')}
              </button>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => { if (resendTimer <= 0) handleSendOtp(); }}
                  disabled={resendTimer > 0}
                  style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#333' : '#888', fontSize: 12, cursor: resendTimer > 0 ? 'default' : 'pointer' }}
                >
                  {resendTimer > 0
                    ? (locale === 'sk' ? `Poslat znova (${resendTimer}s)` : `Resend (${resendTimer}s)`)
                    : (locale === 'sk' ? 'Neprisiel kod? Poslat znova' : "Didn't get the code? Resend")}
                </button>
                <button
                  onClick={() => { setStep('email'); setOtp(''); setError(null); }}
                  style={{ background: 'none', border: 'none', color: '#555', fontSize: 11, cursor: 'pointer' }}
                >
                  {locale === 'sk' ? 'Zmenit email' : 'Change email'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}
