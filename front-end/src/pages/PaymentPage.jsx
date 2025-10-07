// src/pages/PaymentPage.jsx
import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function PaymentPage({ clientSecret, orderId }) {
  const options = { clientSecret };

  useEffect(() => {
    document.title = 'Payment';
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">💳 Payment</h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
      </Elements>
    </div>
  );
}
