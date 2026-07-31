'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocaleStore } from '@/store/localeStore';
import { useUserStore } from '@/store/userStore';
import { X, ChevronRight, Smartphone, Search, Plus } from 'lucide-react';

// Exportable trigger — other components can open the wizard
let openWidgetWizard: (() => void) | null = null;
export function triggerWidgetWizard() { openWidgetWizard?.(); }

const STEPS = [
  {
    titleSk: 'Pridaj si Coduy widget',
    titleEn: 'Add the Coduy widget',
    descSk: 'Nový programátorský pojem každý deň priamo na tvojej ploche. Stačia 3 jednoduché kroky.',
    descEn: 'A new programming term every day right on your Home Screen. Just 3 simple steps.',
  },
  {
    titleSk: 'Dlho drž na ploche',
    titleEn: 'Long press on Home Screen',
    descSk: 'Drž prst na prázdnom mieste na ploche tvojho iPhonu, kým sa ikonky nezačnú triasť.',
    descEn: 'Hold your finger on an empty area of your iPhone Home Screen until the icons start to jiggle.',
  },
  {
    titleSk: 'Klikni Upraviť → Pridať widget',
    titleEn: 'Tap Edit → Add Widget',
    descSk: 'V ľavom hornom rohu klikni "Upraviť" a potom "Pridať widget".',
    descEn: 'Tap "Edit" in the top left corner, then tap "Add Widget".',
  },
  {
    titleSk: 'Hľadaj Coduy a vyber veľkosť',
    titleEn: 'Search Coduy and pick a size',
    descSk: 'Do vyhľadávania napíš "Coduy", vyber malý alebo stredný widget a pridaj ho na plochu.',
    descEn: 'Type "Coduy" in the search bar, choose small or medium widget, and add it to your Home Screen.',
  },
];

function PhoneMockup({ step }: { step: number }) {
  return (
    <div style={{
      width: 220, height: 380, borderRadius: 32, position: 'relative',
      background: '#1a1a1a', border: '3px solid #333',
      overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      margin: '0 auto',
    }}>
      {/* Notch */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: '#000', borderRadius: '0 0 16px 16px', zIndex: 10 }} />

      {/* Screen content */}
      <div style={{ padding: '36px 14px 14px', height: '100%', boxSizing: 'border-box' }}>
        {/* Step 0: Intro — widget preview */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, paddingBottom: 40 }}
          >
            {/* Large widget preview */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 180, background: '#111', borderRadius: 20, padding: 14,
                border: '1px solid #222', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <img src="/logocoduy.png" alt="" style={{ height: 12, opacity: 0.5 }} />
                <div style={{ width: 24, height: 24, borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: '#fff', margin: '0 1px' }} />
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: '#fff', margin: '0 1px' }} />
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>API</div>
              <div style={{ fontSize: 10, color: '#4ade80', marginBottom: 6 }}>Application Programming Interface</div>
              <div style={{ fontSize: 9, color: '#999', lineHeight: 1.4 }}>A set of rules that lets apps talk to each other.</div>
              <div style={{ fontSize: 7, color: '#555', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Word of the Day</div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 1: Long press */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {Array.from({ length: 12 }, (_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: [0, -2, 2, -2, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1', '#000', '#84cc16'][i],
                    opacity: i === 10 ? 1 : 0.7,
                  }}
                >
                  {i === 10 && (
                    <img src="/logocoduy.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', fontSize: 40 }}
            >
              👆
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Edit → Add Widget */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                background: '#333', borderRadius: 14, padding: '10px 20px',
                color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 24,
              }}
            >
              Upraviť
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.08, 1], boxShadow: ['0 0 0 rgba(74,222,128,0)', '0 0 20px rgba(74,222,128,0.3)', '0 0 0 rgba(74,222,128,0)'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              style={{
                background: '#22c55e', borderRadius: 14, padding: '12px 24px',
                color: '#000', fontSize: 13, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <Plus size={14} strokeWidth={3} />
              Pridať widget
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Search + pick size */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}
          >
            <div style={{
              background: '#2a2a2a', borderRadius: 10, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Search size={14} color="#888" />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Coduy</motion.span>
            </div>
            {/* Size options */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 70, height: 70, borderRadius: 16, background: '#111',
                  border: '2px solid #22c55e', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                }}
              >
                <div style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>API</div>
                <div style={{ fontSize: 5, color: '#4ade80' }}>Small</div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                style={{
                  width: 110, height: 70, borderRadius: 16, background: '#111',
                  border: '1px solid #333', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                }}
              >
                <div style={{ fontSize: 8, fontWeight: 800, color: '#fff' }}>API</div>
                <div style={{ fontSize: 5, color: '#888' }}>Medium</div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              style={{
                background: '#22c55e', borderRadius: 12, padding: '10px',
                color: '#000', fontSize: 12, fontWeight: 700, textAlign: 'center', marginTop: 8,
              }}
            >
              Pridať widget
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function WidgetTip() {
  const { locale } = useLocaleStore();
  const { name } = useUserStore();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const sk = locale === 'sk';

  // Register global trigger
  useEffect(() => {
    openWidgetWizard = () => { setStep(0); setShow(true); };
    return () => { openWidgetWizard = null; };
  }, []);

  // Auto-show once for new users in native app
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Capacitor) return;
    if (!name) return;
    const shown = localStorage.getItem('coduy-widget-tip');
    if (shown) return;

    const timer = setTimeout(() => { setStep(0); setShow(true); }, 5000);
    return () => clearTimeout(timer);
  }, [name]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('coduy-widget-tip', 'true');
  };

  const next = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 24px',
            overflowY: 'auto', justifyContent: 'safe center',
          }}
        >
          {/* Close */}
          <button onClick={dismiss} style={{
            position: 'absolute', top: 'calc(env(safe-area-inset-top, 16px) + 16px)', right: 16,
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 20,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#888',
          }}>
            <X size={16} />
          </button>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: i === step ? 24 : 8, height: 8, borderRadius: 4,
                background: i === step ? '#22c55e' : '#333',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {/* Phone mockup — swipeable */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && step < 3) setStep(step + 1);
              if (info.offset.x > 50 && step > 0) setStep(step - 1);
            }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', touchAction: 'pan-y' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -60, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <PhoneMockup step={step} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Title + description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              style={{ textAlign: 'center', marginTop: 28, maxWidth: 300 }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {sk ? STEPS[step].titleSk : STEPS[step].titleEn}
              </h3>
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
                {sk ? STEPS[step].descSk : STEPS[step].descEn}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 32 }}>
            <motion.button
              onClick={next}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '14px 40px', borderRadius: 14,
                background: '#22c55e', color: '#000', fontWeight: 700, fontSize: 15,
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {step === 0
                ? (sk ? 'Ako na to?' : 'Show me how')
                : step < 3
                  ? (sk ? 'Ďalej' : 'Next')
                  : (sk ? 'Hotovo' : 'Done')
              }
              {step > 0 && step < 3 && <ChevronRight size={16} strokeWidth={3} />}
            </motion.button>

            {step === 0 && (
              <button
                onClick={dismiss}
                style={{
                  background: 'none', border: 'none', color: '#555', fontSize: 13,
                  cursor: 'pointer', fontWeight: 500, padding: '8px 16px',
                }}
              >
                {sk ? 'Teraz nie' : 'Not now'}
              </button>
            )}
          </div>

          {/* Step number */}
          {step > 0 && (
            <p style={{ fontSize: 12, color: '#555', marginTop: 16 }}>
              {step} / 3
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
