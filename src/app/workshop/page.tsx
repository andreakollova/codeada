'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { cosmeticItems, rarityLabel } from '@/data/cosmetics';
import Byte from '@/components/Byte';
import { ByteEquipment, ItemType } from '@/types';
import { ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

const tabs: { id: ItemType; label: string }[] = [
  { id: 'hat',       label: 'Čiapky' },
  { id: 'glasses',   label: 'Okuliare' },
  { id: 'accessory', label: 'Doplnky' },
  { id: 'antenna',   label: 'Anténa' },
];

export default function WorkshopPage() {
  const { ownedItems, equipment, equip, byteMood } = useUserStore();
  const [activeTab, setActiveTab] = useState<ItemType>('hat');

  const tabItems = cosmeticItems.filter(i => i.type === activeTab);

  const handleEquip = (itemId: string, type: ItemType) => {
    if (!ownedItems.includes(itemId)) return;
    const slot = type as keyof ByteEquipment;
    // Toggle off if already equipped
    if (equipment[slot] === itemId) {
      equip(slot, undefined);
    } else {
      equip(slot, itemId);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #111', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <Link href="/">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 36, height: 36, borderRadius: 10, background: '#111', border: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={18} color="#888" />
          </motion.div>
        </Link>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>Workshop</h1>
          <p style={{ fontSize: 12, color: '#555', margin: 0 }}>{ownedItems.length} predmetov odomknutých</p>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* Byte preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 24, marginBottom: 28 }}
        >
          <Byte mood={byteMood} size={180} equipment={equipment} />
          {/* Equipped badges */}
          <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(Object.entries(equipment) as [keyof ByteEquipment, string][])
              .filter(([, v]) => !!v)
              .map(([slot, itemId]) => {
                const item = cosmeticItems.find(i => i.id === itemId);
                return item ? (
                  <span key={slot} style={{ fontSize: 11, padding: '3px 10px', background: '#111', border: '1px solid #2a2a2a', borderRadius: 20, color: '#888', fontFamily: 'Syne, sans-serif' }}>
                    {item.name}
                  </span>
                ) : null;
              })}
            {Object.values(equipment).every(v => !v) && (
              <span style={{ fontSize: 12, color: '#444', fontFamily: 'DM Sans, sans-serif' }}>Žiadne vybavenie — vyber niečo nižšie</span>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#0a0a0a', padding: 4, borderRadius: 14, border: '1px solid #1a1a1a' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: activeTab === tab.id ? '#fff' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#555',
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}
          >
            {tabItems.map((item, i) => {
              const owned = ownedItems.includes(item.id);
              const equipped = equipment[item.type as keyof ByteEquipment] === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleEquip(item.id, item.type)}
                  whileHover={owned ? { scale: 1.03 } : {}}
                  whileTap={owned ? { scale: 0.97 } : {}}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '16px 8px', borderRadius: 16, textAlign: 'center', cursor: owned ? 'pointer' : 'default',
                    background: equipped ? '#fff' : owned ? '#0d0d0d' : '#070707',
                    border: `1.5px solid ${equipped ? '#fff' : item.rarity === 'legendary' ? '#333' : item.rarity === 'rare' ? '#222' : '#151515'}`,
                    boxShadow: equipped ? '0 0 24px rgba(255,255,255,0.15)' : item.rarity === 'legendary' && owned ? '0 0 16px rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {/* Mini Byte preview with just this item */}
                  <div style={{ position: 'relative' }}>
                    <Byte
                      mood="happy"
                      size={72}
                      animate={false}
                      equipment={{ [item.type]: owned ? item.id : undefined } as ByteEquipment}
                    />
                    {!owned && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', borderRadius: '50%' }}>
                        <Lock size={18} color="#444" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 11, color: equipped ? '#000' : owned ? '#fff' : '#333', lineHeight: 1.2 }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 10, color: equipped ? '#555' : item.rarity === 'legendary' ? '#666' : item.rarity === 'rare' ? '#444' : '#333', marginTop: 2 }}>
                      {rarityLabel[item.rarity]}
                    </div>
                  </div>

                  {equipped && (
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(0,0,0,0.5)', background: '#ddd', padding: '2px 8px', borderRadius: 20 }}>
                      OBLEČENÉ
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#333', marginTop: 24, fontFamily: 'DM Sans, sans-serif' }}>
          Dokonči lekcie a odomkni nové predmety
        </p>
      </div>
    </div>
  );
}
