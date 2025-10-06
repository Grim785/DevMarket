import { Router } from 'express';
import pluginController from '../controllers/PluginController.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Cấu hình lưu file với multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// ===== ROUTES =====
router.get('/fetchplugin/:id', pluginController.fetchPlugin);
router.get('/fetchAllplugin', pluginController.fetchAllPlugin);

router.post('/addplugin', authMiddleware(), pluginController.addPlugin);

router.put(
  '/updateplugin/:id',
  authMiddleware(),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]), // nhận file từ input name="file"
  pluginController.updatePlugin
);

router.delete(
  '/deleteplugins/:id',
  authMiddleware(),
  pluginController.deletePlugin
);

router.post(
  '/upload',
  authMiddleware(),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  pluginController.uploadFile
);

router.get('/:id/purchased', authMiddleware(), pluginController.checkPurchased);

router.get('/download/:id', authMiddleware(), pluginController.downloadPlugin);

export default router;
