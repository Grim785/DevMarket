import { Router } from 'express';
import categoryController from '../controllers/CategoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/', categoryController.getAllCategories);
router.post('/add', authMiddleware, categoryController.createCategory);
router.delete('/delete/:id', authMiddleware, categoryController.deleteCategory);
router.put('/update/:id', authMiddleware, categoryController.updateCategory);
router.get('/:id', authMiddleware, categoryController.getCategoryById);

export default router;
