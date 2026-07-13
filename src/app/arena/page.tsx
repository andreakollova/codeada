'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { fetchQuizForLesson, DbQuizQuestion } from '@/lib/curriculum-api';
import { ArrowLeft, Check, X, Zap, Trophy } from 'lucide-react';
import Byte from '@/components/Byte';
import StatusBar from '@/components/StatusBar';
import type { ByteEquipment } from '@/types';

const WORLD_W = 2000;
const WORLD_H = 2000;
const BYTE_R = 28;
const BOUNCE_FORCE = 8;
const PLAYER_SPEED = 3.5;
const BOT_SPEED = 1.5;
const MINIMAP_SIZE = 120;

interface ArenaEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  equipment: ByteEquipment;
  name: string;
  isPlayer?: boolean;
}

const BOT_NAMES = ['Nova', 'Pixel', 'Glitch', 'Echo', 'Spark', 'Flux', 'Dash', 'Blip'];
const BOT_EQUIPS: ByteEquipment[] = [
  { hat: 'hat-beanie', glasses: 'glasses-round' },
  { hat: 'hat-party', antenna: 'ant-star' },
  { glasses: 'glasses-reading', accessory: 'acc-scarf' },
  { hat: 'hat-headband', antenna: 'ant-heart' },
  { hat: 'hat-cowboy', glasses: 'glasses-cool' },
  { accessory: 'acc-bowtie', antenna: 'ant-diamond' },
  { hat: 'hat-graduation' },
  { glasses: 'glasses-aviator', accessory: 'acc-medal' },
];

