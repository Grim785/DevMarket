import db from '../models/index.js';
const { Order, Plugin, OrderItem } = db;

const orderController = {
  //lấy danh order của tất cả
  getAllOrders: async (req, res) => {
    console.log(req.user.role);
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const orders = await Order.findAll({
        include: ['plugins'], // nếu muốn kèm plugin
        order: [['createdAt', 'DESC']], // sắp xếp mới nhất trước
        // limit: 50, offset: 0 // nếu muốn phân trang
      });

      return res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  // Lấy danh sách đơn hàng của user
  getOrders: async (req, res) => {
    try {
      const orders = await req.user.getOrders({
        include: [
          {
            model: Plugin,
            as: 'plugins',
            through: {
              model: OrderItem,
              attributes: ['price'], // các cột trong OrderItem
            },
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
