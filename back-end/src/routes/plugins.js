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
//lấy plugin theo id
router.get('/fetchplugin/:id', pluginController.fetchPlugin);
//lấy tất cả plugins
router.get('/fetchAllplugin', pluginController.fetchAllPlugin);
//update plugin
router.put(
  '/updateplugin/:id',
  authMiddleware(),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]), // nhận file từ input name="file"
  pluginController.updatePlugin
);
//xóa plugin
router.delete(
  '/deleteplugins/:id',
  authMiddleware(),
  pluginController.deletePlugin
);

//thêm plugin
router.post(
  '/addplugin',
  authMiddleware(),
  upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  pluginController.addPlugin
);
//kiểm tra đã thanh toán plugin
router.get('/:id/purchased', authMiddleware(), pluginController.checkPurchased);
//dowload plugin
router.get('/download/:id', authMiddleware(), pluginController.downloadPlugin);

export default router;
