import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Promo codes stored in Supabase table: promo_codes
// Columns: code (text, PK), type ('free_month' | 'admin'), uses_left (int), active (bool)

export async function POST(req: NextRequest) {
  try {
    const { code, userId } = await req.json();
    if (!code || !userId) return NextResponse.json({ error: 'Missing code or userId' }, { status: 400 });

    const cleanCode = code.trim().toUpperCase();

    // Check code
    const { data: promo } = await sb.from('promo_codes').select('*').eq('code', cleanCode).eq('active', true).single();
    if (!promo) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });

    // Check uses
    if (promo.uses_left !== null && promo.uses_left <= 0) {
      return NextResponse.json({ error: 'Code has been fully redeemed' }, { status: 410 });
    }

    // Apply
    const now = new Date().toISOString();
    let expiresAt: string;

    if (promo.type === 'admin') {
      // Admin code = unlimited access, expires in 100 years
      expiresAt = new Date(Date.now() + 100 * 365 * 86400000).toISOString();
    } else {
      // free_month = 30 days from now
      expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
    }

    // Update user subscription
    await sb.from('user_state').update({
      subscription_status: promo.type === 'admin' ? 'admin' : 'active',
      subscription_plan: promo.type === 'admin' ? 'admin' : 'promo',
      subscription_expires_at: expiresAt,
      promo_code_used: cleanCode,
    }).eq('user_id', userId);

    // Decrement uses
    if (promo.uses_left !== null) {
      await sb.from('promo_codes').update({ uses_left: promo.uses_left - 1 }).eq('code', cleanCode);
    }

    return NextResponse.json({ success: true, type: promo.type, expiresAt });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
