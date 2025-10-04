import { Router } from 'express';
import cartController from '../controllers/CartController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', authMiddleware(), cartController.getCart);
router.post('/add', authMiddleware(), cartController.addToCart);
router.delete('/remove', authMiddleware(), cartController.removeFromCart);

export default router;
