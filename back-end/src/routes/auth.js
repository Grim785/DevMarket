import { Router } from 'express';
import authController from '../controllers/AuthController.js';

const router = Router();
//đăng nhập
router.post('/login', authController.login);
//đăng kí
router.post('/register', authController.register);
// router.get('/logout', authController.logout);

export default router;
