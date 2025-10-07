import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import slugify from 'slugify';

const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, unique: true },
  },
  {
    timestamps: true,
    tableName: 'categories',
  }
);

//tạo slug theo tên
Category.beforeCreate((Category) => {
  Category.slug = slugify(Category.name, { lower: true, strict: true });
});

Category.beforeUpdate((Category) => {
  Category.slug = slugify(Category.name, { lower: true, strict: true });
});

export default Category;
