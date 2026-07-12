'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { fetchModulesWithLessons, ModuleWithLessons, DbLessonSummary } from '@/lib/curriculum-api';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronRight, Check, ArrowRight, Library, Coffee } from 'lucide-react';
import { useLocaleStore, t } from '@/store/localeStore';
import { s } from '@/data/strings';

// Drink rewards per module — varies by user's favorite drink
type DrinkType = 'coffee' | 'tea' | 'energy' | 'juice' | 'water';
const DRINK_REWARDS: Record<DrinkType, { icon: string; items: { name: string; nameSk: string }[] }> = {
  coffee: { icon: '☕', items: [
    { name: 'Espresso', nameSk: 'Espresso' }, { name: 'Cappuccino', nameSk: 'Cappuccino' },
    { name: 'Flat White', nameSk: 'Flat White' }, { name: 'Americano', nameSk: 'Americano' },
    { name: 'Ristretto', nameSk: 'Ristretto' }, { name: 'Cortado', nameSk: 'Cortado' },
    { name: 'Macchiato', nameSk: 'Macchiato' }, { name: 'Doppio', nameSk: 'Doppio' },
    { name: 'Mocha', nameSk: 'Mocha' }, { name: 'Latte', nameSk: 'Latte' },
    { name: 'Iced Coffee', nameSk: 'Iced Coffee' }, { name: 'Irish Coffee', nameSk: 'Irish Coffee' },
    { name: 'Affogato', nameSk: 'Affogato' }, { name: 'Cold Brew', nameSk: 'Cold Brew' },
    { name: 'Turkish Coffee', nameSk: 'Turecká káva' }, { name: 'Frappuccino', nameSk: 'Frappuccino' },
    { name: 'Lungo', nameSk: 'Lungo' }, { name: 'Vienna Coffee', nameSk: 'Viedenská káva' },
  ]},
  tea: { icon: '🍵', items: [
    { name: 'Green Tea', nameSk: 'Zelený čaj' }, { name: 'Matcha', nameSk: 'Matcha' },
    { name: 'Chai Latte', nameSk: 'Chai Latte' }, { name: 'Earl Grey', nameSk: 'Earl Grey' },
    { name: 'Oolong', nameSk: 'Oolong' }, { name: 'Jasmine Tea', nameSk: 'Jasmínový čaj' },
    { name: 'Rooibos', nameSk: 'Rooibos' }, { name: 'Chamomile', nameSk: 'Harmanček' },
    { name: 'Peppermint', nameSk: 'Mäta' }, { name: 'White Tea', nameSk: 'Biely čaj' },
    { name: 'Darjeeling', nameSk: 'Darjeeling' }, { name: 'Sencha', nameSk: 'Sencha' },
    { name: 'Ginger Tea', nameSk: 'Zázvorový čaj' }, { name: 'Hibiscus', nameSk: 'Ibištek' },
    { name: 'Pu-erh', nameSk: 'Pu-erh' }, { name: 'Lemon Balm', nameSk: 'Medovka' },
    { name: 'Turmeric Tea', nameSk: 'Kurkumový čaj' }, { name: 'Bubble Tea', nameSk: 'Bubble Tea' },
  ]},
  energy: { icon: '⚡', items: [
    { name: 'Classic Boost', nameSk: 'Klasický boost' }, { name: 'Tropical Storm', nameSk: 'Tropická búrka' },
    { name: 'Berry Blast', nameSk: 'Berry výbuch' }, { name: 'Citrus Rush', nameSk: 'Citrusový nával' },
    { name: 'Midnight Fuel', nameSk: 'Polnočné palivo' }, { name: 'Green Thunder', nameSk: 'Zelený hrom' },
    { name: 'Arctic Chill', nameSk: 'Arktický chill' }, { name: 'Mango Surge', nameSk: 'Mangový prúd' },
    { name: 'Cherry Volt', nameSk: 'Čerešňový volt' }, { name: 'Cosmic Wave', nameSk: 'Kozmická vlna' },
    { name: 'Dragon Pulse', nameSk: 'Dračí pulz' }, { name: 'Neon Splash', nameSk: 'Neónový splash' },
    { name: 'Power Grid', nameSk: 'Power Grid' }, { name: 'Solar Flare', nameSk: 'Solárna erupcia' },
    { name: 'Turbo Mode', nameSk: 'Turbo mód' }, { name: 'Ultra Spark', nameSk: 'Ultra iskra' },
    { name: 'Voltage Peak', nameSk: 'Voltage Peak' }, { name: 'Zero Gravity', nameSk: 'Nulová gravitácia' },
  ]},
  juice: { icon: '🧃', items: [
    { name: 'Orange Juice', nameSk: 'Pomarančový džús' }, { name: 'Apple Juice', nameSk: 'Jablkový džús' },
    { name: 'Mango Smoothie', nameSk: 'Mangové smoothie' }, { name: 'Berry Mix', nameSk: 'Berry mix' },
    { name: 'Pineapple Juice', nameSk: 'Ananásový džús' }, { name: 'Watermelon Fresh', nameSk: 'Melónový fresh' },
    { name: 'Carrot Ginger', nameSk: 'Mrkva so zázvorom' }, { name: 'Green Smoothie', nameSk: 'Zelené smoothie' },
    { name: 'Peach Nectar', nameSk: 'Broskyňový nektár' }, { name: 'Grape Juice', nameSk: 'Hroznový džús' },
    { name: 'Lemonade', nameSk: 'Limonáda' }, { name: 'Passion Fruit', nameSk: 'Maracuja' },
    { name: 'Pomegranate', nameSk: 'Granátové jablko' }, { name: 'Coconut Water', nameSk: 'Kokosová voda' },
    { name: 'Acai Bowl', nameSk: 'Acai bowl' }, { name: 'Kiwi Blast', nameSk: 'Kiwi blast' },
    { name: 'Strawberry Shake', nameSk: 'Jahodový shake' }, { name: 'Tropical Mix', nameSk: 'Tropický mix' },
  ]},
  water: { icon: '💧', items: [
    { name: 'Sparkling Water', nameSk: 'Perlivá voda' }, { name: 'Mineral Water', nameSk: 'Minerálka' },
    { name: 'Lemon Water', nameSk: 'Citrónová voda' }, { name: 'Cucumber Water', nameSk: 'Uhorkový fresh' },
    { name: 'Spring Water', nameSk: 'Pramenitá voda' }, { name: 'Rose Water', nameSk: 'Ružová voda' },
    { name: 'Coconut Water', nameSk: 'Kokosová voda' }, { name: 'Mint Infusion', nameSk: 'Mätový nálev' },
    { name: 'Ginger Water', nameSk: 'Zázvorová voda' }, { name: 'Berry Infusion', nameSk: 'Ovocný nálev' },
    { name: 'Alkaline Water', nameSk: 'Alkalická voda' }, { name: 'Glacier Melt', nameSk: 'Ľadovcová voda' },
    { name: 'Herbal Infusion', nameSk: 'Bylinkový nálev' }, { name: 'Detox Water', nameSk: 'Detox voda' },
    { name: 'Aloe Vera', nameSk: 'Aloe vera' }, { name: 'Birch Water', nameSk: 'Brezová voda' },
    { name: 'Electrolyte', nameSk: 'Elektrolyt' }, { name: 'Ice Crystal', nameSk: 'Ľadový kryštál' },
  ]},
};

