import bcrypt from 'bcrypt';
import db from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
const { User } = db;
import { io } from '../index.js';

const authController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken({ id: user.id, username: user.username });
      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Register
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }

      const newUser = await User.create({ username, email, password });
      await newUser.createCart(); // Tạo giỏ hàng rỗng cho user mới
      const token = generateToken({
        id: newUser.id,
        username: newUser.username,
      });

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      });

      io.emit('newUser', newUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Logout
  logout: async (req, res) => {
    try {
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

export default authController;
