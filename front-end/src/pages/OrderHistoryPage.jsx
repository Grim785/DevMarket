import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL; // sử dụng env

const OrderHistory = () => {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Orders History';
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders/fetchUserOrders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error('❌ Lỗi khi lấy orders:', res.status);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Đang tải lịch sử đơn hàng...</p>
      </div>
    );

  if (!orders || orders.length === 0)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Lịch sử đơn hàng</h2>
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">🛒 Lịch sử đơn hàng</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between mb-2">
              <p className="text-gray-700">
                <span className="font-medium">Mã đơn:</span> #{order.id}
              </p>
              <p
                className={`px-3 py-1 text-sm rounded ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {order.status}
              </p>
            </div>

            <p className="text-gray-600 mb-3">
              Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </p>

            <div className="border-t pt-3 space-y-2">
              {Array.isArray(order.plugins) &&
                order.plugins.map((plugin) => (
                  <div
                    key={plugin.id}
                    className="flex justify-between items-center"
                  >
                    <p className="font-medium">{plugin.name}</p>
                    <p className="font-semibold text-blue-600">
                      ${Number(plugin.price || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between items-center">
              <p className="text-gray-700 font-medium">Tổng cộng:</p>
              <p className="text-lg font-bold text-blue-600">
                ${Number(order.totalAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
