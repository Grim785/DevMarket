import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
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

  // Cập nhật tiêu đề trang
  useEffect(() => {
    document.title = 'Cart';
  }, []);

  // 🛒 Lấy danh sách giỏ hàng
  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Không thể tải giỏ hàng');
        }

        const data = await res.json();

        if (!data.plugins) {
          setItems([]);
          return;
        }

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
        toast.error('Không thể tải giỏ hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  // 🗑️ Xóa sản phẩm khỏi giỏ
  const removeItem = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pluginId: id }),
      });

      if (!res.ok) throw new Error('Xóa sản phẩm thất bại');

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Đã xóa sản phẩm khỏi giỏ');
    } catch (err) {
      console.error('Remove item error:', err);
      toast.error('Không thể xóa sản phẩm');
    }
  };

  // 💳 Thanh toán
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

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.message || 'Lỗi tạo thanh toán');
      }

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setCheckout(true);
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Không thể thực hiện thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // 🧮 Tính tổng giỏ hàng (memo để tránh render lại)
  const { subtotal, fee, total } = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const fee = subtotal > 0 ? 2.5 : 0;
    return { subtotal, fee, total: subtotal + fee };
  }, [items]);

  // ✅ Nếu đang checkout thì hiển thị trang thanh toán
  if (checkout && clientSecret && orderId) {
    return <PaymentPage clientSecret={clientSecret} orderId={orderId} />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🧾 Danh sách sản phẩm */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">🛒 Your Cart</h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>Giỏ hàng trống.</p>
              <a
                href="/"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                ← Quay lại cửa hàng
              </a>
            </div>
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

        {/* 💰 Tóm tắt đơn hàng */}
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
    </>
  );
};

export default CartPage;
