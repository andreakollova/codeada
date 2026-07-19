import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zjyolgkakxuaegpvhimy.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeW9sZ2tha3h1YWVncHZoaW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MDQzNDMsImV4cCI6MjA5ODM4MDM0M30.thprSxjAG2_FtGDdgYnnXx4v1Olly5183jomT4_8NHM';

  if (!url || !key) return null;

  _client = createClient(url, key);
  // Expose for Capacitor deep link handler
  if (typeof window !== 'undefined') (window as any).__supabase = _client;
  return _client;
}

// Convenience alias - returns null when not configured
export const supabase = {
  from: (table: string) => getSupabase()?.from(table) as any,
  auth: {
    getSession: () => getSupabase()?.auth.getSession(),
    signInWithOAuth: (opts: any) => getSupabase()?.auth.signInWithOAuth(opts),
    signOut: () => getSupabase()?.auth.signOut(),
    onAuthStateChange: (cb: any) => getSupabase()?.auth.onAuthStateChange(cb),
  },
};
