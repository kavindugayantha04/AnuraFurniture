import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, ArrowRight, Star, ChevronRight, Wand2, ShieldCheck, Truck, Phone, Award } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const HERO_FEATURES = [
  { icon: ShieldCheck, text: '5 Year Warranty' },
  { icon: Truck, text: 'Free Delivery' },
  { icon: Award, text: 'Premium Quality' },
  { icon: Phone, text: '24/7 Support' },
];

const TESTIMONIALS = [
  { name: 'Kavindu Perera', location: 'Colombo', rating: 5, text: 'Absolutely stunning furniture! The quality exceeded my expectations. My living room looks like a magazine shoot now.' },
  { name: 'Nadeesha Silva', location: 'Kandy', rating: 5, text: 'Best furniture store in Sri Lanka. The custom order process was seamless and the delivery was on time.' },
  { name: 'Amal Fernando', location: 'Galle', rating: 5, text: 'The AI room designer helped me visualize exactly what I wanted. Amazing experience from start to finish!' },
];

export default function Home() {
  const dispatch = useDispatch();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  const { products, categories, loading } = useSelector(s => s.products);
  const featured = products?.filter(p => p.isFeatured)?.slice(0, 4) || products?.slice(0, 4) || [];
  const trending = products?.filter(p => p.isTrending)?.slice(0, 4) || products?.slice(4, 8) || [];
  const newArrivals = products?.filter(p => p.isNewArrival)?.slice(0, 4) || products?.slice(8, 12) || [];

  useEffect(() => {
    dispatch(fetchProducts({ limit: 16 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Anura Furniture – Dekatana | Furniture කලාවේ මහ ගෙදර</title>
        <meta name="description" content="Discover premium, modern furniture at Anura Furniture Dekatana. Shop living room, bedroom, dining furniture with AI-powered recommendations and free delivery across Sri Lanka." />
      </Helmet>

      {/* ========================== HERO ========================== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary-900/80 to-gray-900" />
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1920"
            alt="Luxury furniture"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        </motion.div>

        {/* Floating blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-32">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/25 text-white font-medium text-sm rounded-full mb-6 backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-cyan-300" /> AI-Powered Furniture Experience
            </span>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
              <span className="text-gradient-bright">Furniture</span>
              <br />
              <span className="text-white">කලාවේ</span>{' '}
              <span className="text-gradient-bright">මහ ගෙදර</span>
            </h1>

            <p className="text-gray-200 text-lg sm:text-xl mb-8 max-w-2xl mx-auto drop-shadow">
              Transform your space with Sri Lanka's most premium furniture collection. Crafted with artistry, delivered with care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/shop" className="btn-primary text-base px-8 py-4 shadow-glow">
                Explore Collection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/ai-room-designer" className="flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-2xl hover:bg-white/10 transition-all text-base font-semibold">
                <Wand2 className="w-5 h-5" /> Try AI Room Designer
              </Link>
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6">
              {HERO_FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-gray-300 text-sm">
                  <Icon className="w-4 h-4 text-primary-400" /> {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </motion.div>
      </section>

      {/* ========================== CATEGORIES ========================== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">Explore our curated furniture collections for every space</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories?.length > 0 ? categories : [
              { _id: '1', name: 'Living Room', icon: '🛋️', slug: 'living-room' },
              { _id: '2', name: 'Bedroom', icon: '🛏️', slug: 'bedroom' },
              { _id: '3', name: 'Dining Room', icon: '🍽️', slug: 'dining-room' },
              { _id: '4', name: 'Office', icon: '💼', slug: 'office' },
              { _id: '5', name: 'Outdoor', icon: '🌿', slug: 'outdoor' },
              { _id: '6', name: 'Kids Room', icon: '🧸', slug: 'kids-room' },
            ]).slice(0, 6).map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/shop?category=${cat.slug || cat._id}`}
                  className="block card p-5 text-center hover:-translate-y-1 transition-transform group">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-2xl mx-auto mb-3">
                    {cat.icon || '🪑'}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary-700 transition-colors">{cat.name}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== AI BANNER ========================== */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-700 to-cyan-600 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full mb-3">
                  <Sparkles className="w-3 h-3" /> Powered by GPT-4o
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-2">AI Furniture Advisor</h3>
                <p className="text-white/70 mb-4 max-w-lg">Tell us your style, budget, and room size – our AI will handpick the perfect furniture just for you.</p>
                <Link to="/ai-recommendations" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-800 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  Get AI Recommendations <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="text-7xl sm:text-8xl animate-float">🤖</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================== FEATURED PRODUCTS ========================== */}
      {featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">Featured Collection</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked premium pieces</p>
              </motion.div>
              <Link to="/shop?featured=true" className="flex items-center gap-1 text-primary-700 dark:text-primary-400 font-medium hover:gap-2 transition-all text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========================== TRENDING ========================== */}
      {trending.length > 0 && (
        <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">🔥 Trending Now</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Most loved by our customers</p>
              </motion.div>
              <Link to="/shop?trending=true" className="flex items-center gap-1 text-primary-700 dark:text-primary-400 font-medium hover:gap-2 transition-all text-sm">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========================== STATS ========================== */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '5,000+', label: 'Happy Customers', emoji: '😊' },
              { value: '500+', label: 'Products Available', emoji: '🛋️' },
              { value: '15+', label: 'Years of Excellence', emoji: '🏆' },
              { value: '99%', label: 'Satisfaction Rate', emoji: '⭐' },
            ].map(({ value, label, emoji }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 text-center">
                <span className="text-3xl mb-2 block">{emoji}</span>
                <p className="font-display font-black text-3xl text-primary-800 dark:text-primary-400 mb-1">{value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== NEW ARRIVALS ========================== */}
      {newArrivals.length > 0 && (
        <section className="py-16 px-4 bg-gray-50/50 dark:bg-gray-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">✨ New Arrivals</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Fresh designs, just in</p>
              </motion.div>
              <Link to="/shop?newArrival=true" className="flex items-center gap-1 text-primary-700 dark:text-primary-400 font-medium text-sm hover:gap-2 transition-all">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* ========================== TESTIMONIALS ========================== */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">What Our Customers Say</h2>
            <p className="text-gray-500 dark:text-gray-400">Join thousands of happy homeowners</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, location, rating, text }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6 hover:-translate-y-1 transition-transform">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-700 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">{name.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">{location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CTA ========================== */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-primary-900 p-10 sm:p-16 text-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920')] bg-cover bg-center" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Design Your Dream Space Today
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                From modern minimalist to classic royal, we have furniture to match every style and budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/shop" className="btn-primary px-8 py-4 text-base">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/custom-order" className="flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white rounded-2xl hover:bg-white/10 transition-all text-base font-semibold">
                  Request Custom Order
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
