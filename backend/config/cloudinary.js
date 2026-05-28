const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'anura-furniture/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
  },
});

const roomStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'anura-furniture/rooms',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }],
  },
});

const customOrderStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'anura-furniture/custom-orders',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
});

const uploadProduct = multer({ storage: productStorage });
const uploadRoom = multer({ storage: roomStorage });
const uploadCustomOrder = multer({ storage: customOrderStorage });

module.exports = { cloudinary, uploadProduct, uploadRoom, uploadCustomOrder };
