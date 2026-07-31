'use client';

import { useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';

let isProcessingAuthCallback = false;
let deepLinkListenerRegistered = false;

async function processAuthCallback(url: string) {
  if (!url.startsWith('coduy://auth/callback')) return;
  if (isProcessingAuthCallback) return;

  // Check if we already processed this code
  const codeMatch = url.match(/[?&]code=([^&#]+)/);
  const code = codeMatch?.[1];
  const processedKey = 'coduy-last-auth-code';
  if (code && localStorage.getItem(processedKey) === code) return;

  isProcessingAuthCallback = true;
  if (code) localStorage.setItem(processedKey, code);

  try {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase not initialized');

    if (code) {
      // PKCE: exchange code for session
      const { error } = await sb.auth.exchangeCodeForSession(code);
      if (error) throw error;
      console.log('[DeepLink] exchangeCodeForSession: OK');
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
      console.log('[DeepLink] setSession: OK');
    }

    // Close SFSafariViewController — onAuthStateChange in AuthGate
    // will automatically detect the new session, no page reload needed
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    } catch {}

    // NO window.location.replace('/') — this was causing infinite reload loop!
    // AuthGate's onAuthStateChange will pick up the session and render the app

  } catch (error) {
    console.log('[DeepLink] OAuth callback error:', error);
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

        // Push notifications setup
        try {
          const { PushNotifications } = await import('@capacitor/push-notifications');

          // Register token listener FIRST (before register() fires)
          await PushNotifications.addListener('registration', async (token) => {
            console.log('Push token:', token.value);
            localStorage.setItem('coduy-push-token', token.value);
            // Save via API route (uses service role, bypasses RLS)
            try {
              const sb2 = getSupabase();
              const user = sb2 ? (await sb2.auth.getUser()).data.user : null;
              if (user) {
                await fetch('/api/push/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.id, token: token.value, locale: localStorage.getItem('coduy-locale') || 'en' }),
                });
                console.log('Push token saved via API');
              }
            } catch {}
          });

          await PushNotifications.addListener('registrationError', (err) => {
            console.log('Push registration error (normal on emulator):', err);
          });

          // Now register — permission check + register
          const sb3 = getSupabase();
          const hasSession = sb3 ? (await sb3.auth.getSession()).data.session : null;

          if (hasSession) {
            // Already logged in — ask permission if needed, then register
            const perm = await PushNotifications.checkPermissions();
            if (perm.receive === 'granted') {
              await PushNotifications.register();
            } else if (perm.receive === 'prompt') {
              setTimeout(async () => {
                try {
                  const r = await PushNotifications.requestPermissions();
                  if (r.receive === 'granted') await PushNotifications.register();
                } catch {}
              }, 3000);
            }
          } else if (sb3) {
            // Wait for login, then ask permission
            sb3.auth.onAuthStateChange(async (event) => {
              if (event === 'SIGNED_IN') {
                setTimeout(async () => {
                  try {
                    const p = await PushNotifications.checkPermissions();
                    if (p.receive === 'prompt') {
                      const r = await PushNotifications.requestPermissions();
                      if (r.receive === 'granted') await PushNotifications.register();
                    } else if (p.receive === 'granted') {
                      await PushNotifications.register();
                    }
                  } catch {}
                }, 3000);
              }
            });
          }
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
