'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import Byte from './Byte';
import { Crown, Check, Gift, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FREE_LESSON_LIMIT = 5;

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
  const sk = locale === 'sk';

  const features = sk
    ? ['Neobmedzené lekcie a moduly', 'Interaktívne projekty', 'Aréna - kvízové bitky', 'Cvičenia s písaním kódu', 'Bez reklám']
    : ['Unlimited lessons and modules', 'Interactive projects', 'Arena - quiz battles', 'Write-code exercises', 'Ad-free experience'];

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
        {onClose && (
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: 8,
            background: '#1a1a1a', border: '1px solid #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#888',
          }}>
            <X size={14} />
          </button>
        )}

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
            ? `Dokoncil si ${FREE_LESSON_LIMIT} bezplatnych lekcii. Pokracuj s neobmedzenym pristupom.`
            : `You completed ${FREE_LESSON_LIMIT} free lessons. Continue with unlimited access.`}
        </p>

        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <Check size={14} color="#4ade80" />
              <span style={{ fontSize: 13, color: '#ccc' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, width: '100%' }}>
          {[
            { id: 'trial', label: sk ? '1 EUR' : '1 EUR', sub: sk ? 'prvý mesiac' : 'first month' },
            { id: 'monthly', label: '3.99 EUR', sub: sk ? '/ mesiac' : '/ month' },
            { id: 'yearly', label: '40.69 EUR', sub: sk ? '/ rok (-15%)' : '/ year (-15%)' },
          ].map(p => (
            <button key={p.id} onClick={() => setSelectedPlan(p.id as any)} style={{
              flex: 1, padding: '10px 6px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: selectedPlan === p.id ? '#1a1a1a' : '#0a0a0a',
              outline: selectedPlan === p.id ? '2px solid #4ade80' : '1px solid #222',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: selectedPlan === p.id ? '#fff' : '#555' }}>{p.label}</div>
              <div style={{ fontSize: 9, color: selectedPlan === p.id ? '#888' : '#444', marginTop: 2 }}>{p.sub}</div>
            </button>
          ))}
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

        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', color: '#555',
            fontSize: 13, cursor: 'pointer', fontWeight: 500,
          }}
        >
          {sk ? 'Nie teraz' : 'Not now'}
        </button>
      </motion.div>
    </motion.div>
  );
}
