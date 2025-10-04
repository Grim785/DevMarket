import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Plugin from './plugin.js';

const Cart = sequelize.define(
  'Cart',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: true,
    tableName: 'carts',
  }
);

User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsToMany(Plugin, {
  through: 'cart_items',
  as: 'plugins',
  foreignKey: 'cartId',
});
Plugin.belongsToMany(Cart, {
  through: 'cart_items',
  as: 'carts',
  foreignKey: 'pluginId',
});

export default Cart;
