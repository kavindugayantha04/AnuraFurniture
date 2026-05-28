import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Wand2, Upload, Sparkles, Download, RefreshCw, Camera } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

export default function AIRoomDesigner() {
  const [roomImage, setRoomImage] = useState(null);
  const [roomImageUrl, setRoomImageUrl] = useState('');
  const [roomType, setRoomType] = useState('living');
  const [style, setStyle] = useState('modern');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRoomImage(ev.target.result);
      setRoomImageUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDesign = async () => {
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/design-room', {
        roomImageUrl: roomImageUrl || undefined,
        roomType,
        style,
        prompt: prompt || undefined,
      });
      setResult(data);
    } catch (err) {
      console.error('Design failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Room Designer – Anura Furniture</title>
        <meta name="description" content="Use AI to design your room. Upload a photo and get furniture recommendations." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30">
        <div className="bg-gradient-to-br from-cyan-900 via-primary-900 to-primary-800 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 animate-float">
              <Camera className="w-8 h-8 text-cyan-300" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">AI Room Designer</h1>
            <p className="text-blue-200 text-lg">Upload your room photo and let AI suggest the perfect furniture arrangement</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Upload Room Photo (Optional)</h3>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden cursor-pointer hover:border-primary-400 transition-colors aspect-video flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 group"
                >
                  {roomImage ? (
                    <img src={roomImage} alt="Room" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3 group-hover:text-primary-500 transition-colors" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload your room photo</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                {roomImage && (
                  <button onClick={() => { setRoomImage(null); setRoomImageUrl(''); }} className="mt-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400">
                    Remove image
                  </button>
                )}
              </div>

              {/* Settings */}
              <div className="card p-6 space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Design Preferences</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Type</label>
                  <select value={roomType} onChange={(e) => setRoomType(e.target.value)} className="input-field">
                    {['living', 'bedroom', 'dining', 'office', 'outdoor', 'kitchen'].map(r => (
                      <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)} Room</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interior Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['modern', 'classic', 'minimalist', 'rustic', 'scandinavian', 'luxury'].map((s) => (
                      <button key={s}
                        onClick={() => setStyle(s)}
                        className={`py-2 rounded-xl text-xs capitalize transition-all border ${style === s ? 'bg-primary-800 text-white border-primary-800' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Instructions (Optional)</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. I have a small space, need storage solutions, prefer neutral colors..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <button onClick={handleDesign} disabled={loading} className="w-full btn-primary py-4 text-base justify-center">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing & Designing...</>
                  ) : (
                    <><Wand2 className="w-5 h-5" /> Generate Design Suggestions</>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div>
              {loading && (
                <div className="card p-12 text-center h-full flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6"
                  >
                    <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </motion.div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">AI is analyzing your room...</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">This may take a few seconds</p>
                </div>
              )}

              {!loading && !result && (
                <div className="card p-12 text-center h-full flex flex-col items-center justify-center min-h-64">
                  <span className="text-5xl mb-4">🏠</span>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Your AI design suggestions will appear here</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Upload a photo or just set your preferences and click Generate</p>
                </div>
              )}

              {!loading && result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* AI Design Text */}
                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white">AI Design Analysis</h3>
                    </div>
                    <div className="prose dark:prose-invert text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {result.design}
                    </div>
                  </div>

                  {/* Suggested Products */}
                  {result.suggestedProducts?.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">🛋️ Recommended Products for This Room</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {result.suggestedProducts.map((p) => (
                          <ProductCard key={p._id} product={p} />
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => setResult(null)} className="btn-secondary w-full justify-center">
                    <RefreshCw className="w-4 h-4" /> Design Again
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
