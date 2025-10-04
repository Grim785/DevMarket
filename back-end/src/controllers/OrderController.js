import db from '../models/index.js';
const { Order, Plugin } = db;

const orderController = {
  // Lấy danh sách đơn hàng của user
  getOrders: async (req, res) => {
    try {
      const orders = await req.user.getOrders({
        include: ['plugins'],
      });

      return res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Tạo đơn hàng từ giỏ
  createOrder: async (req, res) => {
    try {
      const cart = await req.user.getCart();
      const plugins = await cart.getPlugins();

      if (plugins.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      const order = await req.user.createOrder();

      await order.addPlugins(
        plugins.map((plugin) => {
          plugin.orderItem = { priceAtPurchase: plugin.price };
          return plugin;
        })
      );

      // Xóa giỏ hàng sau khi đặt
      await cart.setPlugins(null);

      return res.status(201).json({ message: 'Order created', order });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default orderController;
