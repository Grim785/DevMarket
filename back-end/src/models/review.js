import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Plugin from './plugin.js';

const Review = sequelize.define(
  'Review',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER, // 1-5
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'reviews',
  }
);

// Quan hệ
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Plugin.hasMany(Review, { foreignKey: 'pluginId', as: 'reviews' });
Review.belongsTo(Plugin, { foreignKey: 'pluginId', as: 'plugin' });

export default Review;
