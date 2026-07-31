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
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not initialized');

    // Try PKCE flow first (code in query params)
    const queryStr = url.split('?')[1]?.split('#')[0] ?? '';
    const queryParams = new URLSearchParams(queryStr);
    const code = queryParams.get('code');

    if (code) {
      // PKCE: exchange code for session
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (error) throw error;
      console.log('exchangeCodeForSession: OK');
    } else {
      // Implicit flow fallback: tokens in hash fragment
      const hash = url.split('#')[1] ?? '';
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        throw new Error('OAuth callback missing code and tokens');
      }

      const { error } = await sb.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
      console.log('setSession: OK');
    }

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
          // Only process if we haven't already processed this code
          const processedKey = 'coduy-last-auth-code';
          const codeMatch = launchUrl.url.match(/[?&]code=([^&#]+)/);
          const code = codeMatch?.[1];
          if (code && localStorage.getItem(processedKey) === code) {
            // Already processed this code, skip
          } else {
            if (code) localStorage.setItem(processedKey, code);
            void processAuthCallback(launchUrl.url);
          }
        }

        // Request push notification permission
        try {
          const { PushNotifications } = await import('@capacitor/push-notifications');
          const permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            const result = await PushNotifications.requestPermissions();
            if (result.receive === 'granted') {
              try { await PushNotifications.register(); } catch {}
            }
          } else if (permStatus.receive === 'granted') {
            try { await PushNotifications.register(); } catch {}
          }

          // Listen for token and save to Supabase
          try {
            await PushNotifications.addListener('registration', async (token) => {
              console.log('Push token:', token.value);
              const sb = getSupabase();
              if (!sb) return;
              const { data: { user } } = await sb.auth.getUser();
              if (user) {
                // Save token to user_state (where push/send reads from)
                await sb.from('user_state').upsert({
                  user_id: user.id,
                  push_token: token.value,
                }, { onConflict: 'user_id' });
              }
            });

            await PushNotifications.addListener('registrationError', (err) => {
              console.log('Push registration error (normal on emulator):', err);
            });
          } catch {}
        } catch (e) {
          console.log('Push notification setup:', e);
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
