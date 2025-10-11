import db from '../models/index.js';
import { pickFields } from '../utils/pickFields.js';
import fs from 'fs';
import path from 'path';
import { io } from '../index.js'; // import io để emit
import slugify from 'slugify';
import { Op } from 'sequelize';

const { Plugin, OrderItem, Order, Category } = db;

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
  'userId',
];

const pluginController = {
  // Lấy 1 plugin theo id
  fetchPlugin: async (req, res) => {
    try {
      const id = req.params.id;
      const plugin = await Plugin.findByPk(id, {
        include: [{ model: Category, as: 'category', attributes: ['name'] }],
      });

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
      const { page = 1, limit = 6, search = '' } = req.query;
      const offset = (page - 1) * limit;

      const where = search ? { name: { [Op.like]: `%${search}%` } } : {};

      const { count, rows } = await Plugin.findAndCountAll({
        where,
        include: [{ model: Category, as: 'category', attributes: ['name'] }],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
      });

      res.json({
        data: rows,
        totalPages: Math.ceil(count / limit),
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching plugins' });
    }
  },

  // Cập nhật plugin
  updatePlugin: async (req, res) => {
    try {
      const pluginId = req.params.id;
      const plugin = await Plugin.findByPk(pluginId);

      if (!plugin) {
        return res.status(404).json({ message: 'Plugin not found' });
      }

      const data = pickFields(req.body, allowedFields);

      // ép price >= 0
      if (data.price && data.price < 0) {
        return res.status(400).json({ message: 'Price không được nhỏ hơn 0' });
      }

      // Nếu có upload file mới
      if (req.files) {
        // Xử lý file chính
        if (req.files.file && req.files.file[0]) {
          if (plugin.fileUrl) {
            const oldFile = path.resolve(`.${plugin.fileUrl}`);
            if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
          }
          data.fileUrl = `/uploads/${req.files.file[0].filename}`;
        }

        // Xử lý thumbnail
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          if (plugin.thumbnail) {
            const oldThumb = path.resolve(`.${plugin.thumbnail}`);
            if (fs.existsSync(oldThumb)) fs.unlinkSync(oldThumb);
          }
          data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
        }
      }

      await plugin.update({ ...data });

      const updatedPlugin = await Plugin.findByPk(pluginId);

      res.json(updatedPlugin);
      io.emit('updatePlugin', updatedPlugin);
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

      // Lưu slug hoặc id trước khi xóa
      const deletedPluginData = {
        id: plugin.id,
        slug: plugin.slug,
        categoryId: plugin.categoryId,
      };

      // Xóa record trong DB
      await plugin.destroy();

      io.emit('deletePlugin', deletedPluginData);

      res.json({ message: 'Plugin deleted successfully' });
    } catch (error) {
      console.error('Error deleting plugin:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  //Thêm plugin
  //Thêm plugin
  addPlugin: async (req, res) => {
    try {
      const file = req.files?.file?.[0];
      const thumbnailFile = req.files?.thumbnail?.[0];
      const { thumbnail: thumbnailText } = req.body;

      if (!file) {
        return res.status(400).json({ message: 'File plugin bắt buộc' });
      }

      // ✅ Cho phép thumbnail là URL hoặc file upload
      let thumbnailUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = `/uploads/${thumbnailFile.filename}`;
      } else if (thumbnailText && thumbnailText.startsWith('http')) {
        thumbnailUrl = thumbnailText;
      } else {
        return res
          .status(400)
          .json({ message: 'Thiếu thumbnail (URL hoặc file)' });
      }

      const fileUrl = `/uploads/${file.filename}`;
      const data = pickFields(req.body, [
        'name',
        'description',
        'version',
        'price',
        'author',
        'categoryId',
        'userId',
      ]);

      // ✅ Tạo slug duy nhất
      let baseSlug = slugify(data.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;
      while (await Plugin.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const plugin = await Plugin.create({
        ...data,
        slug,
        fileUrl,
        thumbnail: thumbnailUrl,
      });

      const category = await Category.findByPk(plugin.categoryId);
      io.emit('newPlugin', {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        price: plugin.price,
        category: category?.slug,
        thumbnail: plugin.thumbnail,
      });

      res.status(201).json({
        message: 'Upload plugin thành công',
        plugin,
      });
    } catch (err) {
      console.error('Error uploading plugin:', err);
      res
        .status(500)
        .json({ message: 'Lỗi upload plugin', error: err.message });
    }
  },

  //dowload plugin
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

  //kiểm tra plugin đã thanh toán chưa
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

      const purchased = orders.length > 0;
      res.json({ purchased });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default pluginController;
