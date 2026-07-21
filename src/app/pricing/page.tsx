'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import StatusBar from '@/components/StatusBar';
import Byte from '@/components/Byte';
import { Check, Sparkles, Zap, Crown, Gift, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function PricingPage() {
  const { locale } = useLocaleStore();
  const { name, equipment, userId } = useUserStore();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ success?: boolean; error?: string } | null>(null);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Check subscription status
  useEffect(() => {
    (async () => {
      if (!userId) return;
      const sb = getSupabase();
      if (!sb) return;
      const { data } = await sb.from('user_state').select('subscription_status, subscription_plan, subscription_expires_at').eq('user_id', userId).single();
      if (data?.subscription_status === 'active' || data?.subscription_status === 'admin') {
        setSubStatus(data.subscription_status);
      }
    })();
  }, [userId]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const sb = getSupabase();
      const session = await sb?.auth.getSession();
      const email = session?.data?.session?.user?.email;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId, email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || 'Error');
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePromo = async () => {
    if (!promoCode.trim() || !userId) return;
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoResult({ success: true });
        setSubStatus('active');
      } else {
        setPromoResult({ error: data.error || 'Invalid code' });
      }
    } catch {
      setPromoResult({ error: 'Network error' });
    } finally {
      setPromoLoading(false);
    }
  };

  const sk = locale === 'sk';

  // Already subscribed
  if (subStatus === 'active' || subStatus === 'admin') {
    return (
      <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 120 }}>
        <StatusBar />
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <Byte mood="celebrating" size={120} equipment={equipment} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', marginTop: 20, marginBottom: 8 }}>
            {sk ? 'Si Coduy Pro!' : "You're Coduy Pro!"}
          </h1>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>
            {sk ? 'Mas pristup ku vsetkemu. Uzivaj si ucenie!' : 'You have access to everything. Enjoy learning!'}
          </p>
          <button onClick={() => router.push('/')} style={{
            padding: '14px 32px', borderRadius: 12, background: '#EDEDED', color: '#000',
            fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
          }}>
            {sk ? 'Spat na dashboard' : 'Back to dashboard'}
          </button>
        </div>
      </div>
    );
  }

  // Success / canceled states
  if (success) {
    return (
      <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 120 }}>
        <StatusBar />
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
          <Byte mood="celebrating" size={120} equipment={equipment} />
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#4ade80', marginTop: 20, marginBottom: 8 }}>
            {sk ? 'Dakujeme!' : 'Thank you!'}
          </h1>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 32 }}>
            {sk ? 'Tvoja subscripcia je aktivna. Vitaj v Coduy Pro!' : 'Your subscription is active. Welcome to Coduy Pro!'}
          </p>
          <button onClick={() => router.push('/')} style={{
            padding: '14px 32px', borderRadius: 12, background: '#EDEDED', color: '#000',
            fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
          }}>
            {sk ? 'Zacat sa ucit' : 'Start learning'}
          </button>
        </div>
      </div>
    );
  }

  const features = sk
    ? ['Vsetky lekcie a moduly', 'Interaktivne projekty', 'Arena - kviz bitky', 'Write-code cvicenia', 'Bez reklam']
    : ['All lessons and modules', 'Interactive projects', 'Arena - quiz battles', 'Write-code exercises', 'Ad-free experience'];

  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 120 }}>
      <StatusBar />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px' }}>
        {/* Back */}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> {sk ? 'Spat' : 'Back'}
        </button>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Byte mood="proud" size={100} equipment={equipment} />
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginTop: 16, marginBottom: 6, letterSpacing: '-0.03em' }}>
            Coduy Pro
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
            {sk ? 'Odomkni vsetko. Uci sa bez limitov.' : 'Unlock everything. Learn without limits.'}
          </p>
        </div>

        {/* Plan toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['monthly', 'yearly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlan(p)}
              style={{
                flex: 1, padding: '14px 12px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: plan === p ? '#161616' : '#0a0a0a',
                outline: plan === p ? '2px solid #4ade80' : '1px solid #1a1a1a',
                textAlign: 'center', position: 'relative',
              }}
            >
              {p === 'yearly' && (
                <div style={{
                  position: 'absolute', top: -10, right: 12,
                  background: '#4ade80', color: '#000', fontSize: 9, fontWeight: 800,
                  padding: '3px 8px', borderRadius: 6, letterSpacing: '0.05em',
                }}>
                  -15%
                </div>
              )}
              <div style={{ fontSize: 22, fontWeight: 800, color: plan === p ? '#fff' : '#555' }}>
                {p === 'monthly' ? '5.99' : '59.99'} <span style={{ fontSize: 13, fontWeight: 600 }}>EUR</span>
              </div>
              <div style={{ fontSize: 11, color: plan === p ? '#888' : '#444', fontWeight: 600, marginTop: 4 }}>
                {p === 'monthly'
                  ? (sk ? '/ mesiac' : '/ month')
                  : (sk ? '/ rok' : '/ year')}
              </div>
              {p === 'yearly' && (
                <div style={{ fontSize: 10, color: '#4ade80', fontWeight: 600, marginTop: 4 }}>
                  {sk ? '3.39 EUR / mesiac' : '3.39 EUR / month'}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Features */}
        <div style={{ marginBottom: 24, padding: '20px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid #111' : 'none' }}>
              <Check size={16} color="#4ade80" />
              <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        <motion.button
          onClick={handleCheckout}
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: loading ? '#222' : '#EDEDED',
            color: loading ? '#555' : '#000',
            fontWeight: 700, fontSize: 16, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 20,
          }}
        >
          <Crown size={18} />
          {loading
            ? (sk ? 'Nacitavam...' : 'Loading...')
            : (sk ? 'Ziskat Coduy Pro' : 'Get Coduy Pro')}
        </motion.button>

        {/* Promo code */}
        <div style={{ padding: '16px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Gift size={14} color="#888" />
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>
              {sk ? 'Mas promo kod?' : 'Have a promo code?'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={promoCode}
              onChange={e => setPromoCode(e.target.value)}
              placeholder={sk ? 'Zadaj kod...' : 'Enter code...'}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                background: '#111', border: '1px solid #222',
                color: '#fff', fontSize: 14, fontFamily: 'monospace',
                outline: 'none', textTransform: 'uppercase',
              }}
            />
            <button
              onClick={handlePromo}
              disabled={promoLoading || !promoCode.trim()}
              style={{
                padding: '10px 16px', borderRadius: 10,
                background: promoCode.trim() ? '#fff' : '#222',
                color: promoCode.trim() ? '#000' : '#555',
                fontWeight: 700, fontSize: 13, border: 'none',
                cursor: promoCode.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {promoLoading ? '...' : (sk ? 'Pouzit' : 'Apply')}
            </button>
          </div>
          {promoResult && (
            <div style={{
              marginTop: 8, fontSize: 12, fontWeight: 600,
              color: promoResult.success ? '#4ade80' : '#ff8080',
            }}>
              {promoResult.success
                ? (sk ? 'Kod aktivovany! Uzivaj si Coduy Pro.' : 'Code activated! Enjoy Coduy Pro.')
                : promoResult.error}
            </div>
          )}
        </div>

        {canceled && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 16 }}>
            {sk ? 'Platba bola zrusena.' : 'Payment was canceled.'}
          </p>
        )}
      </div>
    </div>
  );
}
