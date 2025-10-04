import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

router.get('/fetchuser', authMiddleware(), userController.fetchUser);
router.get('/fetchAllusers', authMiddleware(), userController.fetchAllUser);
router.post('/adduser', authMiddleware(), userController.addUser);
router.put('/updateuser/:id', authMiddleware(), userController.updateUser);
router.delete('/deleteuser/:id', authMiddleware(), userController.deleteUser);

export default router;
