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

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// Bỏ qua express.json() cho route webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use('/api/uploads', express.static('uploads'));
// Routes
app.use('/api', router);

// Tạo HTTP server từ Express app
const server = http.createServer(app);

// Tạo Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

// Khi có client kết nối Socket.IO
io.on('connection', (socket) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('✅ Connected to Socket.IO server');
  }
  socket.on('disconnect', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('❌ Client disconnected:', socket.id);
    }
  });
});

// Start server only if DB is connected
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    await db.sequelize.sync(); // sync models
    console.log('✅ All models synchronized successfully.');

    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();

// Export io nếu cần dùng ở các route khác
export { io };
