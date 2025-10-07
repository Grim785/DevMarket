import { Router } from 'express';
import orderController from '../controllers/OrderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
//lấy tất cả orders
router.get('/fetchAllOrders', authMiddleware(), orderController.getAllOrders);
//lấy orders của user
router.get('/fetchUserOrders', authMiddleware(), orderController.getOrders);
// router.post('/create', authMiddleware(), orderController.createOrder);

export default router;
