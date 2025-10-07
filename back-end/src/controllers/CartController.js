import db from '../models/index.js';
const { Plugin, Cart } = db;

const cartController = {
  // Lấy giỏ hàng
  getCart: async (req, res) => {
    try {
      //tìm cart của user
      const cart = await req.user.getCart();
      //tìm plugins có trong cart
      const plugins = await cart.getPlugins();

      return res.json({ cartId: cart.id, plugins });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Thêm plugin vào giỏ
  addToCart: async (req, res) => {
    try {
      const { pluginId } = req.body;
      //tìm cart của user
      const cart = await req.user.getCart();

      //kiểm tra plugin đã có trong cart chưa
      const existing = await cart.getPlugins({ where: { id: pluginId } });
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Plugin already in cart' });
      }

      //tìm plugin thêm vào
      const plugin = await Plugin.findByPk(pluginId);
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      //thêm vào cart
      await cart.addPlugin(plugin);
      return res.status(201).json({ message: 'Plugin added to cart', plugin });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Xóa plugin khỏi giỏ
  removeFromCart: async (req, res) => {
    try {
      const { pluginId } = req.body;
      //tìm giỏ hàng của user
      const cart = await req.user.getCart();

      //tìm plugins trong giỏ hàng
      const plugins = await cart.getPlugins({ where: { id: pluginId } });

      if (plugins.length === 0) {
        return res.status(404).json({ message: 'Plugin not found in cart' });
      }

      //plugin trả về có dạng [{}]
      const plugin = plugins[0];

      //xóa plugin ra khỏi cart
      await plugin.cart_items.destroy();
      return res.json({ message: 'Plugin removed from cart' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default cartController;
