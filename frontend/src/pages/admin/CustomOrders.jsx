import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending: 'text-yellow-400 bg-yellow-900/30', reviewing: 'text-blue-400 bg-blue-900/30', quoted: 'text-purple-400 bg-purple-900/30', approved: 'text-green-400 bg-green-900/30', in_production: 'text-cyan-400 bg-cyan-900/30', completed: 'text-emerald-400 bg-emerald-900/30', cancelled: 'text-red-400 bg-red-900/30' };

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quotation, setQuotation] = useState({ amount: '', details: '', status: '' });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/custom-orders');
      setOrders(data.orders); setTotal(data.total);
    } catch (err) { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/custom-orders/${selectedOrder._id}`, { status: quotation.status, quotation: quotation.amount ? { amount: Number(quotation.amount), details: quotation.details, validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } : undefined });
      toast.success('Updated!'); setSelectedOrder(null); fetchOrders();
    } catch (err) { toast.error('Update failed'); }
  };

  return (
    <>
      <Helmet><title>Custom Orders – Admin</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Custom Orders <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-800">{['Reference', 'Customer', 'Type', 'Budget', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? Array(5).fill(null).map((_, i) => <tr key={i}>{Array(7).fill(null).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-800 rounded skeleton" /></td>)}</tr>) :
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4 text-white font-mono text-sm">{order.reference}</td>
                    <td className="px-4 py-4"><p className="text-white text-sm">{order.name}</p><p className="text-gray-500 text-xs">{order.phone}</p></td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{order.furnitureType}</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{order.budget ? `Rs. ${order.budget.min?.toLocaleString()} – ${order.budget.max?.toLocaleString()}` : '–'}</td>
                    <td className="px-4 py-4"><span className={`badge text-xs capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span></td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4"><button onClick={() => { setSelectedOrder(order); setQuotation({ amount: order.quotation?.amount || '', details: order.quotation?.details || '', status: order.status }); }} className="p-1.5 text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors"><Eye className="w-4 h-4" /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                  <h3 className="text-white font-bold">{selectedOrder.reference}</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-400">Customer</p><p className="text-white font-medium">{selectedOrder.name}</p></div>
                    <div><p className="text-gray-400">Phone</p><p className="text-white">{selectedOrder.phone}</p></div>
                    <div><p className="text-gray-400">Email</p><p className="text-white">{selectedOrder.email}</p></div>
                    <div><p className="text-gray-400">Furniture Type</p><p className="text-white">{selectedOrder.furnitureType}</p></div>
                    <div className="col-span-2"><p className="text-gray-400">Description</p><p className="text-white leading-relaxed">{selectedOrder.description}</p></div>
                    {selectedOrder.dimensions?.length && <div className="col-span-2"><p className="text-gray-400">Dimensions</p><p className="text-white">{selectedOrder.dimensions.length} × {selectedOrder.dimensions.width} × {selectedOrder.dimensions.height} {selectedOrder.dimensions.unit}</p></div>}
                  </div>

                  {selectedOrder.inspirationImages?.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Inspiration Images</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedOrder.inspirationImages.map((img, i) => (
                          <a key={i} href={img.url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img src={img.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-800 pt-4 space-y-3">
                    <h4 className="text-gray-300 font-semibold">Update & Quote</h4>
                    <div><label className="text-gray-400 text-xs mb-1 block">Status</label><select value={quotation.status} onChange={(e) => setQuotation(p => ({ ...p, status: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"><option value="pending">Pending</option><option value="reviewing">Reviewing</option><option value="quoted">Quoted</option><option value="approved">Approved</option><option value="in_production">In Production</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
                    <div><label className="text-gray-400 text-xs mb-1 block">Quotation Amount (Rs.)</label><input type="number" value={quotation.amount} onChange={(e) => setQuotation(p => ({ ...p, amount: e.target.value }))} placeholder="e.g. 150000" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                    <div><label className="text-gray-400 text-xs mb-1 block">Quotation Details</label><textarea value={quotation.details} onChange={(e) => setQuotation(p => ({ ...p, details: e.target.value }))} rows={3} placeholder="Describe what's included in the quote..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 resize-none" /></div>
                    <button onClick={handleUpdate} className="w-full btn-primary py-2.5 text-sm">Update Order</button>
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
