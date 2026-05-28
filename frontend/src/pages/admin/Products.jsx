import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Package, AlertTriangle, X, Upload, Star } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', discount: '0',
    category: '', materials: '', tags: '', isFeatured: false, isBestSeller: false,
    isNewArrival: false, isTrending: false, brand: 'Anura Furniture',
    warranty: '1 year', deliveryEstimate: '3-7 business days',
  });
  const [saving, setSaving] = useState(false);
  const [imageUrls, setImageUrls] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(search && { keyword: search }) }).toString();
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  const openAddForm = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', discount: '0', category: categories[0]?._id || '', materials: '', tags: '', isFeatured: false, isBestSeller: false, isNewArrival: false, isTrending: false, brand: 'Anura Furniture', warranty: '1 year', deliveryEstimate: '3-7 business days' });
    setImageUrls('');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name, description: product.description, price: product.price,
      stock: product.stock, discount: product.discount || 0, category: product.category?._id || '',
      materials: product.materials?.join(', ') || '', tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured, isBestSeller: product.isBestSeller,
      isNewArrival: product.isNewArrival, isTrending: product.isTrending,
      brand: product.brand, warranty: product.warranty, deliveryEstimate: product.deliveryEstimate,
    });
    setImageUrls(product.images?.map(i => i.url).join('\n') || '');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const urls = imageUrls.split('\n').filter(u => u.trim());
      const images = urls.map((url, i) => ({ url: url.trim(), alt: formData.name, isPrimary: i === 0 }));

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()).filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        ...(images.length > 0 && { images }),
      };

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Helmet><title>Products – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Products <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
          <button onClick={openAddForm} className="btn-primary text-sm py-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? Array(5).fill(null).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(null).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-800 rounded skeleton" /></td>
                    ))}
                  </tr>
                )) : products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400 m-2.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate max-w-xs">{product.name}</p>
                          <p className="text-gray-500 text-xs">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{product.category?.name || '–'}</td>
                    <td className="px-4 py-4">
                      <p className="text-white text-sm font-semibold">Rs. {product.price?.toLocaleString()}</p>
                      {product.discount > 0 && <p className="text-red-400 text-xs">{product.discount}% off</p>}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge text-xs ${product.stock === 0 ? 'bg-red-900/30 text-red-400' : product.stock <= 5 ? 'bg-orange-900/30 text-orange-400' : 'bg-green-900/30 text-green-400'}`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Low: ${product.stock}` : `${product.stock} in stock`}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.isFeatured && <span className="badge bg-primary-900/30 text-primary-400 text-xs">Featured</span>}
                        {product.isBestSeller && <span className="badge bg-gold-900/30 text-gold-400 text-xs">Best Seller</span>}
                        {product.isNewArrival && <span className="badge bg-green-900/30 text-green-400 text-xs">New</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditForm(product)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <a href={`/product/${product.slug || product._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-cyan-400 rounded-lg hover:bg-gray-700 transition-colors">
                          <Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => handleDelete(product._id, product.name)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-white font-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSave} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm mb-1.5 block">Product Name *</label>
                    <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Premium L-Shaped Sofa" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Price (Rs.) *</label>
                    <input type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} required min="0" placeholder="95000" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Stock *</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData(p => ({ ...p, stock: e.target.value }))} required min="0" placeholder="10" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Discount (%)</label>
                    <input type="number" value={formData.discount} onChange={(e) => setFormData(p => ({ ...p, discount: e.target.value }))} min="0" max="100" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Category *</label>
                    <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} required className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm mb-1.5 block">Description *</label>
                    <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required rows={4} placeholder="Detailed product description..." className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 resize-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm mb-1.5 block">Image URLs (one per line)</label>
                    <textarea value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} rows={3} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 resize-none font-mono text-xs" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Materials (comma-separated)</label>
                    <input value={formData.materials} onChange={(e) => setFormData(p => ({ ...p, materials: e.target.value }))} placeholder="Wood, Fabric, Metal" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-1.5 block">Tags (comma-separated)</label>
                    <input value={formData.tags} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))} placeholder="sofa, modern, living-room" className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-300 text-sm mb-2 block">Flags</label>
                    <div className="flex flex-wrap gap-3">
                      {[['isFeatured', 'Featured'], ['isBestSeller', 'Best Seller'], ['isNewArrival', 'New Arrival'], ['isTrending', 'Trending']].map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData[key]} onChange={(e) => setFormData(p => ({ ...p, [key]: e.target.checked }))} className="rounded" />
                          <span className="text-gray-300 text-sm">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
