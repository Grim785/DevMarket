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

export default CartItem;
