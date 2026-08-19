import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  let event;
  try {
    event = WEBHOOK_SECRET
      ? stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
      : JSON.parse(body);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const email = session.customer_email;
    const subscriptionId = session.subscription;

    if (userId) {
      // Get subscription details
      const sub = await stripe.subscriptions.retrieve(subscriptionId as string) as any;
      const plan = sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';
      const expiresAt = new Date((sub.current_period_end || Date.now() / 1000 + 30 * 86400) * 1000).toISOString();

      await sb.from('user_state').update({
        subscription_status: 'active',
        subscription_plan: plan,
        subscription_expires_at: expiresAt,
        stripe_customer_id: session.customer,
        stripe_subscription_id: subscriptionId,
      }).eq('user_id', userId);
    }

    // Slack notification with plan details
    const sub = await stripe.subscriptions.retrieve(subscriptionId as string) as any;
    const plan = sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'Yearly' : 'Monthly';
    const isTrial = sub.status === 'trialing';
    const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) + ' EUR' : '0 EUR';
    await notifySlack(`🎉 New subscription!\n• Email: ${email || 'N/A'}\n• Plan: ${plan}${isTrial ? ' (Free Trial)' : ''}\n• Amount: ${amount}`);
  }

  // Handle subscription becoming active after trial or renewal
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const userId = sub.metadata?.userId;
    if (userId && (sub.status === 'active' || sub.status === 'trialing')) {
      const plan = sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';
      const expiresAt = new Date((sub.current_period_end || Date.now() / 1000 + 30 * 86400) * 1000).toISOString();
      await sb.from('user_state').update({
        subscription_status: 'active',
        subscription_plan: plan,
        subscription_expires_at: expiresAt,
      }).eq('user_id', userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const customerId = sub.customer;
    const { data } = await sb.from('user_state').select('user_id').eq('stripe_customer_id', customerId).single();
    if (data) {
      await sb.from('user_state').update({
        subscription_status: 'canceled',
      }).eq('user_id', data.user_id);

      const plan = sub.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'Yearly' : 'Monthly';
      await notifySlack(`❌ Subscription canceled!\n• User: ${data.user_id}\n• Plan: ${plan}`);
    }
  }

  return NextResponse.json({ received: true });
}

async function notifySlack(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
  } catch {}
}
