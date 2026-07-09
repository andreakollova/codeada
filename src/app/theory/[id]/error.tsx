'use client';

import { useEffect } from 'react';

export default function TheoryError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Theory page error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <p style={{ color: '#888', fontSize: 14 }}>Something went wrong loading this lesson.</p>
      <p style={{ color: '#555', fontSize: 12 }}>{error.message}</p>
      <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 10, background: '#fff', color: '#000', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
        Try again
      </button>
      <a href="/" style={{ color: '#888', fontSize: 13, marginTop: 8 }}>← Back home</a>
    </div>
  );
}
