import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Eye, ChevronDown, X, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  confirmed: 'bg-blue-900/30 text-blue-400',
  processing: 'bg-indigo-900/30 text-indigo-400',
  shipped: 'bg-cyan-900/30 text-cyan-400',
  delivered: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
  refunded: 'bg-gray-700 text-gray-300',
};

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(status && { status }) }).toString();
      const { data } = await api.get(`/orders?${params}`);
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, status]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedOrder) return;
    setUpdating(true);
    try {
      await api.put(`/orders/${selectedOrder._id}/status`, { status: newStatus, note });
      toast.success('Order status updated!');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Helmet><title>Orders – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Orders <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {['', ...STATUSES].map((s) => (
            <button key={s || 'all'} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                status === s ? 'bg-primary-700 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? Array(5).fill(null).map((_, i) => (
                  <tr key={i}>{Array(8).fill(null).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-800 rounded skeleton" /></td>)}</tr>
                )) : orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-white text-sm font-mono">{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white text-sm">{order.user?.name || 'Guest'}</p>
                      <p className="text-gray-500 text-xs">{order.user?.phone}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-4">
                      <p className="text-white text-sm font-semibold">Rs. {order.totalPrice?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge text-xs ${order.isPaid ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-300'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-LK')}
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); setNote(''); }}
                        className="p-1.5 text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                  <div>
                    <h3 className="text-white font-bold">Order {selectedOrder.orderNumber}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Items */}
                  <div>
                    <h4 className="text-gray-300 text-sm font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                          <img src={item.image || '/placeholder.png'} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-700" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.name}</p>
                            <p className="text-gray-400 text-xs">Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                          </div>
                          <p className="text-white text-sm font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1.5 border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>Rs. {selectedOrder.subtotal?.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm text-gray-400"><span>Delivery</span><span>{selectedOrder.shippingPrice === 0 ? 'Free' : `Rs. ${selectedOrder.shippingPrice}`}</span></div>
                    {selectedOrder.couponDiscount > 0 && <div className="flex justify-between text-sm text-green-400"><span>Discount</span><span>-Rs. {selectedOrder.couponDiscount?.toLocaleString()}</span></div>}
                    <div className="flex justify-between font-bold text-white border-t border-gray-800 pt-1.5"><span>Total</span><span>Rs. {selectedOrder.totalPrice?.toLocaleString()}</span></div>
                  </div>

                  {/* Update Status */}
                  <div className="space-y-3 border-t border-gray-800 pt-4">
                    <h4 className="text-gray-300 text-sm font-semibold">Update Status</h4>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500">
                      {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note (optional)"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                    <button onClick={handleUpdateStatus} disabled={updating} className="w-full btn-primary py-2.5 text-sm">
                      {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Update Status'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
