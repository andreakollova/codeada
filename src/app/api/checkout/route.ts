import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICES, FIRST_MONTH_COUPON } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { plan, userId, email } = await req.json();
    const priceId = plan === 'yearly' ? PRICES.yearly : PRICES.monthly;
    const origin = req.headers.get('origin') || 'https://coduy.com';

    const sessionParams: any = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: { userId: userId || '' },
      success_url: `${origin}/pricing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
    };

    // Apply first month discount for trial plan (monthly only)
    // Yearly gets 7-day free trial instead
    if (plan === 'trial') {
      sessionParams.discounts = [{ coupon: FIRST_MONTH_COUPON }];
      sessionParams.allow_promotion_codes = false;
    } else if (plan === 'yearly') {
      sessionParams.subscription_data = { trial_period_days: 7 };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
