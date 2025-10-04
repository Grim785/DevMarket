import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.js';
import Plugin from './plugin.js';

const OrderItem = sequelize.define(
  'OrderItem',
  {
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    pluginId: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: 'order_items', timestamps: true }
);

// Associations
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Plugin, { foreignKey: 'pluginId' });

export default OrderItem;
