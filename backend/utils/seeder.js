const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const categories = [
  { name: 'Living Room', nameSI: 'විසිත්ත කාමරය', slug: 'living-room', icon: '🛋️', isActive: true, sortOrder: 1 },
  { name: 'Bedroom', nameSI: 'නිදන කාමරය', slug: 'bedroom', icon: '🛏️', isActive: true, sortOrder: 2 },
  { name: 'Dining Room', nameSI: 'ආහාර කාමරය', slug: 'dining-room', icon: '🍽️', isActive: true, sortOrder: 3 },
  { name: 'Office', nameSI: 'කාර්යාලය', slug: 'office', icon: '💼', isActive: true, sortOrder: 4 },
  { name: 'Outdoor', nameSI: 'එළිමහන්', slug: 'outdoor', icon: '🌿', isActive: true, sortOrder: 5 },
  { name: "Kids' Room", nameSI: 'ළමා කාමරය', slug: 'kids-room', icon: '🧸', isActive: true, sortOrder: 6 },
];

const importData = async () => {
  try {
    await connectDB();

    // Sample catalog only — does not delete or create users (use npm run seed:admin)
    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories seeded`);

    const livingRoom = createdCategories.find(c => c.slug === 'living-room');
    const bedroom = createdCategories.find(c => c.slug === 'bedroom');

    const sampleProducts = [
      {
        name: 'Royal Comfort Sofa',
        nameSI: 'රාජකීය සෝෆා',
        slug: 'royal-comfort-sofa',
        sku: 'AF-SOF-001',
        description: 'Premium 3-seater sofa with velvet upholstery and solid wood frame. Perfect for your living room.',
        descriptionSI: 'ප්‍රිමියම් 3-ආසන සෝෆා',
        category: livingRoom._id,
        price: 85000,
        discount: 10,
        stock: 12,
        images: [{ url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', isPrimary: true }],
        materials: ['Velvet', 'Solid Wood', 'High-density Foam'],
        colors: [{ name: 'Royal Blue', hex: '#1a3a6b' }, { name: 'Cream', hex: '#f5f5dc' }],
        isFeatured: true, isBestSeller: true, isActive: true,
        dimensions: { length: 220, width: 85, height: 90, unit: 'cm' },
      },
      {
        name: 'Modern Platform Bed',
        nameSI: 'නූතන ඇඳ',
        slug: 'modern-platform-bed',
        sku: 'AF-BED-001',
        description: 'Contemporary platform bed with storage drawers. Available in King and Queen sizes.',
        descriptionSI: 'නූතන ඇඳ',
        category: bedroom._id,
        price: 120000,
        discount: 15,
        stock: 8,
        images: [{ url: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800', isPrimary: true }],
        materials: ['Teak Wood', 'Plywood'],
        colors: [{ name: 'Walnut', hex: '#5C4033' }, { name: 'White', hex: '#FFFFFF' }],
        isFeatured: true, isNewArrival: true, isActive: true,
        dimensions: { length: 210, width: 180, height: 40, unit: 'cm' },
      },
      {
        name: 'Executive Office Chair',
        nameSI: 'කාර්යාල පුටුව',
        slug: 'executive-office-chair',
        sku: 'AF-CHR-001',
        description: 'Ergonomic executive chair with lumbar support and adjustable armrests.',
        descriptionSI: 'කාර්යාල පුටුව',
        category: createdCategories.find(c => c.slug === 'office')._id,
        price: 45000,
        discount: 0,
        stock: 25,
        images: [{
          url: 'https://images.unsplash.com/photo-1580480055273-2289b485ad41?w=800',
          alt: 'Executive Office Chair',
          isPrimary: true,
        }],
        materials: ['Leather', 'Aluminum', 'Nylon'],
        colors: [{ name: 'Black', hex: '#000000' }],
        isFeatured: true,
        isTrending: true,
        isActive: true,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} sample products seeded`);

    console.log('\n🎉 Catalog seeded successfully.');
    console.log('   To create an admin account, set ADMIN_EMAIL and ADMIN_PASSWORD in .env, then run: npm run seed:admin\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('💥 Catalog data destroyed (users were not removed).');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

const patchSampleImages = async () => {
  try {
    await connectDB();

    const updates = [
      {
        slug: 'executive-office-chair',
        set: {
          isFeatured: true,
          images: [{
            url: 'https://images.unsplash.com/photo-1580480055273-2289b485ad41?w=800',
            alt: 'Executive Office Chair',
            isPrimary: true,
          }],
        },
      },
    ];

    for (const { slug, set } of updates) {
      const result = await Product.updateOne({ slug }, { $set: set });
      if (result.matchedCount) {
        console.log(`✅ Updated product: ${slug}`);
      } else {
        console.log(`⚠️  Product not found (skipped): ${slug}`);
      }
    }

    console.log('\n🎉 Sample product patch complete.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Patch error:', err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else if (process.argv[2] === '--patch') patchSampleImages();
else importData();
