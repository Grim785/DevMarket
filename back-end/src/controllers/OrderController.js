import db from '../models/index.js';
const { Order, Plugin, OrderItem } = db;

const orderController = {
  //lấy danh order của tất cả
  getAllOrders: async (req, res) => {
    try {
      //kiểm tra admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { page, limit } = req.query;

      // Nếu không có page hoặc limit → lấy toàn bộ
      if (!page || !limit) {
        const allOrders = await Order.findAll();
        return res.json({
          data: allOrders,
          totalItems: allOrders.length,
          totalPages: 1,
        });
      }

      // Nếu có page + limit → phân trang
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Order.findAndCountAll({
        limit: limitNum,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        data: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limitNum),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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
  // createOrder: async (req, res) => {
  //   try {
  //     const cart = await req.user.getCart();
  //     const plugins = await cart.getPlugins();

  //     if (plugins.length === 0) {
  //       return res.status(400).json({ message: 'Cart is empty' });
  //     }

  //     const order = await req.user.createOrder();

  //     await order.addPlugins(
  //       plugins.map((plugin) => {
  //         plugin.orderItem = { priceAtPurchase: plugin.price };
  //         return plugin;
  //       })
  //     );

  //     // Xóa giỏ hàng sau khi đặt
  //     await cart.setPlugins(null);

  //     return res.status(201).json({ message: 'Order created', order });
  //   } catch (error) {
  //     res.status(500).json({ message: 'Server error', error: error.message });
  //   }
  // },
};

export default orderController;
