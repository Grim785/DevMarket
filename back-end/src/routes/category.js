import { Router } from 'express';
import categoryController from '../controllers/CategoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.get('/fetchAllCategories', categoryController.getAllCategories);
router.post(
  '/addcategory',
  authMiddleware(),
  categoryController.createCategory
);
router.delete(
  '/deletecategories/:id',
  authMiddleware(),
  categoryController.deleteCategory
);
router.put(
  '/updatecategory/:id',
  authMiddleware(),
  categoryController.updateCategory
);
router.get('/:slug', categoryController.getPluginsByCategory);

export default router;
