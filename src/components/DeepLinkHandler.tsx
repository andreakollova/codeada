'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';

export default function DeepLinkHandler() {
  const { setUserId } = useUserStore();

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Capacitor) return;

    let cleanup: (() => void) | null = null;

    (async () => {
      try {
        const { App } = await import('@capacitor/app');

        const listener = await App.addListener('appUrlOpen', async (event) => {
          console.log('Deep link received:', event.url);

          if (!event.url || !event.url.startsWith('coduy://')) return;

          const sb = getSupabase();
          if (!sb) { location.reload(); return; }

          try {
            const fakeUrl = event.url.replace('coduy://', 'https://x/');
            const parsed = new URL(fakeUrl);
            const code = parsed.searchParams.get('code');
            const hash = fakeUrl.split('#')[1] || '';
            const hashParams = new URLSearchParams(hash);
            const accessToken = hashParams.get('access_token') || parsed.searchParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token') || parsed.searchParams.get('refresh_token');

            console.log('Deep link params:', { code: !!code, accessToken: !!accessToken });

            if (accessToken && refreshToken) {
              const { error } = await sb.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              console.log('setSession result:', error ? error.message : 'success');
              if (!error) location.reload();
            } else if (code) {
              const { error } = await sb.auth.exchangeCodeForSession(code);
              console.log('exchangeCode result:', error ? error.message : 'success');
              if (!error) {
                location.reload();
              } else {
                // PKCE verifier mismatch - try loading in WebView directly
                console.log('Falling back to WebView callback');
                location.href = `https://www.coduy.sk/auth/callback?code=${code}`;
              }
            } else {
              location.reload();
            }
          } catch (e) {
            console.log('Deep link processing error:', e);
            location.reload();
          }
        });

        cleanup = () => listener.remove();
      } catch (e) {
        console.log('App plugin init error:', e);
      }
    })();

    return () => { if (cleanup) cleanup(); };
  }, []);

  return null;
}
