import db from '../models/index.js';
import { io } from '../index.js';
import { Socket } from 'socket.io';
import Category from '../models/category.js';
const CategoryController = {
  // lấy tất cả category
  getAllCategories: async (req, res) => {
    try {
      const { page, limit } = req.query;

      // Nếu không có page hoặc limit → lấy toàn bộ
      if (!page || !limit) {
        const allCategories = await Category.findAll();
        return res.json({
          data: allCategories,
          totalItems: allCategories.length,
          totalPages: 1,
        });
      }

      // Nếu có page + limit → phân trang
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await Category.findAndCountAll({
        limit: limitNum,
        offset,
        order: [['createdAt', 'DESC']],
      });

      return res.json({
        data: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limitNum),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  //lấy plugins theo category
  getPluginsByCategory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const offset = (page - 1) * limit;
      const { slug } = req.params;

      // Tìm category theo slug
      const category = await db.Category.findOne({ where: { slug } });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Lấy plugin theo categoryId
      const { count, rows } = await db.Plugin.findAndCountAll({
        offset,
        limit,
        where: { categoryId: category.id },
        include: [
          {
            model: db.User,
            as: 'authorUser',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      //trả dữ liệu về
      res.json({
        category: category.name,
        data: rows,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
      });
    } catch (error) {
      console.error('Error fetching plugins by category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  //tạo category
  createCategory: async (req, res) => {
    const { name, description } = req.body;
    try {
      //kiểm tra admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const newCategory = await db.Category.create({ name, description });

      io.emit('newCategory', newCategory);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  //cập nhật category
  updateCategory: async (req, res) => {
    //kiểm tra admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      //tìm category
      const category = await db.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      //giữ lại dữ liệu cũ nếu không có dữ liệu truyền vào
      category.name = name || category.name;
      category.description = description || category.description;
      await category.save();

      res.json(category);
      io.emit('updateCategory', category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  //xóa category
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      //kiểm tra admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const category = await db.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      //biến lưu category đã xóa
      const categorydelete = {
        id: category.id,
        name: category.name,
      };

      await category.destroy();
      res.json({ message: 'Category deleted successfully' });
      io.emit('deleteCategory', categorydelete);
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default CategoryController;
