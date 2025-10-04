import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const OrderItem = sequelize.define(
  'OrderItem',
  {
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    pluginId: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  { tableName: 'order_items', timestamps: true }
);

export default OrderItem;
