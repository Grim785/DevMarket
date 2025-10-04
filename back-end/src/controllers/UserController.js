import db from '../models/index.js';
import { pickFields } from '../utils/pickFields.js';

const { User } = db;

// field cho phép client thao tác
const allowedFields = ['username', 'email', 'password'];

const userController = {
  // Lấy 1 user
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
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Thêm user mới
  addUser: async (req, res) => {
    try {
      const data = pickFields(req.body, allowedFields);
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
      const deleted = await User.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default userController;
