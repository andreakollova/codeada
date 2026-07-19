'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import Byte from './Byte';
import { Crown, Check, Gift, X } from 'lucide-react';
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

        // Check if within 30-day free trial from account creation
        const created = data?.created_at ? new Date(data.created_at) : null;
        if (created) {
          const trialEnd = new Date(created.getTime() + 30 * 86400000);
          setTrialEnds(trialEnd);
          if (trialEnd > new Date()) { setStatus('trial'); return; }
          setStatus('expired'); return;
        }

        // No created_at or no row = new user = trial
        setStatus('trial');
      } catch {
        // No user_state row or table = new user, give trial
        setStatus('trial');
      }
    })();
  }, [userId]);

  const isPro = status === 'active' || status === 'admin';
  // Free users can do 5 lessons, after that need to upgrade
  const needsUpgrade = !isPro && status !== 'loading' && completedLessons.length >= FREE_LESSON_LIMIT;

  return { status, isPro, needsUpgrade, trialEnds, completedLessons: completedLessons.length, limit: FREE_LESSON_LIMIT };
}

export default function Paywall({ onClose }: { onClose?: () => void }) {
  const { locale } = useLocaleStore();
  const { equipment } = useUserStore();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly' | 'yearly'>('trial');
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const sk = locale === 'sk';

  const features = sk
    ? ['Neobmedzené lekcie a moduly', 'Interaktívne projekty', 'Aréna - kvízové bitky', 'Cvičenia s písaním kódu', 'Denné notifikácie s novým výrazom', 'Bez reklám']
    : ['Unlimited lessons and modules', 'Interactive projects', 'Arena - quiz battles', 'Write-code exercises', 'Daily notifications with new terms', 'Ad-free experience'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          maxWidth: 400, width: '100%',
          background: '#111', border: '1px solid #222',
          borderRadius: 24, padding: '32px 24px',
          textAlign: 'center', position: 'relative',
        }}
      >
        <button onClick={onClose || (() => router.back())} style={{
          position: 'absolute', top: 12, right: 12,
          width: 32, height: 32, borderRadius: 8,
          background: '#1a1a1a', border: '1px solid #2a2a2a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888',
        }}>
          <X size={14} />
        </button>

        <Byte mood="proud" size={80} equipment={equipment} />

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 16, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {sk ? 'Odomkni Coduy' : 'Unlock Coduy'}
          <span style={{
            fontSize: 12, fontWeight: 800, color: '#000', background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
            padding: '3px 10px', borderRadius: 8, letterSpacing: '0.05em',
          }}>PRO</span>
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
          {sk
            ? `Dokončil si ${FREE_LESSON_LIMIT} bezplatnú lekciu. Pokračuj s neobmedzeným prístupom.`
            : `You completed ${FREE_LESSON_LIMIT} free lesson. Continue with unlimited access.`}
        </p>

        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <Check size={14} color="#4ade80" />
              <span style={{ fontSize: 13, color: '#ccc' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Monthly / Yearly toggle */}
        <div style={{ display: 'flex', background: '#0a0a0a', borderRadius: 14, padding: 3, marginBottom: 16, width: '100%' }}>
          {(['monthly', 'yearly'] as const).map(p => (
            <button key={p} onClick={() => setSelectedPlan(p === 'monthly' ? 'trial' : 'yearly')} style={{
              flex: 1, padding: '10px 8px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: (p === 'monthly' && selectedPlan === 'trial') || (p === 'yearly' && selectedPlan === 'yearly') ? '#1a1a1a' : 'transparent',
              textAlign: 'center', position: 'relative',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: (p === 'monthly' && selectedPlan === 'trial') || (p === 'yearly' && selectedPlan === 'yearly') ? '#fff' : '#555' }}>
                {p === 'monthly' ? (sk ? 'Mesačne' : 'Monthly') : (sk ? 'Ročne' : 'Yearly')}
              </div>
            </button>
          ))}
        </div>

        {/* Selected plan details */}
        <div style={{
          padding: '16px', borderRadius: 14, marginBottom: 16, width: '100%',
          background: '#0a0a0a', border: '1.5px solid rgba(74,222,128,0.3)',
          textAlign: 'left', position: 'relative',
        }}>
          {selectedPlan === 'yearly' && (
            <div style={{
              position: 'absolute', top: -10, right: 14,
              background: 'linear-gradient(135deg, #4ade80, #22d3ee)', color: '#000',
              fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 6,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {sk ? 'Odporúčané' : 'Recommended'}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
                {selectedPlan === 'trial' ? '1' : '40.69'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#888', marginLeft: 4 }}>EUR</span>
            </div>
            {selectedPlan === 'trial' && (
              <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                {sk ? 'Prvý mesiac' : 'First month'}
              </span>
            )}
            {selectedPlan === 'yearly' && (
              <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>
                {sk ? 'Ušetríš 15%' : 'Save 15%'}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            {selectedPlan === 'trial'
              ? (sk ? 'Potom 3.99 EUR / mesiac. Zrušíš kedykoľvek.' : 'Then 3.99 EUR / month. Cancel anytime.')
              : (sk ? '3.39 EUR / mesiac. Zrušíš kedykoľvek.' : '3.39 EUR / month. Cancel anytime.')}
          </div>
          {selectedPlan === 'trial' && (
            <div style={{ fontSize: 11, color: '#4ade80', marginTop: 6, fontWeight: 600 }}>
              {sk ? 'Zahŕňa 7-dňový free trial' : 'Includes 7-day free trial'}
            </div>
          )}
        </div>

        <button
          onClick={() => router.push('/pricing')}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: '#EDEDED', color: '#000',
            fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 12,
          }}
        >
          <Crown size={16} />
          {sk ? 'Získať Coduy Pro' : 'Get Coduy Pro'}
        </button>

        {/* Promo code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 4 }}>
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
                    flex: 1, padding: '8px 12px', borderRadius: 8,
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
                    padding: '8px 14px', borderRadius: 8,
                    background: '#fff', color: '#000',
                    fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
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
            style={{
              background: 'none', border: 'none', color: '#555',
              fontSize: 12, cursor: 'pointer', fontWeight: 500,
            }}
          >
            {sk ? 'Nie teraz' : 'Not now'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
