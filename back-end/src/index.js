import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js';
import db from './models/index.js';

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

// Routes
app.use('/api', router);

app.use('/uploads', express.static('uploads'));

// Start server only if DB is connected
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    await db.sequelize.sync(); // sync models
    console.log('✅ All models synchronized successfully.');

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
