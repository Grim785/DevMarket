import Stripe from 'stripe';
import db from '../models/index.js';
import dotenv from 'dotenv';
import { io } from '../index.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PaymentController = {
  // 1️⃣ Tạo PaymentIntent + Order + OrderItems
  createPaymentIntent: async (req, res) => {
    try {
      const { userId, products } = req.body;

      if (!userId || !products || products.length === 0) {
        return res.status(400).json({ error: 'Missing userId or products' });
      }

      // Tính tổng tiền (USD cents)
      const totalAmount = Math.round(
        products.reduce((sum, item) => sum + item.price, 0) * 100
      );

      const totalUSD = products.reduce((sum, item) => sum + item.price, 0);

      // Tạo PaymentIntent trên Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      // Tạo Order pending
      const order = await db.Order.create({
        userId,
        totalAmount: totalUSD, // lưu USD
        status: 'pending',
        paymentIntentId: paymentIntent.id,
      });

      // Tạo OrderItems
      for (let item of products) {
        await db.OrderItem.create({
          orderId: order.id,
          pluginId: item.pluginId,
          price: item.price,
        });
      }

      // Trả về clientSecret để frontend thanh toán
      res.json({
        clientSecret: paymentIntent.client_secret,
        orderId: order.id,
      });

      io.emit('newOrder', order);
    } catch (err) {
      console.error('Stripe error:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // 2️⃣ Webhook Stripe để cập nhật trạng thái thanh toán
  stripeWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Khi payment thành công
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      // 1️⃣ Update order status
      const order = await db.Order.findOne({
        where: { paymentIntentId: paymentIntent.id },
      });

      if (order) {
        await db.Order.update({ status: 'paid' }, { where: { id: order.id } });

        // 2️⃣ Clear giỏ hàng của user
        const cart = await db.Cart.findOne({ where: { userId: order.userId } });
        if (cart) {
          await db.CartItem.destroy({ where: { cartId: cart.id } });
        }

        console.log(
          `Order ${order.id} paid. Cart cleared for user ${order.userId}.`
        );
        io.emit('updateOrder', order);
      }
    }

    res.json({ received: true });
  },
};

export default PaymentController;
