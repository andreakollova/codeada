'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { projectTopics } from '@/data/myprojects-topics';
import BottomNav from '@/components/BottomNav';
import StatusBar from '@/components/StatusBar';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const iconMap: Record<string, string> = {
  smartphone: '📱',
  database: '🗄',
  shield: '🔐',
  'credit-card': '💳',
  'message-square': '💬',
  camera: '📸',
  zap: '⚡',
  'git-branch': '🌿',
  code: '{}',
  layers: '📦',
  bell: '🔔',
  'map-pin': '📍',
  'hard-drive': '💾',
  sparkles: '✦',
};

export default function TopicsPage() {
  const { selectedTopics, toggleTopic, completedLessons } = useUserStore();
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 6 }}>
            Moje Projekty
          </h1>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
            Vyber témy z reálnych projektov, ktoré chceš ovládať. Dostaneš lekcie priamo z praxe.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {projectTopics.map((topic, i) => {
            const selected = selectedTopics.includes(topic.id);
            const done = topic.lessons.flatMap(l => l.exercises).filter(e =>
              completedLessons.includes(topic.id + '-' + e.id)
            ).length;
            const total = topic.lessons.flatMap(l => l.exercises).length;

            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTopic(topic.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '16px', borderRadius: 16, textAlign: 'left',
                  cursor: 'pointer', border: 'none',
                  background: selected ? '#141414' : '#0a0a0a',
                  outline: `1.5px solid ${selected ? '#fff' : '#1a1a1a'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
                }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>
                    {iconMap[topic.icon] ?? '◆'}
                  </span>
                  {selected && (
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} color="#000" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: selected ? '#fff' : '#888', marginBottom: 4 }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: 11, color: '#777', lineHeight: 1.4, marginBottom: 10 }}>
                  {topic.description}
                </div>

                <div style={{ fontSize: 10, color: '#888', fontFamily: 'Syne, sans-serif' }}>
                  {topic.lessons.length} lekcií · {total} cvičení
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 24 }}
          >
            <button
              onClick={() => router.push('/topics/learn')}
              style={{
                width: '100%', padding: '14px', borderRadius: 14,
                background: '#fff', color: '#000', border: 'none',
                fontWeight: 800, fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Začať lekcie ({selectedTopics.length} tém)
            </button>
          </motion.div>
        )}

        {selectedTopics.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 24 }}>
            Vyber aspoň jednu tému a začni sa učiť z praxe.
          </p>
        )}
      </div>

    </div>
  );
}
