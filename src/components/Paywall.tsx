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
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
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

      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '80px 24px 24px',
        background: 'radial-gradient(ellipse at center top, rgba(74,222,128,0.08) 0%, transparent 60%)',
      }}>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Byte mood="celebrating" size={90} equipment={equipment} />
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Coduy</h1>
          <span style={{
            fontSize: 13, fontWeight: 800, color: '#000',
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            padding: '4px 12px', borderRadius: 8, letterSpacing: '0.06em',
          }}>PRO</span>
        </div>

        <p style={{ fontSize: 14, color: '#888', marginTop: 8, lineHeight: 1.5 }}>
          {sk ? 'Odomkni plný prístup ku všetkému' : 'Unlock full access to everything'}
        </p>
      </div>

      {/* Features */}
      <div style={{ padding: '0 24px 20px' }}>
        {(sk
          ? ['Neobmedzené lekcie a moduly', 'Interaktívne projekty a cvičenia', 'Aréna - kvízové bitky', 'Denné notifikácie s novým výrazom', 'Bez reklám']
          : ['Unlimited lessons and modules', 'Interactive projects and exercises', 'Arena - quiz battles', 'Daily notifications with new terms', 'Ad-free experience']
        ).map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={11} color="#4ade80" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 14, color: '#ccc', fontWeight: 500 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Yearly */}
        <button onClick={() => setPlan('yearly')} style={{
          width: '100%', padding: '16px 18px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: plan === 'yearly' ? 'rgba(74,222,128,0.06)' : '#0a0a0a',
          outline: plan === 'yearly' ? '2px solid #4ade80' : '1px solid #1a1a1a',
          textAlign: 'left', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -9, left: 18,
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)', color: '#000',
            fontSize: 10, fontWeight: 800, padding: '2px 10px', borderRadius: 6,
            letterSpacing: '0.04em',
          }}>
            {sk ? 'NAJLEPŠIA PONUKA' : 'BEST VALUE'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{sk ? 'Ročné' : 'Yearly'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {sk ? '1 EUR prvý rok, potom 40.69 EUR/rok' : '1 EUR first year, then 40.69 EUR/year'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>1<span style={{ fontSize: 13, color: '#888' }}> EUR</span></div>
              <div style={{ fontSize: 10, color: '#4ade80', fontWeight: 600 }}>-15%</div>
            </div>
          </div>
        </button>

        {/* Monthly */}
        <button onClick={() => setPlan('monthly')} style={{
          width: '100%', padding: '16px 18px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: plan === 'monthly' ? 'rgba(74,222,128,0.06)' : '#0a0a0a',
          outline: plan === 'monthly' ? '2px solid #4ade80' : '1px solid #1a1a1a',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{sk ? 'Mesačné' : 'Monthly'}</div>
              <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                {sk ? '1 EUR prvý mesiac, potom 3.99 EUR/mes' : '1 EUR first month, then 3.99 EUR/mo'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>1<span style={{ fontSize: 13, color: '#888' }}> EUR</span></div>
            </div>
          </div>
        </button>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 12px' }}>
        <motion.button
          onClick={() => router.push(`/pricing?plan=${plan === 'yearly' ? 'yearly' : 'trial'}`)}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '18px', borderRadius: 16,
            background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            color: '#000', fontWeight: 800, fontSize: 16, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(74,222,128,0.3)',
          }}
        >
          <Sparkles size={18} />
          {sk ? 'Vyskúšaj za 1 EUR' : 'Try for 1 EUR'}
        </motion.button>

        <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 8 }}>
          {sk ? 'Zrušíš kedykoľvek. Bez záväzkov.' : 'Cancel anytime. No commitment.'}
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
