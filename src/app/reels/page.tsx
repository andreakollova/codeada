'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';
import { ArrowLeft, Play, Clock, BookOpen } from 'lucide-react';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjyolgkakxuaegpvhimy.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeW9sZ2tha3h1YWVncHZoaW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDQzNDMsImV4cCI6MjA5ODM4MDM0M30.yJPOBCMFdTVf44rVXBFLGLBn5LrW1p4R3FP-5TjJbfI'
);

interface ReelData {
  lessonId: number;
  lessonTitle: string;
  moduleTitle: string;
  lang: string;
  videoUrl: string;
  publishedAt: string;
  durationSeconds: number;
}

export default function ReelsPage() {
  const router = useRouter();
  const { locale } = useLocaleStore();
  const [reels, setReels] = useState<ReelData[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    async function load() {
      try {
        const { data } = await sb.storage.from('ig-media').download('tracking/reels.json');
        if (data) {
          const all: ReelData[] = JSON.parse(await data.text());
          // Filter by locale, newest first
          // Filter by locale, deduplicate per lesson (keep latest only), newest first
          const byLang = all.filter(r => r.lang === locale)
            .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          const seen = new Set<number>();
          const unique: ReelData[] = [];
          for (const r of byLang) {
            if (!seen.has(r.lessonId)) {
              seen.add(r.lessonId);
              unique.push(r);
            }
          }
          setReels(unique);
        }
      } catch {}
    }
    load();
  }, [locale]);

  const togglePlay = (idx: number) => {
    const video = videoRefs.current[idx];
    if (!video) return;

    if (playing === idx) {
      video.pause();
      setPlaying(null);
    } else {
      // Pause previous
      if (playing !== null && videoRefs.current[playing]) {
        videoRefs.current[playing]?.pause();
      }
      video.play();
      setPlaying(idx);
    }
  };

  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#000', padding: '20px 16px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: 0 }}>
          {locale === 'sk' ? 'Reels' : 'Reels'}
        </h1>
        <span style={{ fontSize: 13, color: '#555' }}>
          {reels.length} {s('videos', locale)}
        </span>
      </div>

      {/* Reels grid */}
      <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {reels.length === 0 && (
          <p style={{ color: '#555', textAlign: 'center', marginTop: 40 }}>
            {s('noReels', locale)}
          </p>
        )}

        {reels.map((reel, i) => (
          <motion.div
            key={`${reel.lessonId}-${reel.lang}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* Video */}
            <div
              style={{ position: 'relative', aspectRatio: '9/16', background: '#000', cursor: 'pointer' }}
              onClick={() => togglePlay(i)}
            >
              <video
                ref={el => { videoRefs.current[i] = el; }}
                src={reel.videoUrl}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline
                onEnded={() => setPlaying(null)}
              />
              {playing !== i && (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(0,0,0,0.3)',
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 28,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Play size={24} color="#fff" fill="#fff" />
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#4ade80', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                {reel.moduleTitle}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#eee', margin: '0 0 8px' }}>
                {reel.lessonTitle}
              </h3>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {reel.durationSeconds}s
                </span>
                <button
                  onClick={() => router.push(`/theory/${reel.lessonId}`)}
                  style={{
                    fontSize: 12, color: '#4ade80', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <BookOpen size={12} />
                  {s('fullLesson', locale)}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
