'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { X } from 'lucide-react';

export default function WidgetTip() {
  const { locale } = useLocaleStore();
  const [show, setShow] = useState(false);
  const sk = locale === 'sk';

  useEffect(() => {
    // Show only in native app, once, after a delay
    if (typeof window === 'undefined' || !(window as any).Capacitor) return;
    const shown = localStorage.getItem('coduy-widget-tip');
    if (shown) return;

    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('coduy-widget-tip', 'true');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          style={{
            position: 'fixed', bottom: 90, left: 16, right: 16, zIndex: 200,
            background: 'rgba(20,20,20,0.95)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 18, padding: '16px 18px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <button onClick={dismiss} style={{
            position: 'absolute', top: 10, right: 10,
            background: 'none', border: 'none', color: '#555', cursor: 'pointer',
          }}>
            <X size={14} />
          </button>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {/* Mini widget preview */}
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: '#0a0a0a', border: '1px solid #222',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '6px 8px',
            }}>
              <div style={{ fontSize: 6, color: '#555', fontWeight: 700 }}>coduy</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginTop: 2 }}>API</div>
              <div style={{ fontSize: 5, color: '#4ade80' }}>Application...</div>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                {sk ? 'Pridaj si widget' : 'Add widget to Home Screen'}
              </p>
              <div style={{ fontSize: 11, color: '#888', lineHeight: 1.6, margin: 0 }}>
                {sk ? (
                  <>
                    <span style={{ color: '#ccc' }}>1.</span> Dlho drž na ploche iPhonu<br/>
                    <span style={{ color: '#ccc' }}>2.</span> Klikni <span style={{ color: '#fff', fontWeight: 600 }}>Upraviť</span> → <span style={{ color: '#fff', fontWeight: 600 }}>Pridať widget</span><br/>
                    <span style={{ color: '#ccc' }}>3.</span> Hľadaj <span style={{ color: '#4ade80', fontWeight: 600 }}>Coduy</span> → vyber veľkosť → pridaj
                  </>
                ) : (
                  <>
                    <span style={{ color: '#ccc' }}>1.</span> Long press on iPhone Home Screen<br/>
                    <span style={{ color: '#ccc' }}>2.</span> Tap <span style={{ color: '#fff', fontWeight: 600 }}>Edit</span> → <span style={{ color: '#fff', fontWeight: 600 }}>Add Widget</span><br/>
                    <span style={{ color: '#ccc' }}>3.</span> Search <span style={{ color: '#4ade80', fontWeight: 600 }}>Coduy</span> → pick size → add
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
