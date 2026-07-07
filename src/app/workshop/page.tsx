'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { cosmeticItems, rarityConfig } from '@/data/cosmetics';
import Byte from '@/components/Byte';
import { ByteEquipment, ItemType, CosmeticItem } from '@/types';
import { ArrowLeft, Lock, Shuffle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

const getTabLabel = (id: ItemType | 'all', locale: 'en' | 'sk') => {
  const map: Record<string, () => string> = {
    all: () => s('allItems', locale),
    hat: () => s('hats', locale),
    glasses: () => s('glasses', locale),
    accessory: () => s('accessories', locale),
    antenna: () => s('antennas', locale),
    aura: () => s('auras', locale),
  };
  return map[id]();
};

const tabIds: (ItemType | 'all')[] = ['all', 'hat', 'glasses', 'accessory', 'antenna', 'aura'];

const rarityOrder = ['mythic', 'legendary', 'epic', 'rare', 'common'] as const;

export default function WorkshopPage() {
  const { ownedItems, equipment, equip, byteMood } = useUserStore();
  const { locale } = useLocaleStore();
  const [activeTab, setActiveTab] = useState<ItemType | 'all'>('all');
  const [previewEquipment, setPreviewEquipment] = useState<ByteEquipment | null>(null);
  const [selectedItem, setSelectedItem] = useState<CosmeticItem | null>(null);

  const tabItems = activeTab === 'all'
    ? [...cosmeticItems].sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity))
    : cosmeticItems.filter(i => i.type === activeTab);

  const displayEquipment = previewEquipment || equipment;

  const handleItemClick = (item: CosmeticItem) => {
    const owned = ownedItems.includes(item.id);

    if (owned) {
      // Toggle equip
      const slot = item.type as keyof ByteEquipment;
      if (equipment[slot] === item.id) {
        equip(slot, undefined);
      } else {
        equip(slot, item.id);
      }
      setPreviewEquipment(null);
      setSelectedItem(null);
    } else {
      // Preview only — show on Byte temporarily
      setPreviewEquipment({ ...displayEquipment, [item.type]: item.id });
      setSelectedItem(item);
    }
  };

  const handleRandom = () => {
    const types: ItemType[] = ['hat', 'glasses', 'accessory', 'antenna', 'aura'];
    const random: ByteEquipment = {};
    types.forEach(type => {
      const items = cosmeticItems.filter(i => i.type === type);
      if (items.length > 0 && Math.random() > 0.2) {
        const pick = items[Math.floor(Math.random() * items.length)];
        (random as any)[type] = pick.id;
      }
    });
    setPreviewEquipment(random);
    setSelectedItem(null);
  };

  const clearPreview = () => {
    setPreviewEquipment(null);
    setSelectedItem(null);
  };

  const isPreviewMode = previewEquipment !== null;

  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #111', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)', zIndex: 50 }}>
        <Link href="/">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{ width: 36, height: 36, borderRadius: 10, background: '#111', border: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={18} color="#888" />
          </motion.div>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 700, fontSize: 18, margin: 0 }}>{s('locker', locale)}</h1>
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{ownedItems.length} / {cosmeticItems.length} {s('itemsUnlocked', locale)}</p>
        </div>
        {/* Random button */}
        <motion.button
          onClick={handleRandom}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: '#111', border: '1px solid #2a2a2a',
            color: '#aaa', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <Shuffle size={14} />
          {s('random', locale)}
        </motion.button>
      </div>

      <div style={{ maxWidth: 580, margin: '0 auto', padding: '24px 20px 80px' }}>
        {/* Byte preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '32px 20px', background: '#0a0a0a', border: '1px solid #1a1a1a',
            borderRadius: 24, marginBottom: 28, position: 'relative',
          }}
        >
          <Byte mood={byteMood} size={180} equipment={displayEquipment} />

          {/* Equipped / preview badges */}
          <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(Object.entries(displayEquipment) as [keyof ByteEquipment, string][])
              .filter(([, v]) => !!v)
              .map(([slot, itemId]) => {
                const item = cosmeticItems.find(i => i.id === itemId);
                if (!item) return null;
                const owned = ownedItems.includes(item.id);
                const rc = rarityConfig[item.rarity];
                return (
                  <span key={slot} style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
                    background: owned ? '#111' : `${rc.color}15`,
                    border: `1px solid ${owned ? '#2a2a2a' : rc.color + '44'}`,
                    color: owned ? '#888' : rc.color,
                  }}>
                    {item.name}
                    {!owned && ' ✦'}
                  </span>
                );
              })}
            {Object.values(displayEquipment).every(v => !v) && (
              <span style={{ fontSize: 12, color: '#777' }}>{s('noEquipment', locale)}</span>
            )}
          </div>

          {/* Preview mode banner */}
          {isPreviewMode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {s('previewMode', locale)}
              </span>
              <button
                onClick={clearPreview}
                style={{ fontSize: 11, color: '#888', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
              >
                {s('backToEquipped', locale)}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Selected item detail */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 16 }}
            >
              <div style={{
                padding: '16px 18px', borderRadius: 14,
                background: '#0a0a0a',
                border: `1.5px solid ${rarityConfig[selectedItem.rarity].border}33`,
                boxShadow: rarityConfig[selectedItem.rarity].glow !== 'none' ? rarityConfig[selectedItem.rarity].glow.replace(/0\.\d/g, '0.15') : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <Lock size={16} color={rarityConfig[selectedItem.rarity].color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{selectedItem.name}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{selectedItem.description}</div>
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: rarityConfig[selectedItem.rarity].color,
                  padding: '4px 10px', borderRadius: 20,
                  background: `${rarityConfig[selectedItem.rarity].color}15`,
                  border: `1px solid ${rarityConfig[selectedItem.rarity].color}33`,
                }}>
                  {rarityConfig[selectedItem.rarity].label}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#0a0a0a', padding: 4, borderRadius: 14, border: '1px solid #1a1a1a', overflowX: 'auto' }}>
          {tabIds.map(id => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: activeTab === id ? '#fff' : 'transparent',
                color: activeTab === id ? '#000' : '#888',
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {getTabLabel(id, locale)}
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
              const previewing = previewEquipment?.[item.type as keyof ByteEquipment] === item.id;
              const rc = rarityConfig[item.rarity];

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => handleItemClick(item)}
                  whileHover={{ scale: 1.03, borderColor: owned ? rc.border : '#333' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '14px 6px 12px', borderRadius: 16, textAlign: 'center',
                    cursor: 'pointer',
                    background: equipped ? '#fff' : previewing ? '#0f0f0f' : '#070707',
                    border: `1.5px solid ${equipped ? '#fff' : previewing ? rc.border + '66' : owned ? rc.border + '44' : '#181818'}`,
                    boxShadow: equipped ? '0 0 24px rgba(255,255,255,0.15)'
                      : previewing ? rc.glow.replace(/0\.\d/g, '0.2')
                      : owned && (item.rarity === 'mythic' || item.rarity === 'legendary' || item.rarity === 'epic') ? rc.glow : 'none',
                    transition: 'border-color 0.15s',
                    position: 'relative',
                  }}
                >
                  {/* Rarity dot indicator */}
                  {(item.rarity === 'mythic' || item.rarity === 'legendary' || item.rarity === 'epic') && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      width: 6, height: 6, borderRadius: '50%',
                      background: rc.color,
                      boxShadow: `0 0 6px ${rc.color}`,
                    }} />
                  )}

                  {/* Mini Byte preview — always show the item */}
                  <div style={{ position: 'relative', opacity: owned ? 1 : 0.5 }}>
                    <Byte
                      mood="happy"
                      size={68}
                      animate={false}
                      equipment={{ [item.type]: item.id } as ByteEquipment}
                    />
                  </div>

                  <div>
                    <div style={{
                      fontWeight: 600, fontSize: 11,
                      color: equipped ? '#000' : owned ? '#fff' : '#666',
                      lineHeight: 1.2,
                    }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: 10, marginTop: 2,
                      fontWeight: item.rarity === 'mythic' || item.rarity === 'legendary' ? 700 : 500,
                      color: equipped ? '#555' : rc.color + (owned ? '' : '88'),
                    }}>
                      {rc.label}
                    </div>
                  </div>

                  {/* Status badge */}
                  {equipped ? (
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(0,0,0,0.5)', background: '#ddd', padding: '2px 8px', borderRadius: 20 }}>
                      EQUIPPED
                    </div>
                  ) : !owned ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: '#555', fontWeight: 600 }}>
                      <Lock size={9} />
                      LOCKED
                    </div>
                  ) : null}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 24 }}>
          {s('completeLessonsToUnlock', locale)}
        </p>
      </div>
    </div>
  );
}
