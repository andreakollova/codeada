'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { glossaryEntries, categoryLabels } from '@/data/glossary';
import BottomNav from '@/components/BottomNav';
import StatusBar from '@/components/StatusBar';
import { GlossaryEntry } from '@/types';
import { ChevronDown, Search, X, Plus, Trash2 } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { s } from '@/data/strings';

interface CustomEntry {
  id: string;
  term: string;
  explanation: string;
  example: string;
}

function loadCustomEntries(): CustomEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('coduy-my-glossary') || '[]'); } catch { return []; }
}
function saveCustomEntries(entries: CustomEntry[]) {
  localStorage.setItem('coduy-my-glossary', JSON.stringify(entries));
}

const categories = ['všetko', 'môj', 'skratka', 'symbol', 'koncept', 'nastroj'] as const;
type Filter = typeof categories[number];

export default function GlossaryPage() {
  const { locale } = useLocaleStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('všetko');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newCode, setNewCode] = useState('');

  useEffect(() => { setCustomEntries(loadCustomEntries()); }, []);

  const addCustomEntry = () => {
    if (!newTerm.trim() || !newExplanation.trim()) return;
    const entry: CustomEntry = { id: `custom-${Date.now()}`, term: newTerm.trim(), explanation: newExplanation.trim(), example: newCode.trim() };
    const updated = [...customEntries, entry];
    setCustomEntries(updated);
    saveCustomEntries(updated);
    setNewTerm(''); setNewExplanation(''); setNewCode(''); setShowAddForm(false);
  };

  const removeCustomEntry = (id: string) => {
    const updated = customEntries.filter(e => e.id !== id);
    setCustomEntries(updated);
    saveCustomEntries(updated);
  };

  // Convert custom entries to GlossaryEntry format
  const customAsGlossary: (GlossaryEntry & { isCustom: true })[] = customEntries.map(e => ({
    id: e.id, term: e.term, category: 'skratka' as const, short: e.explanation.slice(0, 60),
    explanation: e.explanation, example: e.example || undefined, isCustom: true as const,
  }));

  const results = useMemo(() => {
    const q = query.toLowerCase();
    const allEntries = [...customAsGlossary, ...glossaryEntries];
    return allEntries.filter(e => {
      if (filter === 'môj') return 'isCustom' in e;
      const matchCat = filter === 'všetko' || e.category === filter || ('isCustom' in e);
      const matchQ = !q || e.term.toLowerCase().includes(q) || e.short.toLowerCase().includes(q) || e.explanation.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, filter, customAsGlossary]);

  return (
    <div className="page-shell" style={{ minHeight: '100vh', background: '#0F0F0F', paddingBottom: 80 }}>
      <StatusBar />

      {/* Header */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px 0' }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22, color: '#EDEDED', marginBottom: 6 }}>
            {s('glossary', locale)}
          </h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
            {s('glossarySubtitle', locale)}
          </p>
        </motion.div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={15} color="#444" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={s('searchGlossary', locale)}
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
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const label = cat === 'všetko' ? (locale === 'sk' ? 'Všetko' : 'All')
              : cat === 'môj' ? (locale === 'sk' ? 'Môj slovník' : 'My glossary')
              : categoryLabels[cat as GlossaryEntry['category']] || cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap', cursor: 'pointer', border: 'none',
                  background: filter === cat ? (cat === 'môj' ? '#4ade80' : '#fff') : '#111',
                  color: filter === cat ? '#000' : '#555',
                  transition: 'all 0.15s',
                }}
              >
                {label} {cat === 'môj' && customEntries.length > 0 ? `(${customEntries.length})` : ''}
              </button>
            );
          })}
        </div>

        {/* Add custom entry button */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12, marginBottom: 16,
            background: showAddForm ? '#111' : '#0a0a0a', border: '1px solid #222',
            color: '#aaa', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <Plus size={14} />
          {locale === 'sk' ? 'Pridať do môjho slovníka' : 'Add to my glossary'}
        </button>

        {/* Add form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden', marginBottom: 16 }}
            >
              <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  value={newTerm} onChange={e => setNewTerm(e.target.value)}
                  placeholder={locale === 'sk' ? 'Skratka / pojem (napr. API)' : 'Term (e.g. API)'}
                  style={{ padding: '10px 14px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
                />
                <textarea
                  value={newExplanation} onChange={e => setNewExplanation(e.target.value)}
                  placeholder={locale === 'sk' ? 'Vysvetlenie...' : 'Explanation...'}
                  rows={3}
                  style={{ padding: '10px 14px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}
                />
                <textarea
                  value={newCode} onChange={e => setNewCode(e.target.value)}
                  placeholder={locale === 'sk' ? 'Kód (voliteľné)' : 'Code (optional)'}
                  rows={2}
                  style={{ padding: '10px 14px', background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, color: '#aaa', fontSize: 12, fontFamily: 'monospace', outline: 'none', resize: 'vertical' }}
                />
                <button
                  onClick={addCustomEntry}
                  disabled={!newTerm.trim() || !newExplanation.trim()}
                  style={{
                    padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: newTerm.trim() && newExplanation.trim() ? '#4ade80' : '#222',
                    color: newTerm.trim() && newExplanation.trim() ? '#000' : '#555',
                    fontWeight: 700, fontSize: 13,
                  }}
                >
                  {locale === 'sk' ? 'Pridať' : 'Add'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 20px' }}>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 12, fontFamily: 'Syne, sans-serif' }}>
          {results.length} {s('results', locale)}
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
                  {'isCustom' in entry ? (
                    <span style={{
                      fontSize: 9, padding: '3px 7px', borderRadius: 6, fontWeight: 800,
                      letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                      background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80',
                    }}>
                      {locale === 'sk' ? 'môj' : 'mine'}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: 9, padding: '3px 7px', borderRadius: 6, fontWeight: 800,
                      letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0,
                      background: entry.category === 'skratka' ? '#1a1a1a' : entry.category === 'symbol' ? '#161616' : entry.category === 'koncept' ? '#181818' : '#141414',
                      color: entry.category === 'skratka' ? '#888' : entry.category === 'symbol' ? '#777' : entry.category === 'koncept' ? '#666' : '#555',
                    }}>
                      {entry.category === 'nastroj' ? 'nástroj' : entry.category}
                    </span>
                  )}

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
                        {'isCustom' in entry && (
                          <button
                            onClick={(e) => { e.stopPropagation(); removeCustomEntry(entry.id); setExpanded(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 11, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}
                          >
                            <Trash2 size={11} /> {locale === 'sk' ? 'Odstrániť' : 'Remove'}
                          </button>
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
            {s('noResults', locale)} &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

    </div>
  );
}
