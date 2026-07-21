'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocaleStore } from '@/store/localeStore';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { locale } = useLocaleStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sk = locale === 'sk';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success`,
      },
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      {error && (
        <p style={{ color: '#ff8080', fontSize: 12, marginTop: 8 }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%', padding: '16px', borderRadius: 14, marginTop: 16,
          background: loading ? '#222' : '#4ade80',
          color: loading ? '#555' : '#000',
          fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" />{sk ? 'Spracovávam...' : 'Processing...'}</>
          : sk ? 'Zaplatiť' : 'Pay now'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        style={{
          width: '100%', padding: '10px', marginTop: 8,
          background: 'none', border: 'none', color: '#555',
          fontSize: 12, cursor: 'pointer',
        }}
      >
        {sk ? 'Zrušiť' : 'Cancel'}
      </button>
    </form>
  );
}

export default function StripeCheckout({
  clientSecret,
  onSuccess,
  onCancel,
}: {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  if (!clientSecret) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#4ade80',
            colorBackground: '#111',
            colorText: '#eee',
            colorDanger: '#ff8080',
            borderRadius: '12px',
            fontFamily: '-apple-system, system-ui, sans-serif',
          },
        },
      }}
    >
      <CheckoutForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}
