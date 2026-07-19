'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';

// Capacitor doesn't have a built-in StoreKit plugin
// For Capacitor apps loading remote URLs, we handle IAP via native Swift
// and communicate through Capacitor bridge

export function useInAppPurchase() {
  const { userId } = useUserStore();
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(typeof window !== 'undefined' && !!(window as any).Capacitor);
  }, []);

  const purchase = async (productId: string) => {
    if (!isApp) {
      // Web - redirect to Stripe checkout
      return null;
    }

    try {
      // Call native purchase via Capacitor plugin
      const result = await (window as any).Capacitor?.Plugins?.CoduyStore?.purchase({ productId });
      if (result?.success) {
        // Verify receipt on server
        await fetch('/api/iap/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            receipt: result.receipt,
            productId,
          }),
        });
        return { success: true };
      }
      return { success: false, error: result?.error };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  return { isApp, purchase };
}
