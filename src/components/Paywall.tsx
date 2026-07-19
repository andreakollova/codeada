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

  const [showProReward, setShowProReward] = useState(false);

  // Auto-grant Pro Glow aura when user becomes Pro
  useEffect(() => {
    if (isPro) {
      const { ownedItems, addItem, equip } = useUserStore.getState();
      if (!ownedItems.includes('aura-pro')) {
        addItem('aura-pro');
        equip('aura', 'aura-pro');
        setShowProReward(true);
      }
    }
  }, [isPro]);

  return { status, isPro, needsUpgrade, trialEnds, showProReward, dismissProReward: () => setShowProReward(false), completedLessons: completedLessons.length, limit: FREE_LESSON_LIMIT };
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

  const accentGradient = 'linear-gradient(135deg, #4ade80, #22c55e)';
  const accentColor = '#4ade80';

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
        textAlign: 'center', padding: '80px 24px 12px',
        background: 'radial-gradient(ellipse at center top, rgba(74,222,128,0.06) 0%, transparent 60%)',
      }}>
        <Byte mood="celebrating" size={60} equipment={equipment} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>Coduy</h1>
          <span style={{
            fontSize: 11, fontWeight: 800, color: '#000',
            background: accentGradient,
            padding: '3px 10px', borderRadius: 7, letterSpacing: '0.06em',
          }}>PRO</span>
        </div>
        <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
          {sk ? 'Odomkni plný prístup ku všetkému' : 'Unlock full access to everything'}
        </p>
      </div>

      {/* Features - vertical list */}
      <div style={{ padding: '0 28px 16px' }}>
        {(sk
          ? ['Neobmedzené lekcie a moduly', 'Interaktívne projekty a cvičenia', 'Aréna - kvízové súboje s hráčmi', 'Denné notifikácie s novým výrazom', 'Widgety na ploche']
          : ['Unlimited lessons and modules', 'Interactive projects and exercises', 'Arena - quiz battles with players', 'Daily notifications with new terms', 'Home screen widgets']
        ).map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <Check size={14} color={accentColor} strokeWidth={3} />
            <span style={{ fontSize: 13, color: '#eee', fontWeight: 500 }}>{f}</span>
          </div>
        ))}
      </div>

      {/* Monthly / Yearly toggle - small */}
      <div style={{ padding: '0 60px 14px' }}>
        <div style={{ display: 'flex', background: '#0a0a0a', borderRadius: 10, padding: 2 }}>
          {(['monthly', 'yearly'] as const).map(tab => {
            const active = (tab === 'monthly' && (plan === 'trial' || plan === 'monthly')) || (tab === 'yearly' && plan === 'yearly');
            return (
              <button key={tab} onClick={() => setPlan(tab === 'monthly' ? 'trial' : 'yearly')} style={{
                flex: 1, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: active ? '#1a1a1a' : 'transparent',
                fontSize: 12, fontWeight: 700, color: active ? '#fff' : '#555',
              }}>
                {tab === 'monthly' ? (sk ? 'Mesačne' : 'Monthly') : (sk ? 'Ročne' : 'Yearly')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two plan cards side by side */}
      <div style={{ padding: '0 24px 18px', display: 'flex', gap: 10 }}>
        {/* Free Trial */}
        <button onClick={() => setPlan(plan === 'yearly' ? 'yearly' : 'trial')} style={{
          flex: 1, padding: '16px 10px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: (plan === 'trial' || plan === 'yearly') ? 'rgba(74,222,128,0.05)' : '#0a0a0a',
          outline: (plan === 'trial' || plan === 'yearly') ? '2px solid #4ade80' : '1px solid #1a1a1a',
          textAlign: 'center', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
            background: accentGradient, color: '#000',
            fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: 6,
            letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}>FREE TRIAL</div>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 14, color: '#555', textDecoration: 'line-through', marginRight: 6 }}>
              {plan === 'yearly' ? '40.99' : '3.99'} EUR
            </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: accentColor }}>0 EUR</span>
          </div>
          <div style={{ fontSize: 11, color: '#fff', marginTop: 4 }}>
            {sk ? '7 dní zadarmo' : '7 days free'}
          </div>

          <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>
            {plan === 'yearly'
              ? (sk ? 'potom 40.99 EUR/rok' : 'then 40.99 EUR/yr')
              : (sk ? 'potom 3.99 EUR/mes' : 'then 3.99 EUR/mo')}
          </div>
        </button>

        {/* Full price */}
        <button onClick={() => setPlan('monthly')} style={{
          flex: 1, padding: '16px 10px', borderRadius: 16, border: 'none', cursor: 'pointer',
          background: plan === 'monthly' ? 'rgba(74,222,128,0.05)' : '#0a0a0a',
          outline: plan === 'monthly' ? '2px solid #4ade80' : '1px solid #1a1a1a',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: plan === 'monthly' ? '#fff' : '#555', marginTop: 14 }}>
            {plan === 'yearly' ? '40.99' : '3.99'} <span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>EUR</span>
          </div>
          <div style={{ fontSize: 11, color: plan === 'monthly' ? '#fff' : '#888', marginTop: 4 }}>
            {plan === 'yearly' ? (sk ? '/ rok' : '/ year') : (sk ? '/ mesiac' : '/ month')}
          </div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>
            {sk ? 'bez záväzkov' : 'no commitment'}
          </div>
        </button>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px 10px' }}>
        <motion.button
          onClick={async () => {
            const isApp = typeof window !== 'undefined' && !!(window as any).Capacitor;
            const { userId } = useUserStore.getState();

            if (isApp && (window as any).Capacitor?.Plugins?.CoduyStore) {
              // In-app purchase via Apple StoreKit
              try {
                const productId = plan === 'yearly' ? 'coduy_pro_yearly' : 'coduy_pro_monthly';
                const result = await (window as any).Capacitor.Plugins.CoduyStore.purchase({ productId });
                if (result?.success) {
                  await fetch('/api/iap/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, receipt: result.receipt, productId }),
                  });
                  window.location.replace('/');
                }
              } catch (e) {
                console.log('IAP error:', e);
              }
            } else {
              // Web - Stripe checkout
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
              } catch {}
            }
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: accentGradient,
            color: '#000', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Sparkles size={16} />
          {plan === 'trial' || plan === 'yearly'
            ? (sk ? 'Začať free trial' : 'Start free trial')
            : (sk ? 'Získať Pro' : 'Get Pro')}
        </motion.button>
        <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
          {sk ? 'Zrušíš kedykoľvek. Bez záväzkov.' : 'Cancel anytime. No strings attached.'}
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
