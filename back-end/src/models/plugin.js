import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Plugin = sequelize.define(
  'Plugin',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    version: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    downloads: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    fileUrl: { type: DataTypes.STRING, allowNull: true },
    thumbnail: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: 'plugins', timestamps: true }
);

export default Plugin;
