import { Router } from 'express';
import categoryController from '../controllers/CategoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
//lấy danh sách tất cả category
router.get('/fetchAllCategories', categoryController.getAllCategories);
//tạo thêm category
router.post(
  '/addcategory',
  authMiddleware(),
  categoryController.createCategory
);
//xóa category
router.delete(
  '/deletecategories/:id',
  authMiddleware(),
  categoryController.deleteCategory
);
//update category
router.put(
  '/updatecategory/:id',
  authMiddleware(),
  categoryController.updateCategory
);

//lấy danh sách plugin theo nhóm
router.get('/:slug', categoryController.getPluginsByCategory);

export default router;
