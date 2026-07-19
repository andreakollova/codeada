'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

async function processDeepLink(url: string) {
  console.log('Processing deep link:', url);
  if (!url || !url.startsWith('coduy://')) return;

  const sb = getSupabase();
  if (!sb) { console.log('No supabase client'); return; }

  try {
    const fakeUrl = url.replace('coduy://', 'https://x/');
    const parsed = new URL(fakeUrl);
    const code = parsed.searchParams.get('code');
    const hash = fakeUrl.split('#')[1] || '';
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token') || parsed.searchParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token') || parsed.searchParams.get('refresh_token');

    console.log('Deep link params:', { code: !!code, accessToken: !!accessToken });

    if (accessToken && refreshToken) {
      const { error } = await sb.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      console.log('setSession:', error ? error.message : 'OK');
      if (!error) location.reload();
    } else if (code) {
      // Try PKCE exchange first
      const { error } = await sb.auth.exchangeCodeForSession(code);
      console.log('exchangeCode:', error ? error.message : 'OK');
      if (!error) {
        location.reload();
      } else {
        // PKCE verifier lost (WebView navigated away) - load callback in WebView
        console.log('PKCE failed, loading callback in WebView');
        location.href = `https://www.coduy.sk/auth/callback?code=${code}`;
      }
    }
  } catch (e) {
    console.log('Deep link error:', e);
  }
}

export default function DeepLinkHandler() {
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Capacitor) return;

    (async () => {
      try {
        const { App } = await import('@capacitor/app');

        // Check if app was LAUNCHED via deep link (event already fired before mount)
        const launchUrl = await App.getLaunchUrl();
        console.log('Launch URL:', launchUrl?.url || 'none');
        if (launchUrl?.url) {
          await processDeepLink(launchUrl.url);
        }

        // Listen for future deep links
        App.addListener('appUrlOpen', (event) => {
          processDeepLink(event.url);
        });
      } catch (e) {
        console.log('DeepLinkHandler error:', e);
      }
    })();
  }, []);

  return null;
}
