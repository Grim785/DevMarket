import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Category from './category.js';

const Plugin = sequelize.define(
  'Plugin',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloads: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: 'plugins',
  }
);

// Quan hệ
User.hasMany(Plugin, { foreignKey: 'userId', as: 'plugins' });
Plugin.belongsTo(User, { foreignKey: 'userId', as: 'authorUser' });

Category.hasMany(Plugin, { foreignKey: 'categoryId', as: 'plugins' });
Plugin.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export default Plugin;
