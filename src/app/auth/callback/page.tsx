'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { router.push('/'); return; }

    // Handle OAuth callback (Google redirects here with hash params)
    sb.auth.getSession().then(() => {
      router.push('/');
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#888' }}>Redirecting...</p>
    </div>
  );
}
