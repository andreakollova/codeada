'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X } from 'lucide-react';
import Byte from './Byte';

interface AskByteProps {
  lessonTitle: string;
  lessonContent: string;
  locale: string;
  equipment: any;
  userId?: string | null;
}

const MAX_PER_LESSON = 5;

export default function AskByte({ lessonTitle, lessonContent, locale, equipment, userId }: AskByteProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'byte'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionsLeft, setQuestionsLeft] = useState(MAX_PER_LESSON);

  const ask = async () => {
    if (!input.trim() || loading || questionsLeft <= 0) return;
    const q = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, lessonTitle, lessonContent, locale, userId }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages(m => [...m, { role: 'byte', text: data.error }]);
      } else {
        setMessages(m => [...m, { role: 'byte', text: data.answer }]);
      }
      setQuestionsLeft(q => q - 1);
    } catch {
      setMessages(m => [...m, { role: 'byte', text: locale === 'sk' ? 'Niečo sa pokazilo.' : 'Something went wrong.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: 100, right: 16, zIndex: 90,
            width: 48, height: 48, borderRadius: '50%',
            background: '#4ade80', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(74,222,128,0.3)',
          }}
        >
          <MessageCircle size={22} color="#000" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed', bottom: 90, left: 12, right: 12, zIndex: 90,
              background: '#111', border: '1px solid #222', borderRadius: 16,
              maxHeight: 400, display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Byte mood="happy" size={28} equipment={equipment} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ccc' }}>
                  {locale === 'sk' ? 'Ask Coduy' : 'Ask Coduy'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, color: '#555' }}>
                  {questionsLeft}/{MAX_PER_LESSON}
                </span>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <X size={16} color="#555" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260 }}>
              {messages.length === 0 && (
                <p style={{ color: '#555', fontSize: 12, textAlign: 'center', margin: 'auto' }}>
                  {locale === 'sk' ? 'Opýtaj sa ma čokoľvek k tejto lekcii!' : 'Ask me anything about this lesson!'}
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: '8px 12px', borderRadius: 12, maxWidth: '80%',
                    background: msg.role === 'user' ? '#1a1a1a' : 'rgba(74,222,128,0.1)',
                    border: `1px solid ${msg.role === 'user' ? '#2a2a2a' : 'rgba(74,222,128,0.2)'}`,
                  }}>
                    <p style={{ fontSize: 13, color: msg.role === 'user' ? '#ccc' : '#bbb', margin: 0, lineHeight: 1.5 }}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                      style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder={locale === 'sk' ? 'Napíš otázku...' : 'Type a question...'}
                disabled={questionsLeft <= 0}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8,
                  background: '#0a0a0a', border: '1px solid #1a1a1a',
                  color: '#ccc', fontSize: 14, fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button
                onClick={ask}
                disabled={!input.trim() || loading || questionsLeft <= 0}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: input.trim() ? '#4ade80' : '#1a1a1a',
                  border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Send size={14} color={input.trim() ? '#000' : '#555'} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
