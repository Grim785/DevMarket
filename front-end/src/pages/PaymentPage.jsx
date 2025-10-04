// src/pages/PaymentPage.jsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(
  'pk_test_51SE7UwIHJxdFUQDAlXcpKOKPMp3BIxGPjw7CTswbQUtuWzyFH7AvYd8sX4NqkNtzEH2a8RNwOeQD2RFHMj3mO0Xk006eVHZQkR'
);

export default function PaymentPage({ clientSecret, orderId }) {
  const options = { clientSecret };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">💳 Payment</h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm clientSecret={clientSecret} orderId={orderId} />
      </Elements>
    </div>
  );
}
