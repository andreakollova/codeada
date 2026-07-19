import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId, receipt, productId } = await req.json();
    if (!userId || !productId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // Determine plan from product ID
    const plan = productId.includes('yearly') ? 'yearly' : 'monthly';
    const daysToAdd = plan === 'yearly' ? 365 : 30;
    const expiresAt = new Date(Date.now() + daysToAdd * 86400000).toISOString();

    // Update user subscription status
    await sb.from('user_state').update({
      subscription_status: 'active',
      subscription_plan: plan,
      subscription_expires_at: expiresAt,
      iap_receipt: receipt || '',
      iap_product_id: productId,
    }).eq('user_id', userId);

    // Slack notification
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `New in-app purchase! ${productId} - ${plan}` }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, plan, expiresAt });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
