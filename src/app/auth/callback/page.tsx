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

    sb.auth.getSession().then(({ data }) => {
      // If came from native app, redirect back to app
      const fromApp = searchParams.get('from') === 'app';
      if (fromApp && data.session) {
        // Redirect to app via custom URL scheme with session token
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;
        window.location.href = `coduy://auth?access_token=${accessToken}&refresh_token=${refreshToken}`;
        return;
      }
      router.push('/');
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Redirecting...</p>
    </div>
  );
}
