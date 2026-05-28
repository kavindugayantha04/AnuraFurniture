import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', subtitle: '', position: 'hero', link: '', buttonText: 'Shop Now', isActive: true, image: { url: '' } });
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/banners');
      setBanners(data.banners);
    } catch (err) { toast.error('Failed to fetch'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/banners', formData);
      toast.success('Banner created!');
      setShowForm(false);
      setFormData({ title: '', subtitle: '', position: 'hero', link: '', buttonText: 'Shop Now', isActive: true, image: { url: '' } });
      fetchBanners();
    } catch (err) { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner._id}`, { isActive: !banner.isActive });
      toast.success(`Banner ${banner.isActive ? 'hidden' : 'shown'}`);
      fetchBanners();
    } catch (err) { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Deleted'); fetchBanners(); }
    catch (err) { toast.error('Delete failed'); }
  };

  return (
    <>
      <Helmet><title>Banners – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Banners</h1>
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" /> Add Banner</button>
        </div>
        <div className="grid gap-4">
          {loading ? Array(3).fill(null).map((_, i) => <div key={i} className="h-24 bg-gray-800 rounded-2xl skeleton" />) :
            banners.map((banner) => (
              <div key={banner._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                {banner.image?.url && <img src={banner.image.url} alt="" className="w-24 h-16 rounded-xl object-cover bg-gray-700 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{banner.title}</p>
                  {banner.subtitle && <p className="text-gray-400 text-sm">{banner.subtitle}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge text-xs bg-primary-900/30 text-primary-400 capitalize">{banner.position}</span>
                    <span className={`badge text-xs ${banner.isActive ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'}`}>{banner.isActive ? 'Active' : 'Hidden'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(banner)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">{banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  <button onClick={() => handleDelete(banner._id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
        </div>
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md">
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-white font-bold">Add Banner</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div><label className="text-gray-300 text-sm mb-1.5 block">Title *</label><input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div><label className="text-gray-300 text-sm mb-1.5 block">Subtitle</label><input value={formData.subtitle} onChange={(e) => setFormData(p => ({ ...p, subtitle: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div><label className="text-gray-300 text-sm mb-1.5 block">Image URL</label><input value={formData.image.url} onChange={(e) => setFormData(p => ({ ...p, image: { url: e.target.value } }))} placeholder="https://..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Position</label><select value={formData.position} onChange={(e) => setFormData(p => ({ ...p, position: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500"><option value="hero">Hero</option><option value="homepage">Homepage</option><option value="shop">Shop</option><option value="popup">Popup</option></select></div>
                  <div><label className="text-gray-300 text-sm mb-1.5 block">Button Text</label><input value={formData.buttonText} onChange={(e) => setFormData(p => ({ ...p, buttonText: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                </div>
                <div><label className="text-gray-300 text-sm mb-1.5 block">Link URL</label><input value={formData.link} onChange={(e) => setFormData(p => ({ ...p, link: e.target.value }))} placeholder="/shop" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" /></div>
                <div className="flex gap-3"><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-700 rounded-xl text-gray-300 text-sm">Cancel</button><button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">{saving ? 'Creating...' : 'Create Banner'}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
