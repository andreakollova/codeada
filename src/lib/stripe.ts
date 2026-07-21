import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  typescript: true,
});

export const PRICES = {
  monthly: 'price_1TufJmLBp6R6umD2ZlWDBngx',
  yearly: 'price_1TuqcKLBp6R6umD2PFAb17Mi', // TODO: create new 59.99 EUR/year price in Stripe
} as const;

export const FIRST_MONTH_COUPON = 'pTUCnlJU'; // 3.00 off → 0.99 EUR first month
export const FIRST_YEAR_COUPON = 'AjZk4z4m'; // 40.00 off → 0.99 EUR first year
