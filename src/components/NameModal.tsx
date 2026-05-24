'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import Byte from './Byte';
import { ArrowRight } from 'lucide-react';

export default function NameModal() {
  const { name, setName } = useUserStore();
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (name) return null;

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSubmitted(true);
    setTimeout(() => setName(trimmed), 600);
  };

  return (
    <AnimatePresence>
      {!submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '40px 32px',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Byte */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Byte mood="happy" size={100} />
            </div>

            {/* Text */}
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#EDEDED', marginBottom: 8 }}>
              Ahoj, som Byte
            </h2>
            <p style={{ fontSize: 14, color: '#6E6E6E', marginBottom: 32, lineHeight: 1.6 }}>
              Budem ťa učiť programovanie. Ale najprv — ako sa voláš?
            </p>

            {/* Input */}
            <input
              type="text"
              placeholder="Tvoje meno..."
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
              style={{
                width: '100%',
                background: '#0F0F0F',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 15,
                color: '#EDEDED',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: 12,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.28)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={!value.trim()}
              whileHover={value.trim() ? { scale: 1.02 } : {}}
              whileTap={value.trim() ? { scale: 0.97 } : {}}
              style={{
                width: '100%', padding: '14px', borderRadius: 12,
                background: value.trim() ? '#EDEDED' : '#1C1C1C',
                color: value.trim() ? '#0F0F0F' : '#3A3A3A',
                fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: value.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Začíname
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
