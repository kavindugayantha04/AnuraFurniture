const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  addReview, getRelatedProducts, uploadProductImages, getProductStats,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProduct } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/stats', protect, authorize('admin'), getProductStats);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/reviews', protect, addReview);
router.post('/upload/images', protect, authorize('admin'), uploadProduct.array('images', 10), uploadProductImages);

module.exports = router;
