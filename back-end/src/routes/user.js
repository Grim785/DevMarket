import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

//lấy user theo id
router.get('/fetchuser', authMiddleware(), userController.fetchUser);
//lấy tất cả user
router.get('/fetchAllusers', authMiddleware(), userController.fetchAllUser);
//thêm user (của admin)
router.post('/adduser', authMiddleware(), userController.addUser);
//update user
router.put('/updateuser/:id', authMiddleware(), userController.updateUser);
//xóa user
router.delete('/deleteusers/:id', authMiddleware(), userController.deleteUser);

export default router;
