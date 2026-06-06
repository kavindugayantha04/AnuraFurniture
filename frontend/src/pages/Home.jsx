import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles, ArrowRight, Star, ChevronRight, Wand2,
  ShieldCheck, Truck, Phone, Award, Boxes, MoveRight,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const HERO_FEATURES = [
  { icon: ShieldCheck, text: '5 Year Warranty' },
  { icon: Truck, text: 'Free Delivery' },
  { icon: Award, text: 'Premium Quality' },
  { icon: Phone, text: '24/7 Support' },
];

const MARQUEE_ITEMS = [
  '✦ Handcrafted in Sri Lanka',
  '✦ Free Island-wide Delivery',
  '✦ 5 Year Warranty',
  '✦ AI Room Designer',
  '✦ Custom Furniture Orders',
  '✦ Premium Solid Wood',
];

const CATEGORY_FALLBACK = [
  { _id: '1', name: 'Living Room', slug: 'living-room', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800' },
  { _id: '2', name: 'Bedroom', slug: 'bedroom', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800' },
  { _id: '3', name: 'Dining Room', slug: 'dining-room', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800' },
  { _id: '4', name: 'Office', slug: 'office', img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800' },
  { _id: '5', name: 'Outdoor', slug: 'outdoor', img: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=800' },
  { _id: '6', name: 'Kids Room', slug: 'kids-room', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800' },
];

const SHOWCASE_TAGS = [
  { label: 'Velvet Sofa', price: 'Rs. 145,000', pos: 'top-[12%] left-[6%]' },
  { label: 'Oak Coffee Table', price: 'Rs. 38,500', pos: 'bottom-[26%] left-[10%]' },
  { label: 'Floor Lamp', price: 'Rs. 12,900', pos: 'top-[22%] right-[8%]' },
];

const TESTIMONIALS = [
  { name: 'Kavindu Perera', location: 'Colombo', rating: 5, text: 'Absolutely stunning furniture! The quality exceeded my expectations. My living room looks like a magazine shoot now.' },
  { name: 'Nadeesha Silva', location: 'Kandy', rating: 5, text: 'Best furniture store in Sri Lanka. The custom order process was seamless and the delivery was on time.' },
  { name: 'Amal Fernando', location: 'Galle', rating: 5, text: 'The AI room designer helped me visualize exactly what I wanted. Amazing experience from start to finish!' },
];

function HeroImageStack() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 });

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative w-full max-w-md mx-auto h-[24rem] sm:h-[28rem] lg:h-[30rem] [perspective:1600px]"
    >
      {/* Decorative offset color panel + glow behind the image */}
      <div className="absolute right-0 bottom-3 w-[78%] h-[80%] rounded-[2.5rem] bg-gradient-to-br from-primary-600 to-cyan-500 shadow-2xl shadow-primary-600/30" />
      <div className="absolute -left-6 -top-6 w-32 h-32 bg-dots text-primary-400/30 rounded-full" />
      <div className="absolute -right-3 top-2 w-20 h-20 rounded-full border-[5px] border-gold-300/50" />

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative w-full h-full">
        {/* Main image with asymmetric, creative frame */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{ transform: 'translateZ(45px)' }}
          className="group absolute left-0 top-0 w-[82%] h-[86%] rounded-[2rem] rounded-br-[4.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 bg-white"
        >
          <img
            src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1000&auto=format&fit=crop"
            alt="Elegant modern living room with premium furniture"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/35 via-transparent to-transparent" />
        </motion.div>

        {/* Floating product price chip (bottom-left of image) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(95px)' }}
          className="absolute -left-3 bottom-12 flex items-center gap-3 p-2 pr-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-2xl"
        >
          <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=200&auto=format&fit=crop" alt="Accent chair" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-1">Best Seller</p>
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">Velvet Accent Chair</p>
            <p className="text-[11px] font-semibold text-primary-700 dark:text-cyan-300 mt-1">Rs. 24,900</p>
          </div>
        </motion.div>

        {/* Floating rating card (bottom-right, over the color panel) */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.8 }}
          style={{ transform: 'translateZ(110px)' }}
          className="absolute right-2 bottom-6 px-4 py-3 rounded-2xl bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />)}
          </div>
          <p className="text-gray-900 dark:text-white text-sm font-extrabold leading-none">4.9 / 5.0</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">5,000+ happy homes</p>
        </motion.div>

        {/* Floating free-delivery pill (top-right) */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.4 }}
          style={{ transform: 'translateZ(120px)' }}
          className="absolute right-3 top-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
        >
          <span className="grid place-items-center w-6 h-6 rounded-full bg-gradient-to-br from-primary-600 to-cyan-500 text-white">
            <Truck className="w-3.5 h-3.5" />
          </span>
          <span className="text-[11px] font-bold pr-1">Free Delivery</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const { products, categories } = useSelector(s => s.products);
  const featured = products?.filter(p => p.isFeatured)?.slice(0, 4) || products?.slice(0, 4) || [];
  const trending = products?.filter(p => p.isTrending)?.slice(0, 4) || products?.slice(4, 8) || [];
  const newArrivals = products?.filter(p => p.isNewArrival)?.slice(0, 4) || products?.slice(8, 12) || [];

  const cats = (categories?.length > 0
    ? categories.slice(0, 6).map((c, i) => ({ ...c, img: c.image || c.img || CATEGORY_FALLBACK[i]?.img }))
    : CATEGORY_FALLBACK);

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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-primary-50/50 to-cyan-50/40 dark:from-dark-bg dark:via-primary-950 dark:to-gray-950">
        {/* Animated decorative blue blobs */}
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-primary-300/40 dark:bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-cyan-300/40 dark:bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute inset-0 bg-dots text-primary-900/[0.04] dark:text-white/[0.04]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-white/10 border border-primary-100 dark:border-white/25 text-primary-700 dark:text-white font-medium text-sm rounded-full mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-cyan-500" /> AI-Powered Furniture Experience
              </span>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-5 leading-[1.05]">
                <span className="text-gradient">Furniture</span>
                <br />
                <span className="text-gray-900 dark:text-white">කලාවේ</span>{' '}
                <span className="text-gradient">මහ ගෙදර</span>
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-8 max-w-xl">
                Transform your space with Sri Lanka's most premium furniture collection. Crafted with artistry, delivered with care.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link to="/shop" className="btn-primary text-base px-8 py-4 shadow-glow">
                  Explore Collection <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/ai-room-designer" className="btn-secondary text-base px-8 py-4">
                  <Wand2 className="w-5 h-5" /> Try AI Room Designer
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex -space-x-3">
                  {['from-primary-500 to-cyan-500', 'from-cyan-500 to-primary-600', 'from-gold-400 to-gold-600', 'from-primary-700 to-primary-500'].map((g, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} ring-2 ring-white dark:ring-dark-bg`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Loved by <span className="font-semibold text-gray-900 dark:text-white">5,000+</span> families</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                {HERO_FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <Icon className="w-4 h-4 text-primary-600 dark:text-cyan-400" /> {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: 3D image stack */}
            <HeroImageStack />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-10 border-2 border-primary-300/70 dark:border-white/30 rounded-full items-start justify-center pt-1.5 hidden sm:flex">
          <div className="w-1.5 h-3 bg-primary-400/80 dark:bg-white/60 rounded-full" />
        </motion.div>
      </section>

      {/* ========================== MARQUEE STRIP ========================== */}
      <div className="bg-primary-900 dark:bg-primary-950 py-4 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-white/70 font-medium text-sm tracking-wide flex-shrink-0">{item}</span>
          ))}
        </motion.div>
      </div>

      {/* ========================== CATEGORIES ========================== */}
      <section className="py-20 px-4 bg-mesh-light">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge-cyan mb-3">Browse</span>
            <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">Explore our curated furniture collections for every space</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cats.map((cat, i) => (
              <motion.div key={cat._id || i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/shop?category=${cat.slug || cat._id}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <img src={cat.img} alt={cat.name} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-white font-semibold text-sm drop-shadow">{cat.name}</p>
                    <span className="flex items-center gap-1 text-cyan-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop now <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== 3D ROOM SHOWCASE ========================== */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="badge-primary mb-3"><Boxes className="w-3 h-3 mr-1" /> Visualise in 3D</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              See it in your room <span className="text-gradient">before you buy</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg">
              Upload a photo of your space and our AI Room Designer places real furniture into it — explore layouts, colours and styles in lifelike detail.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ai-room-designer" className="btn-primary px-7 py-3.5">
                Launch Room Designer <Wand2 className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="btn-secondary px-7 py-3.5">
                Browse Furniture <MoveRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ rotateY: -6, rotateX: 4 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="relative [perspective:1200px]"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10" style={{ transformStyle: 'preserve-3d' }}>
              <img
                src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200"
                alt="Designed living room"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />

              {SHOWCASE_TAGS.map((tag, i) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.2 }}
                  className={`absolute ${tag.pos} px-3 py-2 rounded-xl bg-white/85 dark:bg-gray-900/85 backdrop-blur-md shadow-lg border border-white/40`}
                >
                  <p className="text-[11px] font-semibold text-gray-900 dark:text-white leading-none">{tag.label}</p>
                  <p className="text-[10px] text-primary-700 dark:text-cyan-300 mt-0.5">{tag.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================== AI BANNER ========================== */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 via-primary-700 to-cyan-600 p-8 sm:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-spin-slow" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="flex-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full mb-3">
                  <Sparkles className="w-3 h-3" /> Powered by Google Gemini
                </span>
                <h3 className="font-display text-3xl font-bold text-white mb-2">AI Furniture Advisor</h3>
                <p className="text-white/70 mb-4 max-w-lg">Tell us your style, budget, and room size – our AI will handpick the perfect furniture just for you.</p>
                <Link to="/ai-recommendations" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-800 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  Get AI Recommendations <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="text-7xl sm:text-8xl">🤖</motion.div>
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
                whileHover={{ y: -6 }}
                className="card p-6 text-center">
                <span className="text-3xl mb-2 block">{emoji}</span>
                <p className="font-display font-black text-3xl text-gradient mb-1">{value}</p>
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
                whileHover={{ y: -6 }}
                className="card p-6">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />)}
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
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 to-primary-950/70" />
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
