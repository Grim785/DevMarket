import { Router } from 'express';
import authRoutes from './auth.js';
import pluginRoutes from './plugins.js';
import cartRoutes from './cart.js';
import userRoutes from './user.js';
import orderRoutes from './order.js';
import categoryRoutes from './category.js';
import paymentRoutes from './payment.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/plugins', pluginRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);
router.use('/payment', paymentRoutes);

export default router;
