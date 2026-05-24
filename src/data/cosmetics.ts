import { CosmeticItem } from '@/types';

export const cosmeticItems: CosmeticItem[] = [
  // Hats
  { id: 'hat-beanie',     name: 'Čiapka',          description: 'Klasická pletená čiapka',     type: 'hat',      rarity: 'common'    },
  { id: 'hat-graduation', name: 'Promočná čiapka', description: 'Zvládol si to, gratulujeme',  type: 'hat',      rarity: 'rare'      },
  { id: 'hat-crown',      name: 'Koruna',           description: 'Pre tých čo vládnu kódu',    type: 'hat',      rarity: 'legendary' },
  { id: 'hat-cowboy',     name: 'Kovbojský klobúk', description: 'Riadny debug cowboy',        type: 'hat',      rarity: 'rare'      },
  { id: 'hat-party',      name: 'Party klobúk',     description: 'Každý deň je dôvod slaviť', type: 'hat',      rarity: 'common'    },

  // Glasses
  { id: 'glasses-round',  name: 'Okrúhle okuliare', description: 'Múdrosť v každom pixeli',   type: 'glasses',  rarity: 'common'    },
  { id: 'glasses-cool',   name: 'Slnečné okuliare', description: 'Kód je cool, ty tiež',      type: 'glasses',  rarity: 'rare'      },
  { id: 'glasses-mono',   name: 'Monokl',           description: 'Pre skutočných expertov',   type: 'glasses',  rarity: 'legendary' },

  // Accessories
  { id: 'acc-bowtie',     name: 'Motýlik',          description: 'Elegantný kód, elegantný ty', type: 'accessory', rarity: 'common'  },
  { id: 'acc-scarf',      name: 'Šál',              description: 'Byte sa nebojí zimy',        type: 'accessory', rarity: 'rare'    },
  { id: 'acc-medal',      name: 'Medaila',          description: 'Zaslúžená odmena',           type: 'accessory', rarity: 'legendary'},

  // Antenna tips
  { id: 'ant-heart',      name: 'Srdce',            description: 'Programuješ zo srdca',       type: 'antenna',  rarity: 'common'    },
  { id: 'ant-star',       name: 'Hviezda',          description: 'Zažiar medzi ostatnými',     type: 'antenna',  rarity: 'rare'      },
  { id: 'ant-lightning',  name: 'Blesk',            description: 'Rýchly ako tvoj kód',        type: 'antenna',  rarity: 'legendary' },
];

export function getItemById(id: string): CosmeticItem | undefined {
  return cosmeticItems.find(i => i.id === id);
}

export const rarityLabel: Record<string, string> = {
  common: 'Bežný',
  rare: 'Vzácny',
  legendary: 'Legendárny',
};

// Reward pool per lesson index (loops)
const rewardPool = [
  'hat-beanie', 'glasses-round', 'acc-bowtie', 'ant-heart',
  'hat-graduation', 'glasses-cool', 'acc-scarf', 'ant-star',
  'hat-cowboy', 'hat-party', 'glasses-mono', 'ant-lightning',
  'acc-medal', 'hat-crown',
];

export function pickReward(completedCount: number, owned: string[]): string | null {
  const notOwned = rewardPool.filter(id => !owned.includes(id));
  if (notOwned.length === 0) return null;
  // First 5 completions: guaranteed reward, after: 60% chance
  const roll = Math.random();
  if (completedCount <= 5 || roll < 0.6) {
    return notOwned[completedCount % notOwned.length];
  }
  return null;
}
