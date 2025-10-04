import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Cart from './cart.js';
import Plugin from './plugin.js';

const CartItem = sequelize.define(
  'CartItem',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    timestamps: true,
    tableName: 'cart_items',
  }
);

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

Plugin.hasMany(CartItem, { foreignKey: 'pluginId' });
CartItem.belongsTo(Plugin, { foreignKey: 'pluginId' });

export default CartItem;
