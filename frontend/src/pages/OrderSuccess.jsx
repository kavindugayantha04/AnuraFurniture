import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ArrowRight, Home, ClipboardList } from 'lucide-react';
import { fetchOrder } from '../store/slices/orderSlice';

export default function OrderSuccess() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orders);

  useEffect(() => { if (id) dispatch(fetchOrder(id)); }, [id, dispatch]);

  return (
    <>
      <Helmet><title>Order Confirmed – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 flex items-center justify-center px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for shopping with Anura Furniture! Your order has been placed successfully.
          </p>

          {order && (
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-4 mb-6 space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Order Number</span>
                <span className="font-mono font-bold text-primary-800 dark:text-primary-300">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Amount</span>
                <span className="font-bold text-gray-900 dark:text-white">Rs. {order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Payment</span>
                <span className="text-gray-700 dark:text-gray-300">Cash on delivery</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Est. Delivery</span>
                <span className="text-gray-700 dark:text-gray-300">3-7 business days</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-6">
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              📧 A confirmation email has been sent to your email address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/orders/${id}`} className="btn-primary flex-1 justify-center">
              <ClipboardList className="w-4 h-4" /> Track Order
            </Link>
            <Link to="/" className="btn-secondary flex-1 justify-center">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>

          <Link to="/shop" className="mt-4 text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center justify-center gap-1">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </>
  );
}
