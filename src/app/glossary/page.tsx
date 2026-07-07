'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glossaryEntries, categoryLabels } from '@/data/glossary';
import BottomNav from '@/components/BottomNav';
import StatusBar from '@/components/StatusBar';
import { GlossaryEntry } from '@/types';
import { ChevronDown, Search, X } from 'lucide-react';

const categories = ['všetko', 'skratka', 'symbol', 'koncept', 'nastroj'] as const;
type Filter = typeof categories[number];

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('všetko');
  const [expanded, setExpanded] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return glossaryEntries.filter(e => {
      const matchCat = filter === 'všetko' || e.category === filter;
      const matchQ = !q || e.term.toLowerCase().includes(q) || e.short.toLowerCase().includes(q) || e.explanation.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, filter]);

  return (
    <div style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px 0' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 6 }}>
            Slovník
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
            Skratky, symboly, koncepty a nástroje — vysvetlené po ľudsky.
          </p>
        </motion.div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={15} color="#444" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Hľadaj pojem..."
            style={{
              width: '100%', padding: '11px 40px 11px 40px',
              background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: 12,
              color: '#fff', fontSize: 14, fontFamily: 'DM Sans, sans-serif',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={14} color="#444" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                background: filter === cat ? '#fff' : '#111',
                color: filter === cat ? '#000' : '#555',
                transition: 'all 0.15s',
              }}
            >
              {cat === 'všetko' ? 'Všetko' : categoryLabels[cat as GlossaryEntry['category']]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 20px' }}>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 12, fontFamily: 'Syne, sans-serif' }}>
          {results.length} výsledkov
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {results.map((entry, i) => {
            const isOpen = expanded === entry.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                style={{ background: '#0a0a0a', border: `1px solid ${isOpen ? '#2a2a2a' : '#141414'}`, borderRadius: 14, overflow: 'hidden' }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {/* Category badge */}
                  <span style={{
                    fontSize: 9, padding: '3px 7px', borderRadius: 6, fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                    background: entry.category === 'skratka' ? '#1a1a1a' : entry.category === 'symbol' ? '#161616' : entry.category === 'koncept' ? '#181818' : '#141414',
                    color: entry.category === 'skratka' ? '#888' : entry.category === 'symbol' ? '#777' : entry.category === 'koncept' ? '#666' : '#555',
                  }}>
                    {entry.category === 'nastroj' ? 'nástroj' : entry.category}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 1 }}>
                      {entry.term}
                    </div>
                    <div style={{ fontSize: 11, color: '#777', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {entry.short}
                    </div>
                  </div>

                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color="#333" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ borderTop: '1px solid #111', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <p style={{ fontSize: 13, color: '#999', lineHeight: 1.65, fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
                          {entry.explanation}
                        </p>
                        {entry.example && (
                          <div style={{ background: '#060606', border: '1px solid #1a1a1a', borderRadius: 10, padding: '10px 14px' }}>
                            <pre style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                              {entry.example}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: 13 }}>
            Žiadne výsledky pre "{query}"
          </div>
        )}
      </div>

    </div>
  );
}
