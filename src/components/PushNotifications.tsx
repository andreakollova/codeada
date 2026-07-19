'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export default function PushNotificationHandler() {
  const { userId } = useUserStore();

  useEffect(() => {
    if (typeof window === 'undefined' || !(window as any).Capacitor || !userId) return;

    (async () => {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        // Request permission
        const permResult = await PushNotifications.requestPermissions();
        if (permResult.receive !== 'granted') {
          console.log('Push permission not granted');
          return;
        }

        // Register for push
        await PushNotifications.register();

        // Get token and save to DB
        PushNotifications.addListener('registration', async (token) => {
          console.log('Push token:', token.value);
          // Save token to server
          try {
            await fetch('/api/push/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, token: token.value }),
            });
          } catch (e) {
            console.log('Failed to save push token:', e);
          }
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.log('Push registration error:', error);
        });

        // Handle received notification while app is open
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push received:', notification);
        });

        // Handle notification tap
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push tapped:', notification);
          // Navigate based on notification data
          const data = notification.notification.data;
          if (data?.url) {
            window.location.href = data.url;
          }
        });
      } catch (e) {
        console.log('Push notifications not available:', e);
      }
    })();
  }, [userId]);

  return null;
}
