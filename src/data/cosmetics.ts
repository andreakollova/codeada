import { CosmeticItem, ItemRarity } from '@/types';

export const cosmeticItems: CosmeticItem[] = [
  // ============ HATS ============
  // Common
  { id: 'hat-beanie',      name: 'Beanie',           description: 'Classic knit beanie',              type: 'hat', rarity: 'common' },
  { id: 'hat-party',       name: 'Party Hat',        description: 'Every day is a celebration',       type: 'hat', rarity: 'common' },
  { id: 'hat-headband',    name: 'Headband',         description: 'Ready to grind',                   type: 'hat', rarity: 'common' },
  // Rare
  { id: 'hat-graduation',  name: 'Grad Cap',         description: 'You earned it',                    type: 'hat', rarity: 'rare' },
  { id: 'hat-cowboy',      name: 'Cowboy Hat',       description: 'Debug cowboy',                     type: 'hat', rarity: 'rare' },
  { id: 'hat-pilot',       name: 'Pilot Helmet',     description: 'Ready for takeoff',                type: 'hat', rarity: 'rare' },
  // Epic
  { id: 'hat-fire-crown',  name: 'Fire Crown',       description: 'Forged in flames',                 type: 'hat', rarity: 'epic',      element: 'fire' },
  { id: 'hat-ice-crown',   name: 'Ice Crown',        description: 'Cold precision',                   type: 'hat', rarity: 'epic',      element: 'water' },
  { id: 'hat-samurai',     name: 'Samurai Helmet',   description: 'Code with discipline',             type: 'hat', rarity: 'epic' },
  // Legendary
  { id: 'hat-golden-crown',name: 'Golden Crown',     description: 'Born to rule the codebase',        type: 'hat', rarity: 'legendary', element: 'golden' },
  { id: 'hat-galaxy',      name: 'Galaxy Helmet',    description: 'Contains an entire universe',      type: 'hat', rarity: 'legendary', element: 'galaxy' },
  // Mythic
  { id: 'hat-void-crown',  name: 'Void Crown',       description: 'From beyond the event horizon',   type: 'hat', rarity: 'mythic',    element: 'void' },

  // ============ GLASSES ============
  // Common
  { id: 'glasses-round',   name: 'Round Glasses',    description: 'Wisdom in every pixel',            type: 'glasses', rarity: 'common' },
  { id: 'glasses-reading', name: 'Reading Glasses',  description: 'For long debug sessions',          type: 'glasses', rarity: 'common' },
  // Rare
  { id: 'glasses-cool',    name: 'Sunglasses',       description: 'Code is cool, you are too',        type: 'glasses', rarity: 'rare' },
  { id: 'glasses-aviator', name: 'Aviators',         description: 'Top Gun energy',                   type: 'glasses', rarity: 'rare' },
  // Epic
  { id: 'glasses-flame',   name: 'Flame Visor',      description: 'Eyes of fire',                     type: 'glasses', rarity: 'epic',   element: 'fire' },
  { id: 'glasses-frost',   name: 'Frost Goggles',    description: 'Absolute zero focus',              type: 'glasses', rarity: 'epic',   element: 'water' },
  // Legendary
  { id: 'glasses-golden',  name: 'Golden Monocle',   description: 'Sees only excellence',             type: 'glasses', rarity: 'legendary', element: 'golden' },
  { id: 'glasses-laser',   name: 'Laser Eyes',       description: 'Debugging with precision',         type: 'glasses', rarity: 'legendary', element: 'fire' },
  // Mythic
  { id: 'glasses-void',    name: 'Void Eyes',        description: 'Stares into the abyss... and codes', type: 'glasses', rarity: 'mythic', element: 'void' },

  // ============ ACCESSORIES ============
  // Common
  { id: 'acc-bowtie',      name: 'Bow Tie',          description: 'Elegant code, elegant you',        type: 'accessory', rarity: 'common' },
  { id: 'acc-scarf',       name: 'Scarf',            description: 'Byte stays warm',                  type: 'accessory', rarity: 'common' },
  // Rare
  { id: 'acc-medal',       name: 'Medal',            description: 'A well-earned reward',             type: 'accessory', rarity: 'rare' },
  { id: 'acc-chain',       name: 'Chain',            description: 'Blockchain? No, just a chain',     type: 'accessory', rarity: 'rare' },
  // Epic
  { id: 'acc-fire-cape',   name: 'Fire Cape',        description: 'Wreathed in flames',               type: 'accessory', rarity: 'epic',  element: 'fire' },
  { id: 'acc-crystal',     name: 'Crystal Pendant',  description: 'Pure energy crystallized',         type: 'accessory', rarity: 'epic',  element: 'earth' },
  // Legendary
  { id: 'acc-wings-gold',  name: 'Golden Wings',     description: 'Ascend beyond limits',             type: 'accessory', rarity: 'legendary', element: 'golden' },
  { id: 'acc-diamond',     name: 'Diamond Chain',    description: 'Unbreakable, like your code',      type: 'accessory', rarity: 'legendary' },
  // Mythic
  { id: 'acc-cosmic-cape', name: 'Cosmic Cape',      description: 'Woven from stardust',              type: 'accessory', rarity: 'mythic', element: 'galaxy' },

  // ============ ANTENNA ============
  // Common
  { id: 'ant-heart',       name: 'Heart',            description: 'Coding from the heart',            type: 'antenna', rarity: 'common' },
  { id: 'ant-star',        name: 'Star',             description: 'Shine among the rest',             type: 'antenna', rarity: 'common' },
  // Rare
  { id: 'ant-lightning',   name: 'Lightning',        description: 'Fast as your code',                type: 'antenna', rarity: 'rare' },
  { id: 'ant-diamond',     name: 'Diamond',          description: 'Pressure makes diamonds',          type: 'antenna', rarity: 'rare' },
  // Epic
  { id: 'ant-flame-orb',   name: 'Flame Orb',        description: 'A burning signal',                type: 'antenna', rarity: 'epic',   element: 'fire' },
  { id: 'ant-frost-crystal',name:'Frost Crystal',    description: 'Ice cold transmission',            type: 'antenna', rarity: 'epic',   element: 'water' },
  // Legendary
  { id: 'ant-golden-star', name: 'Golden Star',      description: 'The north star of coders',         type: 'antenna', rarity: 'legendary', element: 'golden' },
  { id: 'ant-sun',         name: 'Sun',              description: 'A star of your own',               type: 'antenna', rarity: 'legendary', element: 'fire' },
  // Mythic
  { id: 'ant-blackhole',   name: 'Black Hole',       description: 'Infinite gravity, infinite focus', type: 'antenna', rarity: 'mythic', element: 'void' },

  // ============ AURAS (new!) ============
  // Common
  { id: 'aura-soft',       name: 'Soft Glow',        description: 'A gentle white shimmer',           type: 'aura', rarity: 'common' },
  // Rare
  { id: 'aura-blue',       name: 'Blue Shimmer',     description: 'Cool blue energy',                 type: 'aura', rarity: 'rare',     element: 'water' },
  { id: 'aura-green',      name: 'Green Pulse',      description: 'Nature flows through you',         type: 'aura', rarity: 'rare',     element: 'earth' },
  // Epic
  { id: 'aura-fire',       name: 'Fire Ring',        description: 'Surrounded by flames',             type: 'aura', rarity: 'epic',     element: 'fire' },
  { id: 'aura-water',      name: 'Water Ring',       description: 'Flowing like water',               type: 'aura', rarity: 'epic',     element: 'water' },
  { id: 'aura-earth',      name: 'Earth Ring',       description: 'Grounded and powerful',            type: 'aura', rarity: 'epic',     element: 'earth' },
  { id: 'aura-air',        name: 'Air Ring',         description: 'Light as the wind',                type: 'aura', rarity: 'epic',     element: 'air' },
  // Legendary
  { id: 'aura-golden',     name: 'Golden Radiance',  description: 'Radiant golden energy',            type: 'aura', rarity: 'legendary', element: 'golden' },
  { id: 'aura-galaxy',     name: 'Galaxy Swirl',     description: 'Stars orbit around you',           type: 'aura', rarity: 'legendary', element: 'galaxy' },
  // Mythic
  { id: 'aura-void',       name: 'Void Aura',        description: 'Reality bends around you',         type: 'aura', rarity: 'mythic',   element: 'void' },
  { id: 'aura-cosmic',     name: 'Cosmic Storm',     description: 'The universe in motion',           type: 'aura', rarity: 'mythic',   element: 'galaxy' },
  // Pro exclusive
  { id: 'aura-pro',        name: 'Pro Glow',         description: 'Exclusive aura for Coduy Pro members', type: 'aura', rarity: 'mythic', element: 'golden' },
];

