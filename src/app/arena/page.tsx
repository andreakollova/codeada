'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { useLocaleStore } from '@/store/localeStore';
import { fetchQuizForLesson, DbQuizQuestion } from '@/lib/curriculum-api';
import { ArrowLeft, Check, Zap, ArrowUp, ArrowDown, ArrowLeftIcon, ArrowRightIcon, X, Trophy } from 'lucide-react';
import Byte from '@/components/Byte';
import { t } from '@/store/localeStore';
import type { ByteEquipment } from '@/types';

const WORLD_W = 2400;
const WORLD_H = 2400;
const BYTE_R = 44;
const BOUNCE_FORCE = 12;
const PLAYER_SPEED = 3;
const BOT_SPEED = 2.5;
const FRICTION = 0.95;
const MINIMAP_SIZE = 100;

interface ArenaEntity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  equipment: ByteEquipment;
  name: string;
  isPlayer?: boolean;
  rotation: number;
}

interface BotDef {
  name: string;
  equipment: ByteEquipment;
  difficulty: 'easy' | 'medium' | 'hard';
  accuracy: number; // 0-1
}

const BOTS: BotDef[] = [
  // Easy - basic look, low accuracy
  { name: 'Nova', equipment: { hat: 'hat-beanie' }, difficulty: 'easy', accuracy: 0.2 },
  { name: 'Blip', equipment: { glasses: 'glasses-reading' }, difficulty: 'easy', accuracy: 0.25 },
  { name: 'Pip', equipment: { antenna: 'ant-heart' }, difficulty: 'easy', accuracy: 0.2 },
  // Medium - more gear, decent accuracy
  { name: 'Pixel', equipment: { hat: 'hat-cowboy', glasses: 'glasses-cool', accessory: 'acc-medal' }, difficulty: 'medium', accuracy: 0.5 },
  { name: 'Echo', equipment: { hat: 'hat-graduation', glasses: 'glasses-aviator', antenna: 'ant-lightning' }, difficulty: 'medium', accuracy: 0.55 },
  { name: 'Spark', equipment: { hat: 'hat-pilot', glasses: 'glasses-frost', accessory: 'acc-chain' }, difficulty: 'medium', accuracy: 0.5 },
  // Hard - full gear + aura, high accuracy
  { name: 'Glitch', equipment: { hat: 'hat-samurai', glasses: 'glasses-flame', accessory: 'acc-fire-cape', antenna: 'ant-flame-orb', aura: 'aura-fire' }, difficulty: 'hard', accuracy: 0.85 },
  { name: 'Flux', equipment: { hat: 'hat-golden-crown', glasses: 'glasses-golden', accessory: 'acc-wings-gold', antenna: 'ant-golden-star', aura: 'aura-golden' }, difficulty: 'hard', accuracy: 0.9 },
];

