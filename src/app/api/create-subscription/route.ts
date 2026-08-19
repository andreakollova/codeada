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

    const isTrial = plan === 'trial' || plan === 'yearly';

    if (isTrial) {
      // Trial: use SetupIntent to collect payment method, charge later
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: 7,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['pending_setup_intent'],
        metadata: { userId },
      });

      const setupIntent = (subscription as any).pending_setup_intent;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: setupIntent?.client_secret || null,
        customerId: customer.id,
        type: 'setup',
      });
    } else {
      // No trial: use Checkout Session for reliable payment flow
      const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${req.headers.get('origin') || 'https://coduy.sk'}/?payment=success`,
        cancel_url: `${req.headers.get('origin') || 'https://coduy.sk'}/pricing?canceled=true`,
        metadata: { userId },
        allow_promotion_codes: true,
      });

      return NextResponse.json({
        checkoutUrl: session.url,
        type: 'redirect',
      });
    }
  } catch (err: any) {
    console.error('Stripe subscription error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Stripe error' }, { status: 500 });
  }
}
