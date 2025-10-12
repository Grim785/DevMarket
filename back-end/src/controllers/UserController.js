import db from '../models/index.js';
import { pickFields } from '../utils/pickFields.js';

const { User } = db;

// field cho phép client thao tác
const allowedFields = ['username', 'email', 'password', 'role'];

const userController = {
  // Lấy theo Id
  fetchUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy tất cả user
  fetchAllUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const { page, limit } = req.query;

      // Nếu không có page hoặc limit → lấy toàn bộ
      if (!page || !limit) {
        const allUsers = await User.findAll();
        return res.json({
          data: allUsers,
          totalItems: allUsers.length,
          totalPages: 1,
        });
      }

      // Nếu có page + limit → phân trang
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const offset = (pageNum - 1) * limitNum;

      const { count, rows } = await User.findAndCountAll({
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

  // Thêm user mới
  addUser: async (req, res) => {
    try {
      //kiểm tra admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const data = pickFields(req.body, allowedFields);

      const existingUser = await User.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      //kiểm tra username đã có chưa
      const existingUsername = await User.findOne({
        where: { username: data.username },
      });

      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const newUser = await User.create({ ...data });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Cập nhật user
  updateUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const data = pickFields(req.body, allowedFields);
      await user.update({ ...data });

      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Xóa user
  deleteUser: async (req, res) => {
    try {
      //kiểm tra admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default userController;
