'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { router.push('/'); return; }

    const fromApp = searchParams.get('from') === 'app';

    // Get the session from URL hash (Supabase puts tokens in hash fragment)
    sb.auth.getSession().then(({ data }) => {
      if (fromApp && data.session) {
        // Redirect immediately to app via custom URL scheme
        // This will open the app and Safari browser will dismiss
        window.location.replace(
          `coduy://auth?access_token=${data.session.access_token}&refresh_token=${data.session.refresh_token}`
        );
        return;
      }
      router.push('/');
    });
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12,
    }}>
      <p style={{ color: '#888', fontSize: 14 }}>Signing you in...</p>
      <p style={{ color: '#555', fontSize: 11 }}>Returning to Coduy app...</p>
    </div>
  );
}
