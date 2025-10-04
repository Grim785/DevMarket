import sequelize from '../config/db.js';

// Import các model
import User from './user.js';
import Plugin from './plugin.js';
import Category from './category.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Cart from './cart.js';
import CartItem from './cartItem.js';
import Review from './review.js';
import Comment from './comment.js';

// Tập hợp db
const db = {
  sequelize,
  User,
  Plugin,
  Category,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Review,
  Comment,
};

// ======================
// --- Associations ---
// ======================

// User ↔ Plugin
User.hasMany(Plugin, { foreignKey: 'userId', as: 'plugins' });
Plugin.belongsTo(User, { foreignKey: 'userId', as: 'authorUser' });

// Category ↔ Plugin
Category.hasMany(Plugin, { foreignKey: 'categoryId', as: 'plugins' });
Plugin.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User ↔ Order
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Order ↔ OrderItem ↔ Plugin
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', onDelete: 'CASCADE' });

Plugin.hasMany(OrderItem, { foreignKey: 'pluginId' });
OrderItem.belongsTo(Plugin, { foreignKey: 'pluginId', onDelete: 'CASCADE' });

// Order ↔ Plugin (Many-to-Many qua OrderItem)
Order.belongsToMany(Plugin, {
  through: OrderItem,
  foreignKey: 'orderId',
  otherKey: 'pluginId',
  as: 'plugins', // đây là alias mà bạn dùng trong include
});
Plugin.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: 'pluginId',
  otherKey: 'orderId',
  as: 'orders',
});
// User ↔ Cart
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Cart ↔ CartItem ↔ Plugin
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Plugin.hasMany(CartItem, { foreignKey: 'pluginId' });
CartItem.belongsTo(Plugin, { foreignKey: 'pluginId' });

// Review ↔ Plugin
Plugin.hasMany(Review, { foreignKey: 'pluginId' });
Review.belongsTo(Plugin, { foreignKey: 'pluginId' });

// Review ↔ User
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Comment ↔ Plugin
Plugin.hasMany(Comment, { foreignKey: 'pluginId' });
Comment.belongsTo(Plugin, { foreignKey: 'pluginId' });

// Comment ↔ User
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

export default db;
