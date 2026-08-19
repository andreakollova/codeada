import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Najprv sa prihlás.' }, { status: 400 });
    }

    const priceId = plan === 'yearly' ? PRICES.yearly : PRICES.monthly;

    // Create or get customer
    let customer;
    if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      customer = existing.data[0] || await stripe.customers.create({ email, metadata: { userId } });
    } else {
      customer = await stripe.customers.create({ metadata: { userId } });
    }

    // Cancel any existing active/trialing subscriptions to prevent duplicates
    const existingSubs = await stripe.subscriptions.list({ customer: customer.id, status: 'trialing', limit: 10 });
    const existingActive = await stripe.subscriptions.list({ customer: customer.id, status: 'active', limit: 10 });
    for (const sub of [...existingSubs.data, ...existingActive.data]) {
      await stripe.subscriptions.cancel(sub.id);
    }

    const isTrial = plan === 'trial';
    const origin = req.headers.get('origin') || 'https://coduy.sk';

    const sessionParams: any = {
      customer: customer.id,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?payment=success`,
      cancel_url: `${origin}/`,
      metadata: { userId },
      allow_promotion_codes: true,
    };

    if (isTrial) {
      sessionParams.subscription_data = { trial_period_days: 7, metadata: { userId } };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      checkoutUrl: session.url,
      type: 'redirect',
    });
  } catch (err: any) {
    console.error('Stripe subscription error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Stripe error' }, { status: 500 });
  }
}
