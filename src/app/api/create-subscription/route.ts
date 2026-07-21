import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email } = await req.json();
    const priceId = plan === 'yearly' ? PRICES.yearly : PRICES.monthly;

    // Create or get customer
    let customer;
    if (email) {
      const existing = await stripe.customers.list({ email, limit: 1 });
      customer = existing.data[0] || await stripe.customers.create({ email, metadata: { userId } });
    } else {
      customer = await stripe.customers.create({ metadata: { userId } });
    }

    // Create subscription with 7-day trial for trial plan
    const isTrial = plan === 'trial' || plan === 'yearly';
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: isTrial ? 7 : undefined,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId },
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice?.payment_intent as any;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret,
      customerId: customer.id,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
