import db from '../models/index.js';
const CategoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await db.Category.findAll();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getPluginsByCategory: async (req, res) => {
    try {
      const { slug } = req.params;
      console.log();

      // 🔍 Tìm category theo slug
      const category = await db.Category.findOne({ where: { slug } });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // 🔌 Lấy plugin theo categoryId
      const plugins = await db.Plugin.findAll({
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
      });

      res.json({ category: category.name, plugins });
    } catch (error) {
      console.error('Error fetching plugins by category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  createCategory: async (req, res) => {
    const { name, description } = req.body;
    try {
      const newCategory = await db.Category.create({ name, description });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const category = await db.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      category.name = name || category.name;
      category.description = description || category.description;
      await category.save();
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await db.Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      await category.destroy();
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

export default CategoryController;
