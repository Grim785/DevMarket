import { verifyToken } from '../utils/jwt.js';
import db from '../models/index.js';
const { User } = db;

export const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No token provided' });

      const decoded = verifyToken(token);
      if (!decoded) return res.status(403).json({ message: 'Invalid token' });

      // Fetch user instance từ DB
      const user = await User.findByPk(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Kiểm tra role nếu có
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user; // gán instance thật
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
};
