import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ clientSecret, orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // trạng thái thanh toán thành công
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`, // không redirect
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true); // hiển thị popup
      }
    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          ✅ Payment successful!
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          ❌ {errorMsg}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
}
