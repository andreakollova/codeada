'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { getSupabase } from '@/lib/supabase';
import Byte from './Byte';
import { Crown, Check, Gift, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function useSubscription() {
  const { userId } = useUserStore();
  const [status, setStatus] = useState<'loading' | 'free' | 'trial' | 'active' | 'admin' | 'expired'>('loading');
  const [trialEnds, setTrialEnds] = useState<Date | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) { setStatus('free'); return; }
      const sb = getSupabase();
      if (!sb) { setStatus('free'); return; }
      try {
        const { data } = await sb.from('user_state')
          .select('subscription_status, subscription_expires_at, created_at')
          .eq('user_id', userId).single();

        if (data?.subscription_status === 'admin') { setStatus('admin'); return; }
        if (data?.subscription_status === 'active') {
          const expires = new Date(data.subscription_expires_at);
          if (expires > new Date()) { setStatus('active'); return; }
          // Expired subscription
          setStatus('expired'); return;
        }

        // Check if within 30-day free trial from account creation
        const created = data?.created_at ? new Date(data.created_at) : null;
        if (created) {
          const trialEnd = new Date(created.getTime() + 30 * 86400000);
          setTrialEnds(trialEnd);
          if (trialEnd > new Date()) { setStatus('trial'); return; }
        }

        setStatus('expired');
      } catch {
        // No user_state row = new user, give trial
        setStatus('trial');
      }
    })();
  }, [userId]);

  const isPro = status === 'active' || status === 'admin' || status === 'trial';
  const needsUpgrade = status === 'expired';

  return { status, isPro, needsUpgrade, trialEnds };
}

export default function Paywall({ onClose }: { onClose?: () => void }) {
  const { locale } = useLocaleStore();
  const { equipment } = useUserStore();
  const router = useRouter();
  const sk = locale === 'sk';

  const features = sk
    ? ['Neobmedzene lekcie a moduly', 'Interaktivne projekty', 'Arena kviz bitky', 'Write-code cvicenia', 'Bez reklam']
    : ['Unlimited lessons and modules', 'Interactive projects', 'Arena quiz battles', 'Write-code exercises', 'Ad-free experience'];

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

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 16, marginBottom: 6 }}>
          {sk ? 'Odomkni Coduy Pro' : 'Unlock Coduy Pro'}
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.5 }}>
          {sk
            ? 'Tvoja skusobna doba skoncila. Pokracuj s neobmedzenym pristupom.'
            : 'Your free trial has ended. Continue with unlimited access.'}
        </p>

        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
              <Check size={14} color="#4ade80" />
              <span style={{ fontSize: 13, color: '#ccc' }}>{f}</span>
            </div>
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
          {sk ? 'Ziskat Coduy Pro' : 'Get Coduy Pro'}
        </button>

        <p style={{ fontSize: 11, color: '#555' }}>
          {sk ? 'Od 3.39 EUR / mesiac' : 'From 3.39 EUR / month'}
        </p>
      </motion.div>
    </motion.div>
  );
}
