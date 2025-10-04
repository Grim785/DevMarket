import db from '../models/index.js';

async function seed() {
  try {
    console.log('⚡ Syncing database (force: true)...');
    await db.sequelize.sync({ force: true }); // xóa sạch bảng
    console.log('✅ Database synced!');

    /* --------------------------
       1. Tạo Users
    --------------------------- */
    const admin = await db.User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
    });

    const seller = await db.User.create({
      username: 'seller01',
      email: 'seller01@example.com',
      password: '123456',
      role: 'seller',
    });

    const buyer = await db.User.create({
      username: 'buyer01',
      email: 'buyer01@example.com',
      password: '123456',
      role: 'buyer',
    });

    /* --------------------------
       2. Tạo Categories
    --------------------------- */
    const webCategory = await db.Category.create({ name: 'Web Development' });
    const gameCategory = await db.Category.create({ name: 'Game Plugins' });

    /* --------------------------
       3. Tạo Plugins
    --------------------------- */
    const plugin1 = await db.Plugin.create({
      name: 'React UI Kit',
      slug: 'react-ui-kit',
      description: 'A modern UI kit for React projects.',
      version: '1.0.0',
      price: 19.99,
      author: seller.username,
      fileUrl: '/uploads/react-ui-kit.zip',
      thumbnail: '/uploads/react-ui-kit.png',
      userId: seller.id,
      categoryId: webCategory.id,
      status: 'approved',
    });

    const plugin2 = await db.Plugin.create({
      name: 'Unity Shader Pack',
      slug: 'unity-shader-pack',
      description: 'Collection of shaders for Unity.',
      version: '2.1.0',
      price: 29.99,
      author: seller.username,
      fileUrl: '/uploads/unity-shader-pack.zip',
      thumbnail: '/uploads/unity-shader-pack.png',
      userId: seller.id,
      categoryId: gameCategory.id,
      status: 'approved',
    });

    /* --------------------------
       4. Tạo Cart & CartItems cho buyer
    --------------------------- */
    const cart = await db.Cart.create({ userId: buyer.id });
    await db.CartItem.create({
      cartId: cart.id,
      pluginId: plugin1.id,
      quantity: 1,
    });

    /* --------------------------
       5. Tạo Order & OrderItems
    --------------------------- */
    // Order cho plugin2
    const order = await db.Order.create({
      userId: buyer.id,
      pluginId: plugin2.id, // phải có pluginId
      totalAmount: plugin2.price,
      status: 'paid',
      paymentIntentId: null, // chưa thanh toán Stripe test
    });

    await db.OrderItem.create({
      orderId: order.id,
      pluginId: plugin2.id,
      quantity: 1,
      price: plugin2.price,
    });

    /* --------------------------
       6. Tạo Reviews & Comments
    --------------------------- */
    const review1 = await db.Review.create({
      userId: buyer.id,
      pluginId: plugin1.id,
      rating: 5,
      comment: 'Great plugin!',
    });

    await db.Comment.create({
      userId: buyer.id,
      reviewId: review1.id,
      content: 'Totally agree!',
    });

    console.log('✅ Full seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
