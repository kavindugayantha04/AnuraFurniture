import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', nameSI: '', description: '', isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (err) { toast.error('Failed to fetch categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openForm = (cat = null) => {
    setEditCat(cat);
    setFormData(cat ? { name: cat.name, nameSI: cat.nameSI || '', description: cat.description || '', isActive: cat.isActive } : { name: '', nameSI: '', description: '', isActive: true });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, formData);
        toast.success('Category updated!');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created!');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) { toast.error('Delete failed'); }
  };

  return (
    <>
      <Helmet><title>Categories – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <button onClick={() => openForm()} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Add Category</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? Array(6).fill(null).map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-2xl skeleton" />) :
            categories.map((cat) => (
              <div key={cat._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{cat.name}</p>
                  {cat.nameSI && <p className="text-gray-400 text-sm">{cat.nameSI}</p>}
                  <span className={`badge text-xs mt-1 ${cat.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{cat.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openForm(cat)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))
          }
        </div>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-white font-bold">{editCat ? 'Edit Category' : 'Add Category'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div><label className="text-gray-300 text-sm mb-1.5 block">Name (English) *</label><input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div><label className="text-gray-300 text-sm mb-1.5 block">Name (Sinhala)</label><input value={formData.nameSI} onChange={(e) => setFormData(p => ({ ...p, nameSI: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div><label className="text-gray-300 text-sm mb-1.5 block">Description</label><textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 resize-none" /></div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(p => ({ ...p, isActive: e.target.checked }))} className="rounded" /><span className="text-gray-300 text-sm">Active</span></label>
                <div className="flex gap-3"><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-700 rounded-xl text-gray-300 text-sm">Cancel</button><button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">{saving ? 'Saving...' : editCat ? 'Update' : 'Create'}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
