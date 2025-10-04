import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

export default router;
