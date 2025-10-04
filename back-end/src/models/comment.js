import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './user.js';
import Review from './review.js';

const Comment = sequelize.define(
  'Comment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'comments',
  }
);

export default Comment;
