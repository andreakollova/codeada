import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  typescript: true,
});

export const PRICES = {
  monthly: 'price_1TvcbvLBp6R6umD2kiSmf5Sl', // 5.99 EUR/month
  yearly: 'price_1TvccBLBp6R6umD27LCdqaK4', // 59.99 EUR/year
} as const;

export const FIRST_MONTH_COUPON = 'pTUCnlJU'; // 3.00 off → 0.99 EUR first month
export const FIRST_YEAR_COUPON = 'AjZk4z4m'; // 40.00 off → 0.99 EUR first year
