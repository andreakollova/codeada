import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, token, locale } = await req.json();
    if (!userId || !token) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    // Save push token and locale to user_state
    await sb.from('user_state').update({ push_token: token, locale: locale || 'en' }).eq('user_id', userId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
