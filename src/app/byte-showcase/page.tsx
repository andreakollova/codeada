'use client';

import { useState } from 'react';
import Byte from '@/components/Byte';
import { ByteMood } from '@/types';
import { motion } from 'framer-motion';

const moods: { mood: ByteMood; label: string; description: string }[] = [
  { mood: 'happy', label: 'Happy', description: 'Výchozí stav - vitajte' },
  { mood: 'celebrating', label: 'Celebrating', description: 'Lekcia dokončená!' },
  { mood: 'sleepy', label: 'Sleepy', description: 'Kde si bol 3 dni?' },
  { mood: 'worried', label: 'Worried', description: 'Séria je v ohrození' },
  { mood: 'proud', label: 'Proud', description: 'Modul dokončený!' },
  { mood: 'low_battery', label: 'Low Battery', description: 'Séria prerušená...' },
];

const byteQuotes: Record<ByteMood, string> = {
  happy: 'Ahoj! Som Byte. Dnes sa niečo naučíme?',
  celebrating: 'Tvoja prvá funkcia! Skoro som sa z radosti skratoval.',
  sleepy: 'Hej… boli to tri dni. Stále som ti držal miesto.',
  worried: 'Ešte jedna lekcia dnes a séria pokračuje. Dáš to?',
  proud: 'Zvládla si celý modul. Byte je hrdý. A to nie je ľahké.',
  low_battery: 'Séria prerušená. Ale jedna lekcia ma dobije. Stále tu som.',
};

export default function ByteShowcase() {
  const [selected, setSelected] = useState<ByteMood>('happy');

  return (
    <div className="min-h-screen px-4 py-12" style={{ background: '#0A0A0A' }}>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-black mb-2" style={{ fontWeight: 600, fontFamily: 'inherit', color: '#DEFF4A' }}>
          Byte - všetky stavy
        </h1>
        <p className="mb-10 text-sm" style={{ color: '#888780' }}>
          Klikni na stav pre náhľad
        </p>
        <motion.div
          className="flex flex-col items-center gap-4 mb-10 p-8 rounded-3xl"
          style={{ background: '#141414', border: '1.5px solid #1E1E1E' }}
        >
          <Byte mood={selected} size={180} />
          <div className="text-center">
            <div className="text-lg font-bold mb-1" style={{ fontWeight: 600, fontFamily: 'inherit', color: '#DEFF4A' }}>
              {moods.find(m => m.mood === selected)?.label}
            </div>
            <p className="text-sm italic" style={{ color: '#888780', maxWidth: '300px' }}>
              "{byteQuotes[selected]}"
            </p>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {moods.map(({ mood, label, description }) => (
            <motion.button
              key={mood}
              onClick={() => setSelected(mood)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl text-center"
              style={{
                background: selected === mood ? '#1E1E1E' : '#141414',
                border: '1.5px solid ' + (selected === mood ? '#DEFF4A' : '#1E1E1E'),
                cursor: 'pointer',
              }}
            >
              <Byte mood={mood} size={72} animate={selected === mood} />
              <div>
                <div className="font-bold text-sm" style={{ fontWeight: 600, fontFamily: 'inherit', color: selected === mood ? '#DEFF4A' : '#F1EFE8' }}>
                  {label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#888780' }}>{description}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href="/" className="text-sm" style={{ color: '#534AB7' }}>back to Coduy</a>
        </div>
      </div>
    </div>
  );
}
