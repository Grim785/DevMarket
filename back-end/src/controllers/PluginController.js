import db from '../models/index.js';
import { pickFields } from '../utils/pickFields.js';
import fs from 'fs';
import path from 'path';

const { Plugin, OrderItem, Order } = db;

const allowedFields = [
  'name',
  'description',
  'version',
  'author',
  'price',
  'slug',
  'categoryId',
  'fileUrl',
  'thumbnail',
  'status',
  'rating',
  'downloads',
];

const pluginController = {
  // Lấy 1 plugin theo id
  fetchPlugin: async (req, res) => {
    try {
      const plugin = await Plugin.findByPk(req.params.id);
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }
      res.json(plugin);
    } catch (error) {
      console.error('Error fetching plugin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy tất cả plugin
  fetchAllPlugin: async (req, res) => {
    try {
      const plugins = await Plugin.findAll();
      res.json(plugins);
    } catch (error) {
      console.error('Error fetching plugins:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Thêm plugin mới
  addPlugin: async (req, res) => {
    try {
      const data = pickFields(req.body, allowedFields);
      const newPlugin = await Plugin.create({ ...data });
      res.status(201).json(newPlugin);
    } catch (error) {
      console.error('Error adding plugin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Cập nhật plugin
  updatePlugin: async (req, res) => {
    try {
      const plugin = await Plugin.findByPk(req.params.id);
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      const data = pickFields(req.body, allowedFields);

      // ép price >= 0
      if (data.price && data.price < 0) {
        return res.status(400).json({ message: 'Price không được nhỏ hơn 0' });
      }

      // Nếu có upload file mới
      if (req.file) {
        // Xóa file cũ nếu có
        if (plugin.fileUrl) {
          const oldPath = path.resolve(`.${plugin.fileUrl}`);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        // Gán file mới
        data.fileUrl = `/uploads/${req.file.filename}`;
      }

      await plugin.update({ ...data });

      res.json(plugin);
    } catch (error) {
      console.error('Error updating plugin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Xóa plugin
  deletePlugin: async (req, res) => {
    try {
      const pluginId = req.params.id;
      const plugin = await Plugin.findByPk(pluginId);
      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      // Kiểm tra order history
      const count = await OrderItem.count({ where: { pluginId } });
      if (count > 0) {
        return res.status(400).json({
          message: 'Cannot delete plugin because it has order history',
        });
      }

      // Xóa file nếu tồn tại
      if (plugin.fileUrl) {
        const filePath = path.resolve(`.${plugin.fileUrl}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Xóa record trong DB
      await plugin.destroy();

      res.json({ message: 'Plugin deleted successfully' });
    } catch (error) {
      console.error('Error deleting plugin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Lấy plugin theo category
  getPluginsByCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const plugins = await Plugin.findAll({ where: { categoryId } });
      res.json(plugins);
    } catch (error) {
      console.error('Error fetching plugins by category:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Upload file
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Tạo URL truy cập file
      const fileUrl = `/uploads/${req.file.filename}`;

      // Lấy các field hợp lệ từ body
      const data = pickFields(req.body, allowedFields);

      // ép price >= 0
      if (data.price && data.price < 0) {
        return res.status(400).json({ message: 'Price không được nhỏ hơn 0' });
      }

      // Tạo plugin mới kèm fileUrl
      const plugin = await Plugin.create({
        ...data,
        fileUrl,
      });

      res.json({
        message: 'Upload & tạo plugin thành công',
        plugin,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Lỗi upload file', error });
    }
  },

  downloadPlugin: async (req, res) => {
    try {
      const plugin = await Plugin.findByPk(req.params.id);
      if (!plugin || !plugin.fileUrl) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Tăng lượt download
      await plugin.increment('downloads');

      // Gửi file cho user tải
      const filePath = plugin.fileUrl; // VD: '/uploads/abc.zip'
      res.download(`.${filePath}`, plugin.name + '.zip');
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({ message: 'Lỗi download file', error });
    }
  },

  //check purchased
  checkPurchased: async (req, res) => {
    const userId = req.user.id;
    const pluginId = req.params.id;
    try {
      const orders = await Order.findAll({
        where: { userId, status: 'paid' },
        include: [
          {
            model: Plugin,
            as: 'plugins', // phải trùng alias
            where: { id: pluginId },
          },
        ],
      });

      console.log(orders);

      const purchased = orders.length > 0;
      res.json({ purchased });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default pluginController;
