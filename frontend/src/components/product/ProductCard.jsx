import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Star, Eye, GitCompare, Zap } from 'lucide-react';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCompare } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';
import { buildWhatsAppLink, productWhatsAppMessage } from '../../utils/whatsapp';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { ids: wishlistIds } = useSelector((state) => state.wishlist);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isWishlisted = wishlistIds?.includes(product._id);
  const finalPrice = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;
  const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];
  const hoverImage = product.images?.[1];

  const handleBuyWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const msg = productWhatsAppMessage(product, 1);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to save wishlist'); return; }
    try {
      await dispatch(toggleWishlist(product._id)).unwrap();
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCompare(product));
    toast.success('Added to compare list');
  };

  return (
    <div className="product-card group">
      <Link to={`/product/${product.slug || product._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}

          <img
            src={primaryImage?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'}
            alt={primaryImage?.alt || product.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {hoverImage && (
            <img
              src={hoverImage.url}
              alt={`${product.name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-105"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && <span className="badge bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs">New</span>}
            {product.isBestSeller && <span className="badge bg-gradient-to-r from-gold-400 to-gold-600 text-white text-xs">Best Seller</span>}
            {product.isTrending && <span className="badge bg-gradient-to-r from-cyan-400 to-cyan-600 text-white text-xs">Trending</span>}
            {product.discount > 0 && <span className="badge bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs">-{product.discount}%</span>}
            {product.stock === 0 && <span className="badge bg-gray-500 text-white text-xs">Out of Stock</span>}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="badge bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs">Only {product.stock} left!</span>
            )}
          </div>

          {/* Side Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleWishlist}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500'}`}>
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCompare}
              className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-lg hover:bg-primary-50 hover:text-primary-700 transition-colors">
              <GitCompare className="w-4 h-4" />
            </motion.button>
            <Link to={`/product/${product.slug || product._id}`} onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-lg hover:bg-primary-50 hover:text-primary-700 transition-colors">
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* WhatsApp Quick-Buy Overlay */}
          <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleBuyWhatsApp}
              disabled={product.stock === 0}
              className={`w-full py-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Buy via WhatsApp
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <span className="inline-block text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">
            {product.category?.name || 'Furniture'}
          </span>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
            {product.name}
          </h3>

          {product.numReviews > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex">
                {Array(5).fill(null).map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.round(product.ratings) ? 'fill-gold-400 text-gold-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <span className="text-gray-500 text-xs">({product.numReviews})</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="price-tag text-lg">Rs. {Math.round(finalPrice).toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="price-original">Rs. {product.price.toLocaleString()}</span>
            )}
          </div>

          {finalPrice >= 50000 && (
            <p className="text-green-600 dark:text-green-400 text-xs mt-1 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Free delivery included
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