export function getItemById(id: string): CosmeticItem | undefined {
  return cosmeticItems.find(i => i.id === id);
}

// Rarity config
export const rarityConfig: Record<ItemRarity, { label: string; color: string; glow: string; border: string }> = {
  common:    { label: 'Common',    color: '#888',    glow: 'none',                                    border: '#222' },
  rare:      { label: 'Rare',      color: '#4a9eff', glow: '0 0 12px rgba(74,158,255,0.3)',           border: '#4a9eff' },
  epic:      { label: 'Epic',      color: '#a855f7', glow: '0 0 20px rgba(168,85,247,0.4)',           border: '#a855f7' },
  legendary: { label: 'Legendary', color: '#f59e0b', glow: '0 0 30px rgba(245,158,11,0.5)',           border: '#f59e0b' },
  mythic:    { label: 'Mythic',    color: '#ff3366', glow: '0 0 40px rgba(255,51,102,0.6), 0 0 80px rgba(168,85,247,0.3)', border: '#ff3366' },
};

// Backwards compat
export const rarityLabel: Record<string, string> = Object.fromEntries(
  Object.entries(rarityConfig).map(([k, v]) => [k, v.label])
);

// ============ DROP SYSTEM ============

const rarityByTier: Record<ItemRarity, CosmeticItem[]> = {
  common:    cosmeticItems.filter(i => i.rarity === 'common'),
  rare:      cosmeticItems.filter(i => i.rarity === 'rare'),
  epic:      cosmeticItems.filter(i => i.rarity === 'epic'),
  legendary: cosmeticItems.filter(i => i.rarity === 'legendary'),
  mythic:    cosmeticItems.filter(i => i.rarity === 'mythic'),
};

