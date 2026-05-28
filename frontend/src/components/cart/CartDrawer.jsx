import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { closeCart, updateCartItem, removeFromCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { buildWhatsAppLink, cartWhatsAppMessage } from '../../utils/whatsapp';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { cart, isOpen } = useSelector((state) => state.cart);
  const items = cart?.items || [];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFree = subtotal >= 50000;
  const shipping = shippingFree ? 0 : 500;

  const handleWhatsAppOrder = () => {
    dispatch(closeCart());
    const msg = cartWhatsAppMessage(items, subtotal, shipping);
    window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ itemId, quantity })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update cart');
    }
  };

  const handleRemove = async (itemId, name) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success(`${name} removed from cart`);
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-[56] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Your cart is empty</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Add some beautiful furniture!</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeCart())}
                    className="btn-primary mt-6 inline-flex"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <Link
                      to={`/product/${item.product?._id || item.product}`}
                      onClick={() => dispatch(closeCart())}
                      className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                    >
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h4>
                      {item.color && (
                        <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {item.color}
                        </p>
                      )}
                      <p className="font-bold text-primary-800 dark:text-primary-300 text-sm">
                        Rs. {Math.round(item.price).toLocaleString()}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-700 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item._id, item.name)}
                          className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4">
                {/* Shipping */}
                {!shippingFree && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <span>🚚</span>
                    <span>Add Rs. {(50000 - subtotal).toLocaleString()} more for free delivery!</span>
                  </div>
                )}
                {shippingFree && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <span>🎉</span>
                    <span>You've unlocked FREE delivery!</span>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>Rs. {Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Delivery</span>
                    <span className={shippingFree ? 'text-green-600 dark:text-green-400' : ''}>
                      {shippingFree ? 'FREE' : `Rs. ${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-2">
                    <span>Total</span>
                    <span className="text-primary-800 dark:text-primary-300 text-lg">
                      Rs. {Math.round(subtotal + shipping).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-2xl transition-colors shadow-lg text-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order via WhatsApp
                  </button>
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCart())}
                    className="btn-secondary w-full text-center text-sm py-2.5"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
