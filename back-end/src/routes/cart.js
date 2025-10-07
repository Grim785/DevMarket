import { Router } from 'express';
import cartController from '../controllers/CartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
//get cart
router.get('/', authMiddleware(), cartController.getCart);
//thêm plugin vào giỏ hàng
router.post('/add', authMiddleware(), cartController.addToCart);
//xóa plugin khỏi giỏ hàng
router.delete('/remove', authMiddleware(), cartController.removeFromCart);

export default router;
