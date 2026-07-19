'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import Byte from './Byte';
import { Check, Crown, X, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FREE_LESSON_LIMIT = 1;

export function useSubscription() {
  const { userId, completedLessons } = useUserStore();
  const [status, setStatus] = useState<'loading' | 'free' | 'trial' | 'active' | 'admin' | 'expired'>('loading');
  const [trialEnds, setTrialEnds] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) { setStatus('free'); return; }
      const sb = getSupabase();
      if (!sb) { setStatus('free'); return; }
      try {
        const { data, error } = await sb.from('user_state')
          .select('subscription_status, subscription_expires_at, created_at')
          .eq('user_id', userId).single();

        if (data?.subscription_status === 'admin') { setStatus('admin'); return; }
        if (data?.subscription_status === 'active') {
          const expires = new Date(data.subscription_expires_at);
          if (expires > new Date()) { setStatus('active'); return; }
          setStatus('expired'); return;
        }

        const created = data?.created_at ? new Date(data.created_at) : null;
        if (created) {
          const trialEnd = new Date(created.getTime() + 30 * 86400000);
          setTrialEnds(trialEnd);
          if (trialEnd > new Date()) { setStatus('trial'); return; }
          setStatus('expired'); return;
        }

        setStatus('trial');
      } catch {
        setStatus('trial');
      }
    })();
  }, [userId]);

  const isPro = status === 'active' || status === 'admin';
  const needsUpgrade = !isPro && status !== 'loading' && completedLessons.length >= FREE_LESSON_LIMIT;

  return { status, isPro, needsUpgrade, trialEnds, completedLessons: completedLessons.length, limit: FREE_LESSON_LIMIT };
}

export default function Paywall({ onClose }: { onClose?: () => void }) {
  const { locale } = useLocaleStore();
  const { equipment } = useUserStore();
  const router = useRouter();
  const [plan, setPlan] = useState<'trial' | 'monthly' | 'yearly'>('trial');
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const sk = locale === 'sk';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* X close */}
      <button
        onClick={onClose || (() => router.back())}
        style={{
          position: 'absolute', top: 54, right: 16, zIndex: 10,
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888', border: 'none',
        }}
      >
        <X size={16} />
      </button>

      {/* Hero - compact */}
      <div style={{
        textAlign: 'center', padding: '60px 24px 16px',
        background: 'radial-gradient(ellipse at center top, rgba(74,222,128,0.06) 0%, transparent 60%)',
      }}>
        <Byte mood="celebrating" size={70} equipment={equipment} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Coduy</h1>
          <span style={{
            fontSize: 11, fontWeight: 800, color: '#000',
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            padding: '3px 10px', borderRadius: 7, letterSpacing: '0.06em',
          }}>PRO</span>
        </div>
        <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
          {sk ? 'Odomkni plný prístup ku všetkému' : 'Unlock full access to everything'}
        </p>
      </div>

      {/* Features - compact */}
      <div style={{ padding: '0 24px 14px', display: 'flex', flexWrap: 'wrap', gap: '6px 16px' }}>
        {(sk
          ? ['Neobmedzené lekcie', 'Interaktívne projekty', 'Aréna bitky', 'Písanie kódu', 'Denné notifikácie', 'Bez reklám']
          : ['Unlimited lessons', 'Interactive projects', 'Arena battles', 'Write code', 'Daily notifications', 'Ad-free']
        ).map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
            <Check size={12} color="#4ade80" strokeWidth={3} />
            <span style={{ fontSize: 12, color: '#aaa', fontWeight: 500 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ padding: '0 24px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {([
          { id: 'trial' as const, title: sk ? 'Vyskúšaj' : 'Try it', price: '1', period: sk ? '/prvý mes.' : '/first mo.', desc: sk ? 'Potom 3.99 EUR/mesiac' : 'Then 3.99 EUR/month', badge: null },
          { id: 'monthly' as const, title: sk ? 'Mesačné' : 'Monthly', price: '3.99', period: sk ? '/mesiac' : '/month', desc: sk ? 'Bez záväzkov' : 'No commitment', badge: null },
          { id: 'yearly' as const, title: sk ? 'Ročné' : 'Yearly', price: '1', period: sk ? ' EUR teraz' : ' EUR now', desc: sk ? '1 EUR teraz, zvyšok 39.69 EUR neskôr' : '1 EUR now, remaining 39.69 EUR later', badge: sk ? 'UŠETRI 15%' : 'SAVE 15%' },
        ]).map(p => (
          <button key={p.id} onClick={() => setPlan(p.id)} style={{
            width: '100%', padding: '14px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: plan === p.id ? 'rgba(74,222,128,0.05)' : '#0a0a0a',
            outline: plan === p.id ? '2px solid #4ade80' : '1px solid #1a1a1a',
            textAlign: 'left', position: 'relative',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            {p.badge && <div style={{
              position: 'absolute', top: -8, right: 14,
              background: 'linear-gradient(135deg, #4ade80, #22d3ee)', color: '#000',
              fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 5, letterSpacing: '0.04em',
            }}>{p.badge}</div>}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: plan === p.id ? '#fff' : '#aaa' }}>{p.title}</div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>{p.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: plan === p.id ? '#fff' : '#888' }}>{p.price}</span>
              <span style={{ fontSize: 11, color: '#666', marginLeft: 2 }}>EUR{p.period}</span>
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 10px' }}>
        <motion.button
          onClick={() => router.push(`/pricing?plan=${plan}`)}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            color: '#000', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Sparkles size={16} />
          {plan === 'trial' ? (sk ? 'Vyskúšaj za 1 EUR' : 'Try for 1 EUR')
            : plan === 'yearly' ? (sk ? 'Získať ročné Pro' : 'Get yearly Pro')
            : (sk ? 'Získať mesačné Pro' : 'Get monthly Pro')}
        </motion.button>
        <p style={{ fontSize: 10, color: '#444', textAlign: 'center', marginTop: 6 }}>
          {sk ? 'Zrušíš kedykoľvek' : 'Cancel anytime'}
        </p>
      </div>

      {/* Promo + Not now */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 24px 40px' }}>
        {!showPromo ? (
          <button
            onClick={() => setShowPromo(true)}
            style={{ background: 'none', border: 'none', color: '#555', fontSize: 11, cursor: 'pointer' }}
          >
            {sk ? 'Máš promo kód?' : 'Have a promo code?'}
          </button>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 6, width: '100%' }}>
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder={sk ? 'Zadaj kód' : 'Enter code'}
                style={{
                  flex: 1, padding: '10px 12px', borderRadius: 10,
                  background: '#0a0a0a', border: '1px solid #222',
                  color: '#fff', fontSize: 13, fontFamily: 'monospace',
                  outline: 'none', textTransform: 'uppercase',
                }}
              />
              <button
                onClick={async () => {
                  if (!promoCode.trim()) return;
                  const { userId } = useUserStore.getState();
                  const res = await fetch('/api/promo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: promoCode, userId }),
                  });
                  const data = await res.json();
                  if (data.success) window.location.replace('/');
                  else setPromoError(data.error || 'Invalid code');
                }}
                style={{
                  padding: '10px 16px', borderRadius: 10,
                  background: '#fff', color: '#000',
                  fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                }}
              >
                OK
              </button>
            </div>
            {promoError && <p style={{ fontSize: 11, color: '#ff8080', margin: 0 }}>{promoError}</p>}
          </>
        )}

        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', color: '#444', fontSize: 12, cursor: 'pointer' }}
        >
          {sk ? 'Nie teraz' : 'Not now'}
        </button>
      </div>
    </motion.div>
  );
}
