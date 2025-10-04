import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define(
  'Order',
  {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    paymentIntentId: { type: DataTypes.STRING },
  },
  { tableName: 'orders', timestamps: true }
);

export default Order;
