'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const fromApp = params.get('from') === 'app';

    if (fromApp && code) {
      // Capacitor app: redirect to deep link — iOS/Android will open the app
      // SFSafariViewController will close, DeepLinkHandler will exchange the code
      window.location.href = `coduy://auth/callback?code=${code}`;

      // Fallback after 3s if deep link didn't work (e.g. opened in regular browser)
      setTimeout(async () => {
        const sb = getSupabase();
        if (sb) {
          try { await sb.auth.exchangeCodeForSession(code); } catch {}
        }
        window.location.replace('/');
      }, 3000);
      return;
    }

    // Web flow: exchange code and redirect home
    const handleWeb = async () => {
      if (code) {
        const sb = getSupabase();
        if (sb) {
          try { await sb.auth.exchangeCodeForSession(code); } catch {}
        }
      }
      window.location.replace('/');
    };
    handleWeb();
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0F0F',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      <p style={{ color: '#888', fontSize: 14 }}>Signing in...</p>
      <p style={{ color: '#444', fontSize: 11 }}>Returning to Coduy...</p>
    </div>
  );
}
