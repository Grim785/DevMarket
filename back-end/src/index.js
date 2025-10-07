import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
import db from './models/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// ✅ Bỏ qua express.json() cho route webhook (Stripe cần raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// ✅ Static file
app.use('/api/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api', router);

// ✅ HTTP server
const server = http.createServer(app);

// ✅ Socket.IO cấu hình chuẩn
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
});

// ✅ Lắng nghe kết nối socket
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Connected to Socket.IO server:', socket.id);
  }

  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('❌ Client disconnected:', socket.id);
    }
  });
});

// ✅ Kết nối DB rồi mới khởi động server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected.');

    await db.sequelize.sync();
    console.log('✅ Models synchronized.');

    server.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();

// ✅ Xuất io cho controller khác (real-time update)
export { io };
