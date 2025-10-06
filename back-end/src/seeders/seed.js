import db from '../models/index.js';
import slugify from 'slugify';

async function seed() {
  try {
    console.log('⚡ Syncing database (force: true)...');
    await db.sequelize.sync({ force: true });
    console.log('✅ Database synced!');

    /* --------------------------
       1. Users
    --------------------------- */
    const [admin, seller, buyer] = await Promise.all([
      db.User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
      }),
      db.User.create({
        username: 'seller01',
        email: 'seller01@example.com',
        password: '123456',
        role: 'seller',
      }),
      db.User.create({
        username: 'buyer01',
        email: 'buyer01@example.com',
        password: '123456',
        role: 'buyer',
      }),
    ]);

    console.log('👥 Users created');

    /* --------------------------
       2. Categories
    --------------------------- */
    const categories = [
      { name: 'Web Development' },
      { name: 'Game Plugins' },
      { name: 'Mobile App' },
      { name: 'AI Tools' },
    ];

    const categoryRecords = await Promise.all(
      categories.map((cat) =>
        db.Category.create({
          name: cat.name,
          slug: slugify(cat.name, { lower: true, strict: true }),
        })
      )
    );

    const [webCategory, gameCategory] = categoryRecords;
    console.log('📁 Categories created');

    /* --------------------------
       3. Plugins
    --------------------------- */
    const plugins = [
      {
        name: 'React UI Kit',
        description: 'A modern UI kit for React projects.',
        version: '1.0.0',
        price: 19.99,
        categoryId: webCategory.id,
        thumbnail: '/uploads/react-ui-kit.png',
        fileUrl: '/uploads/react-ui-kit.zip',
      },
      {
        name: 'Unity Shader Pack',
        description: 'Collection of shaders for Unity.',
        version: '2.1.0',
        price: 29.99,
        categoryId: gameCategory.id,
        thumbnail: '/uploads/unity-shader-pack.png',
        fileUrl: '/uploads/unity-shader-pack.zip',
      },
    ];

    const pluginRecords = await Promise.all(
      plugins.map((p) =>
        db.Plugin.create({
          ...p,
          slug: slugify(p.name, { lower: true, strict: true }),
          author: seller.username,
          userId: seller.id,
          status: 'approved',
        })
      )
    );

    const [plugin1, plugin2] = pluginRecords;
    console.log('🔌 Plugins created');

    /* --------------------------
       4. Cart & CartItems
    --------------------------- */
    const cart = await db.Cart.create({ userId: buyer.id });

    await db.CartItem.create({
      cartId: cart.id,
      pluginId: plugin1.id,
      quantity: 1,
    });

    console.log('🛒 Cart created');

    /* --------------------------
       5. Orders & OrderItems
    --------------------------- */
    const order = await db.Order.create({
      userId: buyer.id,
      totalAmount: plugin2.price,
      status: 'paid',
      paymentIntentId: 'pi_test_12345',
    });

    await db.OrderItem.create({
      orderId: order.id,
      pluginId: plugin2.id,
      quantity: 1,
      price: plugin2.price,
    });

    console.log('📦 Orders created');

    /* --------------------------
       6. Reviews & Comments
    --------------------------- */
    const review = await db.Review.create({
      userId: buyer.id,
      pluginId: plugin1.id,
      rating: 5,
      comment: 'Great plugin!',
    });

    await db.Comment.create({
      userId: buyer.id,
      reviewId: review.id,
      content: 'Totally agree!',
    });

    console.log('⭐ Reviews and comments created');
    console.log('✅ Full seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