function getModuleDrink(moduleNumber: number, favDrink: DrinkType | null) {
  const drink = favDrink || 'coffee';
  const rewards = DRINK_REWARDS[drink];
  const idx = (moduleNumber - 1) % rewards.items.length;
  return { icon: rewards.icon, ...rewards.items[idx] };
}

export default function TheoryHub() {
  const { completedLessons, favDrink } = useUserStore();
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [dbModules, setDbModules] = useState<ModuleWithLessons[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchModulesWithLessons().then(mods => {
      // Theory Hub shows only theory modules (1-18), not Python coding modules
      setDbModules(mods.filter(m => m.module_number <= 18));
    });
  }, []);

  if (dbModules.length === 0) return null;

  // Find next unread lessons across all modules
  const allTheoryLessons = dbModules.flatMap(m =>
    m.lessons.map(l => ({ ...l, moduleTitle: m.title, moduleTitle_sk: m.title_sk, moduleId: m.id }))
  );
  const unread = allTheoryLessons.filter(l => !completedLessons.includes(`theory-${l.id}`));
  const readCount = allTheoryLessons.length - unread.length;


  return (
    <div style={{ marginBottom: 40 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#161616', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={16} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: 18, color: '#fff', letterSpacing: '-0.02em' }}>
            {s('theoryHub', locale)}
          </h2>
          <p style={{ fontSize: 12, color: '#888', marginTop: 1 }}>
            {readCount} / {allTheoryLessons.length} {s('readsCompleted', locale)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, borderRadius: 2, background: '#1a1a1a', marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: `${(readCount / allTheoryLessons.length) * 100}%`, transition: 'width 0.4s' }} />
      </div>

      {/* First 4 modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dbModules.slice(0, 4).map(mod => {
          const modDone = mod.lessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
          const modTitle = locale === 'sk' && mod.title_sk ? mod.title_sk : mod.title;
          return (
            <ModuleRow key={mod.id} mod={mod} completedLessons={completedLessons} router={router} locale={locale} favDrink={favDrink} />
          );
        })}
      </div>

      {/* Show all divider + button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '20px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#222' }} />
        <button
          onClick={() => setShowAll(!showAll)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, background: 'none', border: '1px solid #222', color: '#888', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          <Library size={13} />
          {showAll ? (locale === 'sk' ? 'Skryť' : 'Show less') : (locale === 'sk' ? 'Zobraziť všetky' : 'Show all')}
        </button>
        <div style={{ flex: 1, height: 1, background: '#222' }} />
      </div>

      {/* Remaining modules */}
      {showAll && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dbModules.slice(4).map((mod) => (
            <ModuleRow key={mod.id} mod={mod} completedLessons={completedLessons} router={router} locale={locale} favDrink={favDrink} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReadCard({ lesson, index, router, locale }: { lesson: DbLessonSummary & { moduleTitle: string; moduleTitle_sk?: string }; index: number; router: any; locale: 'en' | 'sk' }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => router.push(`/theory/${lesson.id}`)}
      whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
      whileTap={{ scale: 0.99 }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 18px', borderRadius: 14,
        background: index === 0 ? '#111' : '#0a0a0a',
        border: `1px solid ${index === 0 ? '#222' : '#1a1a1a'}`,
        cursor: 'pointer', textAlign: 'left',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: index === 0 ? '#fff' : '#161616',
        border: index === 0 ? 'none' : '1px solid #222',
      }}>
        {index === 0
          ? <ArrowRight size={18} color="#000" />
          : <BookOpen size={16} color="#777" />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: index === 0 ? '#fff' : '#ccc', marginBottom: 3 }}>
          {t(lesson, 'title', locale)}
        </div>
        <div style={{ fontSize: 12, color: '#777' }}>
          {lesson.moduleTitle_sk && locale === 'sk' ? lesson.moduleTitle_sk : lesson.moduleTitle} · {s('lesson', locale)} {lesson.lesson_number}
        </div>
      </div>
      <ChevronRight size={16} color="#555" />
    </motion.button>
  );
}

function ModuleRow({ mod, completedLessons, router, locale, favDrink }: { mod: ModuleWithLessons; completedLessons: string[]; router: any; locale: 'en' | 'sk'; favDrink: DrinkType | null }) {
  const [open, setOpen] = useState(false);
  const doneCount = mod.lessons.filter(l => completedLessons.includes(`theory-${l.id}`)).length;
  const allDone = doneCount === mod.lessons.length;
  const drinkReward = getModuleDrink(mod.module_number, favDrink);

  return (
    <div style={{ background: '#0a0a0a', border: `1px solid ${allDone ? 'rgba(245,158,11,0.2)' : '#1a1a1a'}`, borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: allDone ? 'rgba(245,158,11,0.1)' : '#111',
          border: allDone ? '1px solid rgba(245,158,11,0.3)' : '1px solid #222',
          fontSize: allDone ? 18 : 14,
        }}>
          {allDone
            ? <span>{drinkReward.icon}</span>
            : <BookOpen size={14} color="#777" />
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: allDone ? '#f59e0b' : '#ddd' }}>{t(mod, 'title', locale)}</div>
          <div style={{ fontSize: 11, color: allDone ? '#b45309' : '#777', marginTop: 2 }}>
            {allDone
              ? `${locale === 'sk' ? drinkReward.nameSk : drinkReward.name} ${drinkReward.icon}`
              : `${doneCount}/${mod.lessons.length} ${s('lessons', locale)}`
            }
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={16} color="#555" />
        </motion.div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid #111' }}>
          {mod.lessons.map((lesson) => {
            const done = completedLessons.includes(`theory-${lesson.id}`);
            return (
              <button
                key={lesson.id}
                onClick={() => router.push(`/theory/${lesson.id}`)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 16px 10px 28px', cursor: 'pointer', textAlign: 'left',
                  borderTop: '1px solid #0f0f0f',
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#4ade80' : 'transparent',
                  border: done ? 'none' : '1px solid #2a2a2a',
                }}>
                  {done && <Check size={12} color="#000" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 13, color: done ? '#aaa' : '#ccc', fontWeight: 500 }}>
                  {t(lesson, 'title', locale)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
