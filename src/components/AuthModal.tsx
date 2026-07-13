'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import { X, Mail, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const { locale } = useLocaleStore();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await handleSendOtp();
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
      setError(locale === 'sk' ? 'Nesprávny kód. Skús znova.' : 'Invalid code. Try again.');
    } else {
      onClose();
      window.location.reload();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: '#161616', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24, padding: '32px 28px', maxWidth: 380, width: '100%',
            boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          <h2 style={{ fontWeight: 700, fontSize: 20, color: '#fff', textAlign: 'center', marginBottom: 6 }}>
            {locale === 'sk' ? 'Prihlásenie' : 'Log in'}
          </h2>
          <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 24 }}>
            {locale === 'sk' ? 'Ulož si progress na všetkých zariadeniach.' : 'Save your progress across all devices.'}
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: '100%', padding: '12px', borderRadius: 12,
              background: '#fff', color: '#000', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10, marginBottom: 16,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {locale === 'sk' ? 'Pokračovať s Google' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '4px 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: '#222' }} />
            <span style={{ fontSize: 11, color: '#555' }}>{locale === 'sk' ? 'alebo' : 'or'}</span>
            <div style={{ flex: 1, height: 1, background: '#222' }} />
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  autoFocus
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    background: '#0a0a0a', border: '1px solid #222', color: '#fff',
                    fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 12,
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim()}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: email.trim() ? '#fff' : '#222',
                    color: email.trim() ? '#000' : '#555',
                    fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <Mail size={16} />
                  {loading
                    ? (locale === 'sk' ? 'Posielam...' : 'Sending...')
                    : (locale === 'sk' ? 'Poslať prihlasovací kód' : 'Send login code')}
                </button>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p style={{ fontSize: 13, color: '#aaa', marginBottom: 12, textAlign: 'center' }}>
                  {locale === 'sk'
                    ? `Poslali sme kód na ${email}`
                    : `We sent a code to ${email}`}
                </p>
                <input
                  type="text"
                  placeholder={locale === 'sk' ? '8-miestny kód' : '8-digit code'}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  autoFocus
                  style={{
                    width: '100%', padding: '14px', borderRadius: 10,
                    background: '#0a0a0a', border: '1px solid #222', color: '#fff',
                    fontSize: 24, fontFamily: 'monospace', outline: 'none', marginBottom: 12,
                    textAlign: 'center', letterSpacing: '0.3em', boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 8}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: otp.length >= 8 ? '#fff' : '#222',
                    color: otp.length >= 8 ? '#000' : '#555',
                    fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <ArrowRight size={16} />
                  {loading
                    ? (locale === 'sk' ? 'Overujem...' : 'Verifying...')
                    : (locale === 'sk' ? 'Overiť kód' : 'Verify code')}
                </button>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#333' : '#888', fontSize: 12, cursor: resendTimer > 0 ? 'default' : 'pointer' }}
                  >
                    {resendTimer > 0
                      ? (locale === 'sk' ? `Poslať znova (${resendTimer}s)` : `Resend (${resendTimer}s)`)
                      : (locale === 'sk' ? 'Neprišiel kód? Poslať znova' : "Didn't get the code? Resend")}
                  </button>
                  <button
                    onClick={() => { setStep('email'); setOtp(''); setError(null); setResendTimer(0); if (timerRef.current) clearInterval(timerRef.current); }}
                    style={{ background: 'none', border: 'none', color: '#555', fontSize: 11, cursor: 'pointer' }}
                  >
                    {locale === 'sk' ? 'Zmeniť email' : 'Change email'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 8, textAlign: 'center' }}>{error}</p>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