/**
 * Drop table based on completed lesson count (acts as "level").
 * Returns the rarity tier rolled.
 */
function rollRarity(level: number): ItemRarity {
  const roll = Math.random() * 100;

  if (level >= 50) {
    // 35% common, 25% rare, 20% epic, 12% legendary, 8% mythic
    if (roll < 35) return 'common';
    if (roll < 60) return 'rare';
    if (roll < 80) return 'epic';
    if (roll < 92) return 'legendary';
    return 'mythic';
  }
  if (level >= 30) {
    // 30% common, 30% rare, 25% epic, 12% legendary, 3% mythic
    if (roll < 30) return 'common';
    if (roll < 60) return 'rare';
    if (roll < 85) return 'epic';
    if (roll < 97) return 'legendary';
    return 'mythic';
  }
  if (level >= 15) {
    // 35% common, 35% rare, 22% epic, 7% legendary, 1% mythic
    if (roll < 35) return 'common';
    if (roll < 70) return 'rare';
    if (roll < 92) return 'epic';
    if (roll < 99) return 'legendary';
    return 'mythic';
  }
  if (level >= 5) {
    // 45% common, 35% rare, 15% epic, 5% legendary
    if (roll < 45) return 'common';
    if (roll < 80) return 'rare';
    if (roll < 95) return 'epic';
    return 'legendary';
  }
  // Level 1-4: 60% common, 30% rare, 10% epic
  if (roll < 60) return 'common';
  if (roll < 90) return 'rare';
  return 'epic';
}

/**
 * Pick a reward item. Always gives something.
 * Prefers items the user doesn't own yet.
 */
export function pickReward(completedCount: number, owned: string[]): string | null {
  const rarity = rollRarity(completedCount);

  // Try to find an unowned item of this rarity
  const pool = rarityByTier[rarity].filter(i => !owned.includes(i.id));
  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)].id;
  }

  // If all items of this rarity are owned, try lower rarities
  const fallbackOrder: ItemRarity[] = ['common', 'rare', 'epic', 'legendary', 'mythic'];
  for (const r of fallbackOrder) {
    const fallback = rarityByTier[r].filter(i => !owned.includes(i.id));
    if (fallback.length > 0) {
      return fallback[Math.floor(Math.random() * fallback.length)].id;
    }
  }

  // All items owned
  return null;
}
