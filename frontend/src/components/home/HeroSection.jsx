import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Play, Star } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: '✨ AI-Powered Recommendations',
    title: 'Furniture',
    titleHighlight: 'කලාවේ',
    titleEnd: 'මහ ගෙදර',
    subtitle: "Sri Lanka's Premier AI-Powered Furniture Experience",
    desc: 'Discover exquisite furniture crafted for modern Sri Lankan homes. From timeless classics to contemporary masterpieces.',
    primaryCta: { label: 'Explore Collection', href: '/shop' },
    secondaryCta: { label: 'AI Room Designer', href: '/ai-room-designer' },
    accent: 'from-primary-400 via-cyan-300 to-cyan-400',
    bgAccent: 'from-primary-950 via-primary-900 to-slate-900',
  },
  {
    id: 2,
    badge: '🆕 New Arrivals 2024',
    title: 'Transform Your',
    titleHighlight: 'Living Space',
    titleEnd: 'Today',
    subtitle: 'Premium Custom Furniture Orders Available',
    desc: 'Work with our designers to create furniture that perfectly fits your vision, space, and budget.',
    primaryCta: { label: 'Custom Order', href: '/custom-order' },
    secondaryCta: { label: 'View Gallery', href: '/shop' },
    accent: 'from-cyan-300 via-primary-300 to-primary-400',
    bgAccent: 'from-slate-950 via-cyan-950 to-primary-950',
  },
  {
    id: 3,
    badge: '💰 Koko Pay Available',
    title: 'Premium Quality',
    titleHighlight: 'Furniture',
    titleEnd: 'For Every Home',
    subtitle: 'Buy Now, Pay Later with Koko',
    desc: 'Affordable luxury for every Sri Lankan family. Spread payments with Koko and enjoy your dream furniture today.',
    primaryCta: { label: 'Shop Now', href: '/shop' },
    secondaryCta: { label: 'AI Recommendations', href: '/ai-recommendations' },
    accent: 'from-gold-300 via-gold-400 to-cyan-300',
    bgAccent: 'from-primary-950 via-slate-900 to-gray-950',
  },
];

const showcaseImages = [
  { src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80', alt: 'Velvet sofa', label: 'Living Room', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=400&q=80', alt: 'Accent chair', label: 'Seating', span: '' },
  { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80', alt: 'Bedroom', label: 'Bedroom', span: '' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const slide = slides[current];

  return (
    <div className={`relative min-h-screen bg-gradient-to-br ${slide.bgAccent} overflow-hidden flex items-center transition-all duration-1000`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-500/10 to-primary-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500/10 to-gold-500/10 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/30" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-white space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  {slide.badge}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
              >
                {slide.title}{' '}
                <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent`}>
                  {slide.titleHighlight}
                </span>
                {' '}{slide.titleEnd}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-cyan-200 font-medium"
              >
                {slide.subtitle}
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg leading-relaxed max-w-xl"
              >
                {slide.desc}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={slide.primaryCta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-900 font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {slide.primaryCta.label}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to={slide.secondaryCta.href}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  {slide.secondaryCta.label}
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-2"
              >
                <div className="flex -space-x-3">
                  {[12, 32, 45, 68].map((id, i) => (
                    <img
                      key={id}
                      src={`https://i.pravatar.cc/64?img=${id}`}
                      alt="Happy customer"
                      loading="lazy"
                      className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-md"
                      style={{ zIndex: 10 - i }}
                    />
                  ))}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                    15k+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {Array(5).fill(null).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                    ))}
                    <span className="text-white/80 text-sm ml-1">4.9</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5">15,000+ happy customers</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Furniture Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow halo behind the showcase */}
              <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-cyan-500/20 via-primary-500/10 to-transparent blur-2xl" />

              {/* Bento Showcase with real furniture */}
              <div className="relative h-full rounded-[2.5rem] p-3 bg-white/5 backdrop-blur-md border border-white/15 shadow-2xl">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
                  {showcaseImages.map((img, i) => (
                    <motion.div
                      key={img.src}
                      animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
                      transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                      className={`group relative overflow-hidden rounded-2xl ${img.span}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-3 text-white text-xs font-semibold tracking-wide drop-shadow">
                        {img.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-1/4 card p-3 shadow-xl w-44"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Just Ordered!</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Sofa Set<br />Rs. 145,000</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -right-8 bottom-1/4 card p-3 shadow-xl w-44"
              >
                <div className="flex items-center gap-1 mb-1">
                  {Array(5).fill(null).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">"Perfect quality!"</p>
                <p className="text-xs text-gray-400 mt-0.5">– Chathura, Colombo</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrent(i); setIsPlaying(false); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'bg-white w-8' : 'bg-white/30 w-4 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <p className="text-white/50 text-xs">Scroll to explore</p>
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}
