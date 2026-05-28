import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, X, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ code: '', type: 'percentage', value: '', minOrderAmount: '0', usageLimit: '', validUntil: '', isActive: true, description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data.coupons);
    } catch (err) { toast.error('Failed to fetch coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/coupons', { ...formData, value: Number(formData.value), minOrderAmount: Number(formData.minOrderAmount), usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null });
      toast.success('Coupon created!');
      setShowForm(false);
      setFormData({ code: '', type: 'percentage', value: '', minOrderAmount: '0', usageLimit: '', validUntil: '', isActive: true, description: '' });
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await api.delete(`/coupons/${id}`); toast.success('Deleted'); fetchCoupons(); }
    catch (err) { toast.error('Delete failed'); }
  };

  return (
    <>
      <Helmet><title>Coupons – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Create Coupon</button>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-800">{['Code', 'Type', 'Value', 'Min Order', 'Used', 'Valid Until', 'Status', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? Array(3).fill(null).map((_, i) => <tr key={i}>{Array(8).fill(null).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-800 rounded skeleton" /></td>)}</tr>) :
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4"><span className="text-white font-mono font-bold">{coupon.code}</span></td>
                    <td className="px-4 py-4 text-gray-300 text-sm capitalize">{coupon.type}</td>
                    <td className="px-4 py-4 text-white text-sm font-semibold">{coupon.type === 'percentage' ? `${coupon.value}%` : `Rs. ${coupon.value?.toLocaleString()}`}</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">Rs. {coupon.minOrderAmount?.toLocaleString()}</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{coupon.usedCount} / {coupon.usageLimit || '∞'}</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{new Date(coupon.validUntil).toLocaleDateString()}</td>
                    <td className="px-4 py-4"><span className={`badge text-xs ${coupon.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-4 py-4"><button onClick={() => handleDelete(coupon._id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-white font-bold">Create Coupon</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="text-gray-300 text-sm mb-1.5 block">Coupon Code *</label><input value={formData.code} onChange={(e) => setFormData(p => ({ ...p, code: e.target.value.toUpperCase() }))} required placeholder="SUMMER20" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 font-mono uppercase" /></div>
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Type *</label><select value={formData.type} onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Value *</label><input type="number" value={formData.value} onChange={(e) => setFormData(p => ({ ...p, value: e.target.value }))} required min="0" placeholder={formData.type === 'percentage' ? '10' : '500'} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Min Order (Rs.)</label><input type="number" value={formData.minOrderAmount} onChange={(e) => setFormData(p => ({ ...p, minOrderAmount: e.target.value }))} min="0" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Usage Limit</label><input type="number" value={formData.usageLimit} onChange={(e) => setFormData(p => ({ ...p, usageLimit: e.target.value }))} min="1" placeholder="Unlimited" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                  <div className="col-span-2"><label className="text-gray-300 text-sm mb-1.5 block">Valid Until *</label><input type="date" value={formData.validUntil} onChange={(e) => setFormData(p => ({ ...p, validUntil: e.target.value }))} required min={new Date().toISOString().split('T')[0]} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                </div>
                <div className="flex gap-3"><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-700 rounded-xl text-gray-300 text-sm">Cancel</button><button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">{saving ? 'Creating...' : 'Create Coupon'}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
