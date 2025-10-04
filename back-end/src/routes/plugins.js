import { Router } from 'express';
import pluginController from '../controllers/pluginController.js';
import { authMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = Router();

// Cấu hình lưu file với multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // thư mục lưu file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // đặt tên duy nhất
  },
});

const upload = multer({ storage });

// ===== ROUTES =====
router.get('/fetchplugin/:id', pluginController.fetchPlugin);
router.get('/fetchAllplugin', pluginController.fetchAllPlugin);

router.post('/addplugin', authMiddleware(), pluginController.addPlugin);

router.put(
  '/updateplugin/:id',
  authMiddleware(),
  upload.single('file'), // nhận file từ input name="file"
  pluginController.updatePlugin
);

router.delete(
  '/deleteplugins/:id',
  authMiddleware(),
  pluginController.deletePlugin
);

router.get('/category/:id', pluginController.getPluginsByCategory);

// Upload file (plugin zip, hình ảnh…)
router.post(
  '/upload',
  authMiddleware(),
  upload.single('file'), // nhận file từ input name="file"
  pluginController.uploadFile
);

router.get('/:id/purchased', authMiddleware(), pluginController.checkPurchased);

router.get('/download/:id', authMiddleware(), pluginController.downloadPlugin);

export default router;
