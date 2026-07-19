'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { useSubscription } from './Paywall';
import Byte from './Byte';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProRewardModal() {
  const { locale } = useLocaleStore();
  const { equipment } = useUserStore();
  const { showProReward, dismissProReward } = useSubscription();
  const router = useRouter();
  const sk = locale === 'sk';

  return (
    <AnimatePresence>
      {showProReward && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 400,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            style={{
              maxWidth: 340, width: '100%',
              background: '#111', border: '1px solid #222',
              borderRadius: 24, padding: '36px 24px',
              textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Byte mood="celebrating" size={100} equipment={{ ...equipment, aura: 'aura-pro' }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                <Sparkles size={18} color="#4ade80" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                  {sk ? 'Nová odmena!' : 'New reward!'}
                </h2>
                <Sparkles size={18} color="#4ade80" />
              </div>

              <p style={{ fontSize: 18, fontWeight: 700, color: '#4ade80', marginTop: 8 }}>
                Pro Glow
              </p>
              <p style={{ fontSize: 13, color: '#888', marginTop: 4, lineHeight: 1.5 }}>
                {sk
                  ? 'Exkluzívna aura pre Coduy Pro členov. Už je equipnutá na tvojom Byte!'
                  : 'Exclusive aura for Coduy Pro members. Already equipped on your Byte!'}
              </p>

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button
                  onClick={() => { dismissProReward(); router.push('/workshop'); }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 12,
                    background: '#1a1a1a', border: '1px solid #333',
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  {sk ? 'Šatník' : 'Workshop'}
                </button>
                <button
                  onClick={dismissProReward}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 12,
                    background: '#EDEDED', color: '#000',
                    fontWeight: 700, fontSize: 13, border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {sk ? 'Super!' : 'Awesome!'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
