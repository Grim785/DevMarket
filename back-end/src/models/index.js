import sequelize from '../config/db.js';
import User from './user.js';
import Plugin from './plugin.js';
import Category from './category.js';
import Order from './order.js';
import OrderItem from './orderItem.js';
import Cart from './cart.js';
import CartItem from './cartItem.js';
import Review from './review.js';
import Comment from './comment.js';

// Export tất cả model
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

// Associations (User-Order)
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Plugin-OrderItem
Plugin.hasMany(OrderItem, { foreignKey: 'pluginId' });

export default db;
