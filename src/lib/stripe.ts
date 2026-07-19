import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  typescript: true,
});

export const PRICES = {
  monthly: 'price_1TufJmLBp6R6umD2ZlWDBngx',
  yearly: 'price_1TufJmLBp6R6umD2JnprfO1m',
} as const;

export const FIRST_MONTH_COUPON = '7FzJvpui';
