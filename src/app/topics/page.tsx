'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { projectTopics } from '@/data/myprojects-topics';
import StatusBar from '@/components/StatusBar';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ArrowLeft, BookOpen, Code, PenTool, Lightbulb } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

const iconMap: Record<string, string> = {
  smartphone: '📱', database: '🗄', shield: '🔐', 'credit-card': '💳',
  'message-square': '💬', camera: '📸', zap: '⚡', 'git-branch': '🌿',
  code: '{}', layers: '📦', bell: '🔔', 'map-pin': '📍',
  'hard-drive': '💾', sparkles: '✦',
};

const typeIcons: Record<string, any> = {
  explain: BookOpen, mcq: Lightbulb, fill: Code, write: PenTool,
};

export default function TopicsPage() {
  const { completedLessons } = useUserStore();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const activeTopic = projectTopics.find(t => t.id === openTopic);

  // Topic detail view
  if (activeTopic) {
    return (
      <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
        <StatusBar />
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
          <button
            onClick={() => setOpenTopic(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, marginBottom: 20, padding: 0 }}
          >
            <ArrowLeft size={16} />
            {locale === 'sk' ? 'Späť na témy' : 'Back to topics'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{iconMap[activeTopic.icon] ?? '◆'}</span>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: 0 }}>{activeTopic.title}</h1>
              <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>{activeTopic.description}</p>
            </div>
          </div>

          <div style={{ height: 3, borderRadius: 2, background: '#1a1a1a', marginBottom: 24, overflow: 'hidden' }}>
            {(() => {
              const total = activeTopic.lessons.flatMap(l => l.exercises).length;
              const done = activeTopic.lessons.flatMap(l => l.exercises).filter(e => completedLessons.includes(activeTopic.id + '-' + e.id)).length;
              return <div style={{ height: '100%', background: '#4ade80', borderRadius: 2, width: `${total > 0 ? (done / total) * 100 : 0}%` }} />;
            })()}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeTopic.lessons.map((lesson, li) => {
              const exercises = lesson.exercises;
              const done = exercises.filter(e => completedLessons.includes(activeTopic.id + '-' + e.id)).length;
              const allDone = done === exercises.length;

              return (
                <div key={lesson.id} style={{ background: '#0a0a0a', border: `1px solid ${allDone ? 'rgba(74,222,128,0.2)' : '#1a1a1a'}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: allDone ? '#4ade80' : '#111', border: allDone ? 'none' : '1px solid #222',
                    }}>
                      {allDone ? <Check size={18} color="#052e16" strokeWidth={3} /> : <span style={{ fontSize: 14, fontWeight: 700, color: '#888' }}>{li + 1}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: allDone ? '#4ade80' : '#ddd' }}>{lesson.title}</div>
                      <div style={{ fontSize: 11, color: '#777', marginTop: 2 }}>{done}/{exercises.length} {locale === 'sk' ? 'hotových' : 'done'}</div>
                    </div>
                  </div>

                  {/* Exercise list */}
                  <div style={{ borderTop: '1px solid #111' }}>
                    {exercises.map((ex, ei) => {
                      const exDone = completedLessons.includes(activeTopic.id + '-' + ex.id);
                      const TypeIcon = typeIcons[ex.type] || BookOpen;
                      const typeLabel = ex.type === 'explain' ? (locale === 'sk' ? 'Čítanie' : 'Read')
                        : ex.type === 'mcq' ? 'Quiz'
                        : ex.type === 'fill' ? (locale === 'sk' ? 'Doplň kód' : 'Fill code')
                        : (locale === 'sk' ? 'Napíš kód' : 'Write code');

                      return (
                        <button
                          key={ex.id}
                          onClick={() => {/* TODO: open exercise */}}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', cursor: 'pointer', textAlign: 'left',
                            borderTop: ei === 0 ? 'none' : '1px solid #0f0f0f',
                            background: 'none', border: 'none',
                          }}
                        >
                          <div style={{
                            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: exDone ? '#4ade80' : 'transparent',
                            border: exDone ? 'none' : '1px solid #2a2a2a',
                          }}>
                            {exDone ? <Check size={12} color="#052e16" strokeWidth={3} /> : <TypeIcon size={10} color="#555" />}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: exDone ? '#888' : '#ccc', fontWeight: 500 }}>
                              {ex.prompt.length > 60 ? ex.prompt.slice(0, 60) + '...' : ex.prompt}
                            </div>
                          </div>
                          <span style={{ fontSize: 9, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {typeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Topics grid
  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 6 }}>
            {s('myProjects', locale)}
          </h1>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 24 }}>
            {s('myProjectsDesc', locale)}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {projectTopics.map((topic, i) => {
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
                onClick={() => setOpenTopic(topic.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                  padding: '16px', borderRadius: 16, textAlign: 'left',
                  cursor: 'pointer', border: 'none',
                  background: '#0a0a0a',
                  outline: '1.5px solid #1a1a1a',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>
                    {iconMap[topic.icon] ?? '◆'}
                  </span>
                  {done > 0 && (
                    <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>
                      {done}/{total}
                    </span>
                  )}
                </div>

                <div style={{ fontWeight: 700, fontSize: 13, color: '#ccc', marginBottom: 4 }}>
                  {topic.title}
                </div>
                <div style={{ fontSize: 11, color: '#777', lineHeight: 1.4, marginBottom: 10 }}>
                  {topic.description}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontSize: 10, color: '#555' }}>
                    {topic.lessons.length} {s('lessons', locale)} - {total} {s('exercises', locale)}
                  </span>
                  <ChevronRight size={14} color="#333" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
