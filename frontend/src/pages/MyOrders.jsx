import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchMyOrders } from '../store/slices/orderSlice';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  shipped: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <>
      <Helmet><title>My Orders – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary-700" /> My Orders
          </h1>

          {loading ? (
            <div className="space-y-4">{Array(3).fill(null).map((_, i) => <div key={i} className="h-24 card skeleton" />)}</div>
          ) : orders.length === 0 ? (
            <div className="card p-16 text-center">
              <Package className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">No orders yet</h3>
              <Link to="/shop" className="btn-primary inline-flex mt-4">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-transform block">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary-700 dark:text-primary-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 dark:text-white font-mono">{order.orderNumber}</p>
                      <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} · Rs. {order.totalPrice?.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
