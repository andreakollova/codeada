'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

let isProcessingAuthCallback = false;
let deepLinkListenerRegistered = false;

async function processAuthCallback(url: string) {
  if (!url.startsWith('coduy://auth/callback')) return;
  if (isProcessingAuthCallback) return;

  isProcessingAuthCallback = true;

  try {
    const hash = url.split('#')[1] ?? '';
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) {
      throw new Error('OAuth callback missing tokens');
    }

    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not initialized');

    const { error } = await sb.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) throw error;

    console.log('setSession: OK');

    // Close the Safari/SFSafariViewController browser window
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    } catch {}

    // Navigate in the main WebView - NOT location.reload()
    window.location.replace('/');
  } catch (error) {
    console.log('OAuth callback error:', error);
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    } catch {}
  } finally {
    isProcessingAuthCallback = false;
  }
}

export default function DeepLinkHandler() {
  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Capacitor) return;
    if (deepLinkListenerRegistered) return;

    deepLinkListenerRegistered = true;

    let listener: any;

    const initialize = async () => {
      try {
        const { App } = await import('@capacitor/app');

        listener = await App.addListener('appUrlOpen', ({ url }) => {
          void processAuthCallback(url);
        });

        const launchUrl = await App.getLaunchUrl();
        if (launchUrl?.url) {
          void processAuthCallback(launchUrl.url);
        }
      } catch (e) {
        console.log('DeepLinkHandler init error:', e);
      }
    };

    void initialize();

    return () => {
      listener?.remove();
      deepLinkListenerRegistered = false;
    };
  }, []);

  return null;
}