export default function ArenaPage() {
  const { equipment, name, addXp } = useUserStore();
  const { locale } = useLocaleStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [entities, setEntities] = useState<ArenaEntity[]>([]);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [targetX, setTargetX] = useState(WORLD_W / 2);
  const [targetY, setTargetY] = useState(WORLD_H / 2);
  const [battle, setBattle] = useState<{ opponent: ArenaEntity; questions: DbQuizQuestion[] } | null>(null);
  const [battleIdx, setBattleIdx] = useState(0);
  const [battleScore, setBattleScore] = useState({ player: 0, bot: 0 });
  const [battleAnswer, setBattleAnswer] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [collidedWith, setCollidedWith] = useState<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const entitiesRef = useRef<ArenaEntity[]>([]);
  const targetRef = useRef({ x: WORLD_W / 2, y: WORLD_H / 2 });

  // Init entities
  useEffect(() => {
    const playerX = WORLD_W / 2;
    const playerY = WORLD_H / 2;
    const bots: ArenaEntity[] = BOT_NAMES.map((n, i) => ({
      id: `bot-${i}`,
      x: 200 + Math.random() * (WORLD_W - 400),
      y: 200 + Math.random() * (WORLD_H - 400),
      vx: (Math.random() - 0.5) * BOT_SPEED * 2,
      vy: (Math.random() - 0.5) * BOT_SPEED * 2,
      equipment: BOT_EQUIPS[i],
      name: n,
    }));
    const player: ArenaEntity = {
      id: 'player',
      x: playerX, y: playerY, vx: 0, vy: 0,
      equipment, name: name || 'You', isPlayer: true,
    };
    const all = [player, ...bots];
    setEntities(all);
    entitiesRef.current = all;
    setTargetX(playerX);
    setTargetY(playerY);
    targetRef.current = { x: playerX, y: playerY };
  }, []);

  // Game loop
  useEffect(() => {
    let botDirTimer = 0;

    const tick = () => {
      const ents = entitiesRef.current;
      if (ents.length === 0 || battle) { rafRef.current = requestAnimationFrame(tick); return; }

      botDirTimer++;
      const updated = ents.map(e => ({ ...e }));
      const player = updated.find(e => e.isPlayer)!;

      // Player movement toward target
      const dx = targetRef.current.x - player.x;
      const dy = targetRef.current.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 5) {
        player.vx = (dx / dist) * PLAYER_SPEED;
        player.vy = (dy / dist) * PLAYER_SPEED;
      } else {
        player.vx *= 0.9;
        player.vy *= 0.9;
      }

      // Bot AI - change direction randomly
      if (botDirTimer % 90 === 0) {
        updated.filter(e => !e.isPlayer).forEach(bot => {
          bot.vx = (Math.random() - 0.5) * BOT_SPEED * 2;
          bot.vy = (Math.random() - 0.5) * BOT_SPEED * 2;
        });
      }

      // Move all
      updated.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;

        // Boundary bounce
        if (e.x < BYTE_R) { e.x = BYTE_R; e.vx = Math.abs(e.vx) * 0.8; }
        if (e.x > WORLD_W - BYTE_R) { e.x = WORLD_W - BYTE_R; e.vx = -Math.abs(e.vx) * 0.8; }
        if (e.y < BYTE_R) { e.y = BYTE_R; e.vy = Math.abs(e.vy) * 0.8; }
        if (e.y > WORLD_H - BYTE_R) { e.y = WORLD_H - BYTE_R; e.vy = -Math.abs(e.vy) * 0.8; }
      });

      // Collision detection
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const a = updated[i], b = updated[j];
          const cdx = b.x - a.x, cdy = b.y - a.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          const minDist = BYTE_R * 2;
          if (cdist < minDist && cdist > 0) {
            // Bounce
            const nx = cdx / cdist, ny = cdy / cdist;
            const overlap = minDist - cdist;
            a.x -= nx * overlap / 2;
            a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2;
            b.y += ny * overlap / 2;
            a.vx -= nx * BOUNCE_FORCE;
            a.vy -= ny * BOUNCE_FORCE;
            b.vx += nx * BOUNCE_FORCE;
            b.vy += ny * BOUNCE_FORCE;

            // Player collision with bot - trigger battle
            if ((a.isPlayer || b.isPlayer) && !battle) {
              const bot = a.isPlayer ? b : a;
              if (!collidedWith.has(bot.id)) {
                setCollidedWith(prev => new Set([...prev, bot.id]));
                triggerBattle(bot);
              }
            }
          }
        }
      }

      // Damping
      updated.forEach(e => {
        if (!e.isPlayer) {
          e.vx *= 0.98;
          e.vy *= 0.98;
        }
      });

      entitiesRef.current = updated;
      setEntities([...updated]);

      // Camera follows player
      if (player) {
        setCameraX(player.x - window.innerWidth / 2);
        setCameraY(player.y - window.innerHeight / 2);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [battle]);

  const triggerBattle = async (opponent: ArenaEntity) => {
    // Fetch random quiz questions
    const randomLessonId = 86 + Math.floor(Math.random() * 100);
    const questions = await fetchQuizForLesson(randomLessonId);
    if (questions.length < 3) {
      // Try another lesson
      const q2 = await fetchQuizForLesson(96 + Math.floor(Math.random() * 50));
      questions.push(...q2);
    }
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 5);
    if (shuffled.length > 0) {
      setBattle({ opponent, questions: shuffled });
      setBattleIdx(0);
      setBattleScore({ player: 0, bot: 0 });
      setBattleAnswer(null);
      setBattleState('idle');
      setBattleResult(null);
    } else {
      // No questions available, just clear collision
      setTimeout(() => setCollidedWith(prev => { const n = new Set(prev); n.delete(opponent.id); return n; }), 5000);
    }
  };

  const handleBattleAnswer = (answer: string) => {
    if (battleState !== 'idle' || !battle) return;
    setBattleAnswer(answer);
    const q = battle.questions[battleIdx];
    const correctLabel = q.question_type === 'true_false'
      ? (q.correct_answer === 'True' ? 'T' : 'F')
      : q.correct_answer;
    const isCorrect = answer === correctLabel;

    // Bot answers randomly with 40% accuracy after 2-4s (simulated)
    const botCorrect = Math.random() < 0.4;

    if (isCorrect) {
      setBattleState('correct');
      setBattleScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setBattleState('wrong');
      if (botCorrect) setBattleScore(prev => ({ ...prev, bot: prev.bot + 1 }));
    }

    setTimeout(() => {
      if (battleIdx + 1 < battle.questions.length) {
        setBattleIdx(i => i + 1);
        setBattleAnswer(null);
        setBattleState('idle');
      } else {
        // Battle over
        const finalPlayer = isCorrect ? battleScore.player + 1 : battleScore.player;
        const finalBot = botCorrect && !isCorrect ? battleScore.bot + 1 : battleScore.bot;
        setBattleResult(finalPlayer >= finalBot ? 'win' : 'lose');
        if (finalPlayer >= finalBot) addXp(25);
      }
    }, 1200);
  };

  const closeBattle = () => {
    if (battle) {
      setTimeout(() => setCollidedWith(prev => { const n = new Set(prev); n.delete(battle.opponent.id); return n; }), 8000);
    }
    setBattle(null);
  };

  // Touch/mouse controls
  const handlePointer = useCallback((e: React.PointerEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    const wx = clientX - rect.left + cameraX;
    const wy = clientY - rect.top + cameraY;
    setTargetX(wx);
    setTargetY(wy);
    targetRef.current = { x: wx, y: wy };
  }, [cameraX, cameraY]);

  const player = entities.find(e => e.isPlayer);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050505', overflow: 'hidden', touchAction: 'none' }}>
      {/* Game world */}
      <div
        ref={canvasRef}
        onPointerDown={handlePointer}
        onPointerMove={(e) => { if (e.buttons > 0) handlePointer(e); }}
        onTouchStart={handlePointer}
        onTouchMove={handlePointer}
        style={{
          position: 'absolute', inset: 0, cursor: 'crosshair',
        }}
      >
        <div style={{
          position: 'absolute',
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
          width: WORLD_W, height: WORLD_H,
        }}>
          {/* Grid */}
          <svg width={WORLD_W} height={WORLD_H} style={{ position: 'absolute', top: 0, left: 0 }}>
            {Array.from({ length: Math.floor(WORLD_W / 100) + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={WORLD_H} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
            ))}
            {Array.from({ length: Math.floor(WORLD_H / 100) + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 100} x2={WORLD_W} y2={i * 100} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
            ))}
            {/* Border */}
            <rect x={2} y={2} width={WORLD_W - 4} height={WORLD_H - 4} fill="none" stroke="rgba(74,222,128,0.15)" strokeWidth={3} rx={8} />
          </svg>

          {/* Entities */}
          {entities.map(e => (
            <div
              key={e.id}
              style={{
                position: 'absolute',
                left: e.x - 28, top: e.y - 28,
                transition: battle ? 'none' : undefined,
              }}
            >
              <Byte mood="happy" size={56} equipment={e.equipment} animate={false} />
              <div style={{
                textAlign: 'center', fontSize: 9, fontWeight: 700,
                color: e.isPlayer ? '#4ade80' : '#555',
                marginTop: -4, letterSpacing: '0.04em',
              }}>
                {e.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimap */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        width: MINIMAP_SIZE, height: MINIMAP_SIZE,
        background: 'rgba(0,0,0,0.6)', border: '1px solid #222',
        borderRadius: 10, overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        {entities.map(e => (
          <div
            key={e.id}
            style={{
              position: 'absolute',
              left: (e.x / WORLD_W) * MINIMAP_SIZE - 3,
              top: (e.y / WORLD_H) * MINIMAP_SIZE - 3,
              width: e.isPlayer ? 8 : 5,
              height: e.isPlayer ? 8 : 5,
              borderRadius: '50%',
              background: e.isPlayer ? '#4ade80' : 'rgba(255,255,255,0.5)',
              boxShadow: e.isPlayer ? '0 0 6px rgba(74,222,128,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        style={{
          position: 'absolute', top: 16, left: 16,
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(0,0,0,0.6)', border: '1px solid #222',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888', backdropFilter: 'blur(8px)',
        }}
      >
        <ArrowLeft size={16} />
      </button>

      {/* Player name + score */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        padding: '8px 20px', borderRadius: 20,
        background: 'rgba(0,0,0,0.6)', border: '1px solid #222',
        backdropFilter: 'blur(8px)',
        fontSize: 12, fontWeight: 600, color: '#888',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
        {name || 'You'}
        <span style={{ color: '#555' }}>-</span>
        <span style={{ color: '#555', fontSize: 10 }}>{locale === 'sk' ? 'Ťahaj kam sa má Byte gúľať' : 'Drag where Byte should roll'}</span>
      </div>

      {/* BATTLE MODAL */}
      <AnimatePresence>
        {battle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ maxWidth: 440, width: '100%' }}
            >
              {/* Battle result */}
              {battleResult ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
                    <Byte mood={battleResult === 'win' ? 'celebrating' : 'worried'} size={80} equipment={equipment} />
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#555', alignSelf: 'center' }}>VS</div>
                    <Byte mood="happy" size={80} equipment={battle.opponent.equipment} />
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: battleResult === 'win' ? '#4ade80' : '#ff8080', marginBottom: 8 }}>
                    {battleResult === 'win'
                      ? (locale === 'sk' ? 'Výhra!' : 'You win!')
                      : (locale === 'sk' ? 'Prehral si' : 'You lose')}
                  </h2>
                  <p style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>
                    {battleScore.player} - {battleScore.bot}
                  </p>
                  {battleResult === 'win' && (
                    <p style={{ fontSize: 13, color: '#4ade80', fontWeight: 600, marginBottom: 20 }}>+25 XP</p>
                  )}
                  <button
                    onClick={closeBattle}
                    style={{
                      padding: '14px 40px', borderRadius: 12, background: '#EDEDED', color: '#000',
                      fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                    }}
                  >
                    {locale === 'sk' ? 'Pokračovať' : 'Continue'}
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* VS header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Byte mood="happy" size={36} equipment={equipment} animate={false} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>{name || 'You'}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{battleScore.player}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#555', fontWeight: 700 }}>
                      {battleIdx + 1}/{battle.questions.length}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#888' }}>{battle.opponent.name}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{battleScore.bot}</div>
                      </div>
                      <Byte mood="happy" size={36} equipment={battle.opponent.equipment} animate={false} />
                    </div>
                  </div>

                  {/* Question */}
                  <div style={{
                    background: '#111', border: '1px solid #1a1a1a', borderRadius: 14,
                    padding: '20px', marginBottom: 12,
                  }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#eee', lineHeight: 1.4, margin: 0 }}>
                      {battle.questions[battleIdx]?.question_text || ''}
                    </h3>
                    {battle.questions[battleIdx]?.code_snippet && (
                      <pre style={{
                        background: '#0a0a0a', borderRadius: 8, padding: '10px 12px',
                        fontSize: 12, color: '#ccc', marginTop: 10, overflow: 'auto',
                        fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6,
                      }}>
                        {battle.questions[battleIdx].code_snippet}
                      </pre>
                    )}
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(() => {
                      const q = battle.questions[battleIdx];
                      if (!q) return null;
                      const correctLabel = q.question_type === 'true_false'
                        ? (q.correct_answer === 'True' ? 'T' : 'F')
                        : q.correct_answer;
                      const opts = q.question_type === 'true_false'
                        ? [{ label: 'T', text: 'True' }, { label: 'F', text: 'False' }]
                        : (q.options || []).sort((a, b) => a.option_label.localeCompare(b.option_label)).map(o => ({ label: o.option_label, text: o.option_text }));

                      return opts.map(opt => {
                        const sel = battleAnswer === opt.label;
                        const isCorrect = battleState !== 'idle' && opt.label === correctLabel;
                        const isWrong = battleState === 'wrong' && sel;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleBattleAnswer(opt.label)}
                            disabled={battleState !== 'idle'}
                            style={{
                              padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                              display: 'flex', alignItems: 'center', gap: 10,
                              fontSize: 13, fontWeight: 500, cursor: battleState !== 'idle' ? 'default' : 'pointer',
                              background: isCorrect ? 'rgba(74,222,128,0.08)' : isWrong ? 'rgba(255,80,80,0.06)' : '#0a0a0a',
                              border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : isWrong ? 'rgba(255,80,80,0.3)' : '#1a1a1a'}`,
                              color: isCorrect ? '#4ade80' : isWrong ? '#ff8080' : '#ccc',
                            }}
                          >
                            <div style={{
                              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: isCorrect ? '#4ade80' : isWrong ? '#ff8080' : '#161616',
                              color: isCorrect || isWrong ? '#000' : '#888',
                              fontSize: 10, fontWeight: 700,
                            }}>
                              {isCorrect ? <Check size={10} strokeWidth={3} /> : opt.label}
                            </div>
                            {opt.text}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
