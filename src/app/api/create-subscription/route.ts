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
      // No trial: immediate payment
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: { userId },
      });

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent as any;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret || null,
        customerId: customer.id,
        type: 'payment',
      });
    }
  } catch (err: any) {
    console.error('Stripe subscription error:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Stripe error' }, { status: 500 });
  }
}
