// src/pages/CartPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import PaymentPage from './PaymentPage';
import { AuthContext } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const { token, user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [checkout, setCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Cart';
  }, []);

  // Load cart từ backend
  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const cartItems = data.plugins.map((plugin) => ({
          id: plugin.id,
          name: plugin.name,
          description: plugin.description,
          price: parseFloat(plugin.price) || 0,
          qty: 1,
          img: plugin.thumbnail
            ? plugin.thumbnail.startsWith('http')
              ? plugin.thumbnail
              : `${API_BASE}${plugin.thumbnail}`
            : 'https://via.placeholder.com/150',
        }));

        setItems(cartItems);
      } catch (err) {
        console.error('Fetch cart error:', err);
      }
    };

    fetchCart();
  }, [token]);

  // Xóa item khỏi giỏ
  const removeItem = async (id) => {
    try {
      await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pluginId: id }),
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!token || !user || items.length === 0) return;

    setLoading(true);
    const products = items.map((item) => ({
      pluginId: item.id,
      price: item.price,
    }));

    try {
      const res = await fetch(`${API_BASE}/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, products }),
      });

      const data = await res.json();

      if (res.ok) {
        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
        setCheckout(true);
      } else {
        alert(data.message || 'Lỗi thanh toán');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const fee = subtotal > 0 ? 2.5 : 0;
  const total = subtotal + fee;

  // Nếu checkout, hiển thị PaymentPage
  if (checkout && clientSecret && orderId) {
    return <PaymentPage clientSecret={clientSecret} orderId={orderId} />;
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>
        {items.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-blue-600 font-bold mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="bg-white border rounded-xl shadow-lg p-6 h-fit sticky top-10">
        <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>DevMarket Fee</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || loading}
          className={`w-full mt-6 py-3 rounded-xl text-white ${
            items.length === 0 || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
