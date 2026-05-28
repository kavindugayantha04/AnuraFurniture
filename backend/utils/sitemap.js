const Product = require('../models/Product');
const Category = require('../models/Category');

const BASE_URL = process.env.CLIENT_URL || 'https://anurafurniture.lk';

const generateSitemap = async () => {
  const products = await Product.find({ isActive: true }).select('slug updatedAt').lean();
  const categories = await Category.find({ isActive: true }).select('slug updatedAt').lean();

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/shop', priority: '0.9', changefreq: 'daily' },
    { url: '/ai-recommendations', priority: '0.8', changefreq: 'weekly' },
    { url: '/ai-room-designer', priority: '0.8', changefreq: 'weekly' },
    { url: '/custom-order', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  ];

  const productPages = products.map(p => ({
    url: `/product/${p.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: p.updatedAt?.toISOString().split('T')[0],
  }));

  const categoryPages = categories.map(c => ({
    url: `/shop?category=${c.slug}`,
    priority: '0.7',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...productPages, ...categoryPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

module.exports = generateSitemap;
