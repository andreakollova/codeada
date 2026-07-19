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

    sb.auth.getSession().then(async ({ data }) => {
      const fromApp = searchParams.get('from') === 'app';

      if (fromApp && data.session) {
        // Close the Capacitor browser and redirect to app via URL scheme
        const accessToken = data.session.access_token;
        const refreshToken = data.session.refresh_token;

        // Try to close Capacitor Browser
        try {
          const { Browser } = await import('@capacitor/browser');
          await Browser.close();
        } catch {}

        // Redirect to app via custom URL scheme
        window.location.href = `coduy://auth?access_token=${accessToken}&refresh_token=${refreshToken}`;

        // Fallback: if URL scheme doesn't work after 2s, redirect to web
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
        return;
      }

      router.push('/');
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Signing you in...</p>
    </div>
  );
}