export default function ArenaPage() {
  const { equipment, name, addXp, xp, gems } = useUserStore();
  const { locale } = useLocaleStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [entities, setEntities] = useState<ArenaEntity[]>([]);
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [battle, setBattle] = useState<{ opponent: ArenaEntity; questions: DbQuizQuestion[] } | null>(null);
  const [battleIdx, setBattleIdx] = useState(0);
  const [battleScore, setBattleScore] = useState({ player: 0, bot: 0 });
  const [battleAnswer, setBattleAnswer] = useState<string | null>(null);
  const [battleState, setBattleState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [battleResult, setBattleResult] = useState<'win' | 'lose' | null>(null);
  const [collidedWith, setCollidedWith] = useState<Set<string>>(new Set());
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  const [bounceFlash, setBounceFlash] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'quiz' | 'free'>('quiz');
  const gameModeRef = useRef<'quiz' | 'free'>('quiz');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [arenaWins, setArenaWins] = useState<Record<string, number>>({});

  const rafRef = useRef<number>(0);
  const entitiesRef = useRef<ArenaEntity[]>([]);
  const keysRef = useRef<Set<string>>(new Set());
  const collidedRef = useRef<Set<string>>(new Set());
  const battleRef = useRef<any>(null);
  // Bot movement intents: each bot picks a direction and holds it for a duration
  const botIntentsRef = useRef<Record<string, { ax: number; ay: number; ticksLeft: number }>>({});

  // Keep refs in sync
  useEffect(() => { collidedRef.current = collidedWith; }, [collidedWith]);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);
  useEffect(() => { battleRef.current = battle; }, [battle]);

  // Hide nav in arena
  useEffect(() => {
    document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    const dashboard = document.querySelector('.dashboard') as HTMLElement;
    if (dashboard) dashboard.style.marginLeft = '0';
    return () => {
      document.querySelectorAll('.desktop-nav, .mobile-nav').forEach(el => {
        (el as HTMLElement).style.display = '';
      });
      if (dashboard) dashboard.style.marginLeft = '';
    };
  }, []);

  // Init entities
  useEffect(() => {
    const px = WORLD_W / 2, py = WORLD_H / 2;
    const bots: ArenaEntity[] = BOTS.map((b, i) => {
      // First 2 bots spawn near player (within 300px), rest random
      const nearPlayer = i < 2;
      const angle = (i / 2) * Math.PI + Math.random() * 0.5;
      const dist = nearPlayer ? 150 + Math.random() * 200 : 400 + Math.random() * (WORLD_W / 2 - 400);
      return {
        id: `bot-${i}`, name: b.name, equipment: b.equipment,
        x: nearPlayer ? px + Math.cos(angle) * dist : 300 + Math.random() * (WORLD_W - 600),
        y: nearPlayer ? py + Math.sin(angle) * dist : 300 + Math.random() * (WORLD_H - 600),
        vx: (Math.random() - 0.5) * BOT_SPEED,
        vy: (Math.random() - 0.5) * BOT_SPEED,
        rotation: 0,
      };
    });
    const player: ArenaEntity = {
      id: 'player', name: name || 'You', equipment, isPlayer: true,
      x: px, y: py, vx: 0, vy: 0, rotation: 0,
    };
    const all = [player, ...bots];
    setEntities(all);
    entitiesRef.current = all;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Game loop
  useEffect(() => {
    let botTimer = 0;
    const tick = () => {
      const ents = entitiesRef.current;
      if (ents.length === 0 || battleRef.current || showIntro) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      botTimer++;
      const updated = ents.map(e => ({ ...e }));
      const player = updated.find(e => e.isPlayer)!;

      // Player input
      const keys = keysRef.current;
      if (keys.has('ArrowUp') || keys.has('w')) player.vy -= 0.35;
      if (keys.has('ArrowDown') || keys.has('s')) player.vy += 0.35;
      if (keys.has('ArrowLeft') || keys.has('a')) player.vx -= 0.35;
      if (keys.has('ArrowRight') || keys.has('d')) player.vx += 0.35;

      // Space boost - big burst in current direction
      if (keys.has(' ')) {
        const pDir = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
        if (pDir > 0.3) {
          player.vx = (player.vx / pDir) * PLAYER_SPEED * 4;
          player.vy = (player.vy / pDir) * PLAYER_SPEED * 4;
        }
        keys.delete(' ');
      }

      // Speed cap
      const maxSpeed = PLAYER_SPEED * 3;
      const pSpeed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      if (pSpeed > maxSpeed) {
        player.vx = (player.vx / pSpeed) * maxSpeed;
        player.vy = (player.vy / pSpeed) * maxSpeed;
      }

      // Bot AI - smooth movement: pick a direction, hold it for a few seconds
      const intents = botIntentsRef.current;
      updated.filter(e => !e.isPlayer).forEach(bot => {
        const botDef = BOTS.find(b => b.name === bot.name);
        const isHard = botDef?.difficulty === 'hard';
        const isMedium = botDef?.difficulty === 'medium';
        let intent = intents[bot.id];

        // Pick new intent when current expires or doesn't exist
        if (!intent || intent.ticksLeft <= 0) {
          const dx = player.x - bot.x, dy = player.y - bot.y;
          const distToPlayer = Math.sqrt(dx * dx + dy * dy);

          let ax = 0, ay = 0;
          // Duration: 90-240 ticks (~1.5-4 seconds at 60fps)
          const duration = 90 + Math.floor(Math.random() * 150);

          // Chance to pause (stop moving for a bit)
          if (Math.random() < 0.15) {
            // Idle pause - no acceleration
            intents[bot.id] = { ax: 0, ay: 0, ticksLeft: 60 + Math.floor(Math.random() * 90) };
            return;
          }

          if (isHard && distToPlayer < 500 && Math.random() < 0.6) {
            // Hard: charge toward player
            const d = Math.max(distToPlayer, 1);
            ax = (dx / d) * 0.12;
            ay = (dy / d) * 0.12;
          } else if (isMedium && distToPlayer < 700 && Math.random() < 0.4) {
            // Medium: drift toward player gently
            const d = Math.max(distToPlayer, 1);
            ax = (dx / d) * 0.06;
            ay = (dy / d) * 0.06;
          } else {
            // Wander: pick a random angle and go that direction
            const angle = Math.random() * Math.PI * 2;
            const strength = 0.03 + Math.random() * 0.06;
            ax = Math.cos(angle) * strength;
            ay = Math.sin(angle) * strength;
          }

          intents[bot.id] = { ax, ay, ticksLeft: duration };
          intent = intents[bot.id];
        }

        // Apply the current intent's acceleration smoothly
        bot.vx += intent.ax;
        bot.vy += intent.ay;
        intent.ticksLeft--;

        // Soft speed cap for bots
        const bSpeed = Math.sqrt(bot.vx * bot.vx + bot.vy * bot.vy);
        const maxBotSpeed = BOT_SPEED * (isHard ? 1.8 : isMedium ? 1.4 : 1.1);
        if (bSpeed > maxBotSpeed) {
          bot.vx *= 0.97;
          bot.vy *= 0.97;
        }
      });

      // Move + friction
      updated.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;
        e.vx *= FRICTION;
        e.vy *= FRICTION;

        // Rolling rotation based on velocity
        const speed = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
        e.rotation += speed * 2 * (e.vx >= 0 ? 1 : -1);

        // Boundary bounce - strong elastic bounce
        if (e.x < BYTE_R + 20) { e.x = BYTE_R + 20; e.vx = Math.abs(e.vx) * 0.9 + 2; }
        if (e.x > WORLD_W - BYTE_R - 20) { e.x = WORLD_W - BYTE_R - 20; e.vx = -(Math.abs(e.vx) * 0.9 + 2); }
        if (e.y < BYTE_R + 20) { e.y = BYTE_R + 20; e.vy = Math.abs(e.vy) * 0.9 + 2; }
        if (e.y > WORLD_H - BYTE_R - 20) { e.y = WORLD_H - BYTE_R - 20; e.vy = -(Math.abs(e.vy) * 0.9 + 2); }
      });

      // Collisions
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const a = updated[i], b = updated[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = BYTE_R * 2;
          if (dist < minDist && dist > 0) {
            const nx = dx / dist, ny = dy / dist;
            const overlap = minDist - dist;
            a.x -= nx * overlap / 2;
            a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2;
            b.y += ny * overlap / 2;
            a.vx -= nx * BOUNCE_FORCE;
            a.vy -= ny * BOUNCE_FORCE;
            b.vx += nx * BOUNCE_FORCE;
            b.vy += ny * BOUNCE_FORCE;

            if ((a.isPlayer || b.isPlayer)) {
              const bot = a.isPlayer ? b : a;
              setBounceFlash(bot.id);
              setTimeout(() => setBounceFlash(null), 400);
              if (gameModeRef.current === 'quiz' && !battleRef.current && !collidedRef.current.has(bot.id)) {
                setCollidedWith(prev => new Set([...prev, bot.id]));
                collidedRef.current.add(bot.id);
                triggerBattle(bot);
              }
            }
          }
        }
      }

      entitiesRef.current = updated;
      setEntities([...updated]);

      if (player) {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 800;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 600;
        setCameraX(player.x - vw / 2);
        setCameraY(player.y - vh / 2);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [showIntro]);

  const triggerBattle = async (opponent: ArenaEntity) => {
    // Fetch from multiple random lessons for variety
    const ids = [86, 96, 103, 109, 126, 132, 147, 153, 95, 115, 119, 138];
    const picks = [ids[Math.floor(Math.random() * ids.length)], ids[Math.floor(Math.random() * ids.length)], ids[Math.floor(Math.random() * ids.length)]];
    let questions: DbQuizQuestion[] = [];
    for (const id of picks) {
      const q = await fetchQuizForLesson(id);
      questions.push(...q);
    }
    // Filter to mcq, true_false, fill_code (not write_code - too complex for battle)
    questions = questions.filter(q => ['mcq', 'true_false', 'fill_code'].includes(q.question_type));
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 5);
    if (shuffled.length > 0) {
      setBattle({ opponent, questions: shuffled });
      setBattleIdx(0);
      setBattleScore({ player: 0, bot: 0 });
      setBattleAnswer(null);
      setBattleState('idle');
      setBattleResult(null);
    } else {
      setTimeout(() => { setCollidedWith(prev => { const n = new Set(prev); n.delete(opponent.id); return n; }); collidedRef.current.delete(opponent.id); }, 5000);
    }
  };

  const handleBattleAnswer = (answer: string) => {
    if (battleState !== 'idle' || !battle) return;
    setBattleAnswer(answer);
    const q = battle.questions[battleIdx];
    const correctLabel = q.question_type === 'true_false' ? (q.correct_answer === 'True' ? 'T' : 'F') : q.correct_answer;
    const isCorrect = answer === correctLabel;
    const botDef = BOTS.find(b => b.name === battle.opponent.name);
    const botCorrect = Math.random() < (botDef?.accuracy || 0.35);

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
        const fp = isCorrect ? battleScore.player + 1 : battleScore.player;
        const fb = botCorrect && !isCorrect ? battleScore.bot + 1 : battleScore.bot;
        const won = fp >= fb;
        setBattleResult(won ? 'win' : 'lose');
        if (won) {
          const xpReward = botDef?.difficulty === 'hard' ? 50 : botDef?.difficulty === 'medium' ? 30 : 15;
          addXp(xpReward);
          useUserStore.setState(s => ({ gems: s.gems + (botDef?.difficulty === 'hard' ? 5 : botDef?.difficulty === 'medium' ? 3 : 1) }));
          setArenaWins(prev => ({ ...prev, [battle.opponent.name]: (prev[battle.opponent.name] || 0) + 1 }));
        }
      }
    }, 1200);
  };

  const closeBattle = () => {
    if (battle) {
      const oppId = battle.opponent.id;
      setTimeout(() => { setCollidedWith(prev => { const n = new Set(prev); n.delete(oppId); return n; }); collidedRef.current.delete(oppId); }, 8000);
    }
    setBattle(null);
  };

  // Mobile touch controls - virtual joystick
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartRef.current) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      keysRef.current.clear();
      if (dist > 6) {
        if (dx > 6) keysRef.current.add('ArrowRight');
        if (dx < -6) keysRef.current.add('ArrowLeft');
        if (dy > 6) keysRef.current.add('ArrowDown');
        if (dy < -6) keysRef.current.add('ArrowUp');
        if (dist > 80) keysRef.current.add(' ');
      }
    };
    const onEnd = (e: TouchEvent) => {
      e.preventDefault();
      touchStartRef.current = null;
      keysRef.current.clear();
    };
    // Use non-passive to allow preventDefault (stops browser scroll)
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onStart);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('touchend', onEnd);
    };
  }, []);

  const player = entities.find(e => e.isPlayer);

  // Intro wizard
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const introSteps = locale === 'sk'
    ? [isMobile ? 'Swipuj prstom po obrazovke' : 'Pohybuj sa šípkami', 'Narážaj do ďalších Bytov', 'Odpovedaj na kvíz otázky a zbieraj XP']
    : [isMobile ? 'Swipe to move your Byte' : 'Use arrow keys to move', 'Bump into other Bytes', 'Answer quiz questions and collect XP'];

  const introVisuals = [
    // Step 0: Controls - keyboard layout
    <div key="v0" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 20 }}>
      {isMobile ? (
        <motion.div animate={{ x: [0, 20, 0, -20, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <Byte mood="happy" size={64} equipment={equipment} animate={false} />
        </motion.div>
      ) : (
        <div style={{
          padding: '16px 20px', borderRadius: 14,
          background: 'rgba(255,255,255,0.03)', border: '1px solid #1a1a1a',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          {/* Arrow row: up */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 44, height: 36, borderRadius: 8, background: '#161616', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
          >
            <ArrowUp size={16} />
          </motion.div>
          {/* Arrow row: left, down, right */}
          <div style={{ display: 'flex', gap: 6 }}>
            <motion.div
              animate={{ x: [0, -2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
              style={{ width: 44, height: 36, borderRadius: 8, background: '#161616', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
            >
              <ArrowLeftIcon size={16} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}
              style={{ width: 44, height: 36, borderRadius: 8, background: '#161616', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
            >
              <ArrowDown size={16} />
            </motion.div>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}
              style={{ width: 44, height: 36, borderRadius: 8, background: '#161616', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}
            >
              <ArrowRightIcon size={16} />
            </motion.div>
          </div>
          {/* Space bar */}
          <motion.div
            animate={{ scale: [1, 0.97, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
            style={{
              width: 144, height: 32, borderRadius: 8,
              background: '#161616', border: '1px solid #2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.08em',
            }}
          >
            SPACE = BOOST
          </motion.div>
        </div>
      )}
    </div>,
    // Step 1: Two Bytes bumping with animation
    <div key="v1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20 }}>
      <motion.div animate={{ x: [0, 12, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <Byte mood="happy" size={56} equipment={equipment} animate={false} />
      </motion.div>
      <motion.div animate={{ scale: [0, 1.2, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        style={{ width: 12, height: 12, borderRadius: 6, background: '#4ade80', margin: '0 -2px', zIndex: 2 }} />
      <motion.div animate={{ x: [0, -12, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <Byte mood="happy" size={56} equipment={BOTS[3].equipment} animate={false} />
      </motion.div>
    </div>,
    // Step 2: Quiz check with pulse
    <div key="v2" style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
      <motion.div
        animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(74,222,128,0)', '0 0 20px rgba(74,222,128,0.3)', '0 0 0 rgba(74,222,128,0)'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Check size={28} color="#4ade80" strokeWidth={3} />
      </motion.div>
    </div>,
    // Step 3: Mode selection (handled inline)
    null,
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#030303', overflow: 'hidden', touchAction: 'none', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      {/* INTRO WIZARD */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.95)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              key={introStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ textAlign: 'center', maxWidth: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Byte mood="happy" size={100} equipment={equipment} />
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', marginTop: 4, letterSpacing: '0.04em' }}>{name || 'You'}</div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: '20px 0 4px', letterSpacing: '-0.03em' }}>
                {introStep === 0 ? 'Arena' : ''}
              </h2>
              {introVisuals[introStep]}
              <p style={{ fontSize: 16, color: '#ccc', lineHeight: 1.6, marginBottom: 28 }}>
                {introSteps[introStep]}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' }}>
                <button
                  onClick={() => {
                    if (introStep < introSteps.length - 1) setIntroStep(introStep + 1);
                    else setShowIntro(false);
                  }}
                  style={{
                    padding: '14px 40px', borderRadius: 12, background: '#EDEDED', color: '#000',
                    fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                  }}
                >
                  {introStep < introSteps.length - 1
                    ? (locale === 'sk' ? 'Ďalej' : 'Next')
                    : (locale === 'sk' ? 'Hrať!' : 'Play!')}
                </button>
                <button
                  onClick={() => setShowIntro(false)}
                  style={{ background: 'none', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}
                >
                  {locale === 'sk' ? 'Preskočiť' : 'Skip'}
                </button>
              </div>
              {/* Pagination dots at bottom */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28 }}>
                {introSteps.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: i === introStep ? 1 : 0.8, opacity: i === introStep ? 1 : 0.4 }}
                    transition={{ duration: 0.25 }}
                    style={{ width: 10, height: 10, borderRadius: 5, background: i === introStep ? '#4ade80' : '#333', cursor: 'pointer' }}
                    onClick={() => setIntroStep(i)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GAME WORLD */}
      <div ref={canvasRef} style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute',
          transform: `translate(${-cameraX}px, ${-cameraY}px)`,
          width: WORLD_W, height: WORLD_H,
        }}>
          {/* Grid */}
          <svg width={WORLD_W} height={WORLD_H} style={{ position: 'absolute' }}>
            {Array.from({ length: Math.floor(WORLD_W / 120) + 1 }, (_, i) => (
              <line key={`v${i}`} x1={i * 120} y1={0} x2={i * 120} y2={WORLD_H} stroke="rgba(255,255,255,0.025)" strokeWidth={1} />
            ))}
            {Array.from({ length: Math.floor(WORLD_H / 120) + 1 }, (_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 120} x2={WORLD_W} y2={i * 120} stroke="rgba(255,255,255,0.025)" strokeWidth={1} />
            ))}
            <rect x={18} y={18} width={WORLD_W - 36} height={WORLD_H - 36} fill="none" stroke="rgba(74,222,128,0.12)" strokeWidth={2} rx={12} />
          </svg>

          {/* Entities */}
          {entities.map(e => {
            const speed = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
            const isFlashing = bounceFlash === e.id;
            return (
              <div
                key={e.id}
                style={{
                  position: 'absolute',
                  left: e.x - 44, top: e.y - 44,
                  transform: `rotate(${e.rotation}deg)`,
                  filter: isFlashing ? 'brightness(2) drop-shadow(0 0 20px rgba(255,255,255,0.8))' : e.isPlayer ? 'drop-shadow(0 0 12px rgba(74,222,128,0.25))' : 'none',
                  transition: 'filter 0.15s',
                }}
              >
                <Byte mood="happy" size={88} equipment={e.equipment} animate={true} />
              </div>
            );
          })}

          {/* Entity labels (separate layer so they don't rotate) */}
          {entities.map(e => {
            const botDef = BOTS.find(b => b.name === e.name);
            const diffColor = botDef?.difficulty === 'hard' ? '#f59e0b' : botDef?.difficulty === 'medium' ? '#60a5fa' : '#555';
            return (
              <div
                key={`label-${e.id}`}
                style={{
                  position: 'absolute',
                  left: e.x, top: e.y + 42,
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: e.isPlayer ? '#4ade80' : '#ccc', letterSpacing: '0.03em' }}>
                  {e.name}
                </div>
                {!e.isPlayer && botDef && (
                  <div style={{ fontSize: 8, fontWeight: 600, color: diffColor, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {botDef.difficulty}
                  </div>
                )}
              </div>
            );
          })}

          {/* Idle pulse for player */}
          {player && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.05, 0.15] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: player.x - 54, top: player.y - 54,
                width: 108, height: 108, borderRadius: '50%',
                border: '2px solid rgba(74,222,128,0.2)',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </div>

      {/* MINIMAP */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        width: MINIMAP_SIZE, height: MINIMAP_SIZE,
        background: 'rgba(0,0,0,0.7)', border: '1px solid #1a1a1a',
        borderRadius: 10, overflow: 'hidden',
        backdropFilter: 'blur(8px)',
      }}>
        <svg width={MINIMAP_SIZE} height={MINIMAP_SIZE}>
          <rect x={2} y={2} width={MINIMAP_SIZE - 4} height={MINIMAP_SIZE - 4} fill="none" stroke="rgba(74,222,128,0.1)" strokeWidth={1} rx={4} />
          {entities.map(e => (
            <circle
              key={e.id}
              cx={(e.x / WORLD_W) * MINIMAP_SIZE}
              cy={(e.y / WORLD_H) * MINIMAP_SIZE}
              r={e.isPlayer ? 4 : 2.5}
              fill={e.isPlayer ? '#4ade80' : 'rgba(255,255,255,0.4)'}
            />
          ))}
        </svg>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => { window.scrollTo(0, 0); window.history.back(); }}
        style={{
          position: 'absolute', top: 16, left: 16,
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(0,0,0,0.7)', border: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#888', backdropFilter: 'blur(8px)',
        }}
      >
        <ArrowLeft size={16} />
      </button>

      {/* LEADERBOARD TOGGLE */}
      <button
        onClick={() => setShowLeaderboard(!showLeaderboard)}
        style={{
          position: 'absolute', top: 16, left: 60,
          height: 36, borderRadius: 10, padding: '0 12px',
          background: 'rgba(0,0,0,0.7)', border: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          cursor: 'pointer', color: '#888', backdropFilter: 'blur(8px)',
          fontSize: 10, fontWeight: 700,
        }}
      >
        <Trophy size={12} />
      </button>

      {/* LEADERBOARD PANEL */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              position: 'absolute', top: 104, left: 16,
              width: 200, borderRadius: 14,
              background: 'rgba(0,0,0,0.85)', border: '1px solid #1a1a1a',
              backdropFilter: 'blur(12px)', padding: '14px 16px',
              zIndex: 50,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              {locale === 'sk' ? 'Rebricek' : 'Leaderboard'}
            </div>
            {[{ name: name || 'You', isPlayer: true, difficulty: undefined as string | undefined, wins: Object.values(arenaWins).reduce((a, b) => a + b, 0) },
              ...BOTS.map(b => ({ name: b.name, isPlayer: false, difficulty: b.difficulty, wins: arenaWins[b.name] || 0 }))
            ].sort((a, b) => b.wins - a.wins).map((entry, i) => (
              <div key={entry.name} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
                borderTop: i > 0 ? '1px solid #111' : 'none',
              }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: i === 0 ? '#4ade80' : '#555', width: 16 }}>#{i + 1}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: entry.isPlayer ? '#4ade80' : '#ccc', flex: 1 }}>{entry.name}</span>
                {entry.difficulty && (
                  <span style={{ fontSize: 8, fontWeight: 700, color: entry.difficulty === 'hard' ? '#f59e0b' : entry.difficulty === 'medium' ? '#60a5fa' : '#555' }}>
                    {entry.difficulty.toUpperCase()}
                  </span>
                )}
                <span style={{ fontSize: 10, fontWeight: 700, color: '#888' }}>{entry.wins}W</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>


      {/* BOTTOM INFO */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        padding: '8px 16px', borderRadius: 12,
        background: 'rgba(0,0,0,0.7)', border: '1px solid #1a1a1a',
        backdropFilter: 'blur(8px)',
        fontSize: 11, fontWeight: 600, color: '#888',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: '#4ade80' }} />
        {name || 'You'}
        <div style={{ width: 1, height: 14, background: '#222' }} />
        <button
          onClick={() => { setGameMode(gameMode === 'quiz' ? 'free' : 'quiz'); setCollidedWith(new Set()); collidedRef.current = new Set(); }}
          style={{
            background: gameMode === 'quiz' ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${gameMode === 'quiz' ? 'rgba(74,222,128,0.3)' : '#222'}`,
            borderRadius: 8, padding: '3px 10px', cursor: 'pointer',
            fontSize: 10, fontWeight: 700, color: gameMode === 'quiz' ? '#4ade80' : '#555',
          }}
        >
          {gameMode === 'quiz' ? 'Quiz' : 'Free'}
        </button>
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
              background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                maxWidth: 420, width: '100%',
                background: '#111', border: '1px solid #222',
                borderRadius: 20, padding: '24px 20px',
                position: 'relative', maxHeight: '90vh', overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
              }}
            >
              {/* X close button */}
              <button onClick={closeBattle} style={{
                position: 'absolute', top: -44, right: 0,
                width: 32, height: 32, borderRadius: 8,
                background: '#1a1a1a', border: '1px solid #2a2a2a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#888', zIndex: 10,
              }}>
                <X size={14} />
              </button>

              {battleResult ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', paddingTop: 40 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                      <Byte mood={battleResult === 'win' ? 'celebrating' : 'worried'} size={110} equipment={equipment} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', marginTop: 6 }}>{name || 'You'}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#333', alignSelf: 'center' }}>VS</div>
                    <div style={{ textAlign: 'center' }}>
                      <Byte mood="happy" size={110} equipment={battle.opponent.equipment} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#888', marginTop: 6 }}>{battle.opponent.name}</div>
                    </div>
                  </div>
                  <h2 style={{ fontSize: 28, fontWeight: 800, color: battleResult === 'win' ? '#4ade80' : '#ff8080', marginBottom: 8 }}>
                    {battleResult === 'win' ? (locale === 'sk' ? 'Výhra!' : 'You win!') : `${battle.opponent.name} ${locale === 'sk' ? 'vyhral!' : 'wins!'}`}
                  </h2>
                  <p style={{ fontSize: 16, color: '#888', marginBottom: 4, fontWeight: 700 }}>{battleScore.player} - {battleScore.bot}</p>
                  {battleResult === 'win' && (() => {
                    const bd = BOTS.find(b => b.name === battle.opponent.name);
                    const xpR = bd?.difficulty === 'hard' ? 50 : bd?.difficulty === 'medium' ? 30 : 15;
                    const gemR = bd?.difficulty === 'hard' ? 5 : bd?.difficulty === 'medium' ? 3 : 1;
                    return <p style={{ fontSize: 14, color: '#4ade80', fontWeight: 600, marginBottom: 24 }}>+{xpR} XP  +{gemR} Gems</p>;
                  })()}
                  <button onClick={closeBattle} style={{ padding: '16px 40px', borderRadius: 14, background: '#EDEDED', color: '#000', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', width: '100%', maxWidth: 300 }}>
                    {locale === 'sk' ? 'Pokračovať' : 'Continue'}
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* VS header with bigger Bytes */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Byte mood="happy" size={64} equipment={equipment} animate={false} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{name || 'You'}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{battleScore.player}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#555', fontWeight: 700 }}>{battleIdx + 1}/{battle.questions.length}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#888' }}>{battle.opponent.name}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{battleScore.bot}</div>
                      </div>
                      <Byte mood="happy" size={64} equipment={battle.opponent.equipment} animate={false} />
                    </div>
                  </div>

                  <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 14, padding: '16px 18px', marginBottom: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#eee', lineHeight: 1.4, margin: 0 }}>
                      {(locale === 'sk' && (battle.questions[battleIdx] as any)?.question_text_sk) || battle.questions[battleIdx]?.question_text || ''}
                    </h3>
                    {battle.questions[battleIdx]?.code_snippet && (
                      <pre style={{ background: '#0a0a0a', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#ccc', marginTop: 10, overflow: 'auto', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6 }}>
                        {battle.questions[battleIdx].code_snippet}
                      </pre>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(() => {
                      const q = battle.questions[battleIdx];
                      if (!q) return null;
                      const correctLabel = q.question_type === 'true_false' ? (q.correct_answer === 'True' ? 'T' : 'F') : q.correct_answer;
                      const opts = q.question_type === 'true_false'
                        ? [{ label: 'T', text: 'True' }, { label: 'F', text: 'False' }]
                        : (q.options || []).sort((a, b) => a.option_label.localeCompare(b.option_label)).map(o => ({ label: o.option_label, text: (locale === 'sk' && (o as any).option_text_sk) || o.option_text }));
                      return opts.map(opt => {
                        const sel = battleAnswer === opt.label;
                        const isCorrect = battleState !== 'idle' && opt.label === correctLabel;
                        const isWrong = battleState === 'wrong' && sel;
                        return (
                          <button key={opt.label} onClick={() => handleBattleAnswer(opt.label)} disabled={battleState !== 'idle'}
                            style={{
                              padding: '14px 16px', borderRadius: 12, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                              fontSize: 15, fontWeight: 500, cursor: battleState !== 'idle' ? 'default' : 'pointer',
                              background: isCorrect ? 'rgba(74,222,128,0.08)' : isWrong ? 'rgba(255,80,80,0.06)' : '#0a0a0a',
                              border: `1.5px solid ${isCorrect ? 'rgba(74,222,128,0.4)' : isWrong ? 'rgba(255,80,80,0.3)' : '#1a1a1a'}`,
                              color: isCorrect ? '#4ade80' : isWrong ? '#ff8080' : '#ccc',
                            }}
                          >
                            <div style={{
                              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              background: isCorrect ? '#4ade80' : isWrong ? '#ff8080' : '#161616',
                              color: isCorrect || isWrong ? '#000' : '#888', fontSize: 12, fontWeight: 700,
                            }}>
                              {isCorrect ? <Check size={12} strokeWidth={3} /> : opt.label}
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
