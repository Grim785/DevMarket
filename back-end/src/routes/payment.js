import express from 'express';
import PaymentController from '../controllers/PaymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Tạo payment + order
router.post(
  '/create-payment-intent',
  authMiddleware(),
  PaymentController.createPaymentIntent
);

// Stripe webhook (phải dùng raw body)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhook
);

export default router;
