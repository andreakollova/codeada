'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      const sb = getSupabase();
      if (!sb) { window.location.replace('/'); return; }

      // PKCE flow: exchange code for session
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          await sb.auth.exchangeCodeForSession(code);
        } catch (e) {
          console.log('Code exchange error:', e);
        }
      }

      // Redirect to home
      window.location.replace('/');
    };

    handleCallback();
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#0F0F0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#666', fontSize: 14,
    }}>
      Signing in...
    </div>
  );
}
