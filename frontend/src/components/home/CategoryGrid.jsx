import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const defaultCategories = [
  { name: 'Living Room', slug: 'living-room', emoji: '🛋️', color: 'from-blue-500 to-indigo-600', count: '200+ Items' },
  { name: 'Bedroom', slug: 'bedroom', emoji: '🛏️', color: 'from-purple-500 to-pink-600', count: '150+ Items' },
  { name: 'Dining Room', slug: 'dining-room', emoji: '🍽️', color: 'from-amber-500 to-orange-600', count: '80+ Items' },
  { name: 'Office', slug: 'office', emoji: '💼', color: 'from-teal-500 to-cyan-600', count: '120+ Items' },
  { name: 'Outdoor', slug: 'outdoor', emoji: '🌿', color: 'from-green-500 to-emerald-600', count: '60+ Items' },
  { name: 'Storage', slug: 'storage', emoji: '📦', color: 'from-rose-500 to-red-600', count: '90+ Items' },
];

export default function CategoryGrid() {
  const { categories } = useSelector((state) => state.products);
  const displayCategories = categories.length > 0 ? categories.slice(0, 6) : defaultCategories;

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge-primary mb-4">Categories</span>
          <h2 className="section-title">Shop by Room</h2>
          <p className="section-subtitle mx-auto">Find the perfect furniture for every space in your home</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((cat, i) => {
            const isDefault = !cat._id;
            const href = `/shop/${cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-')}`;
            const color = cat.color || defaultCategories[i % defaultCategories.length]?.color || 'from-primary-500 to-cyan-500';
            const emoji = cat.emoji || defaultCategories[i % defaultCategories.length]?.emoji || '🪑';
            const count = cat.count || `${Math.floor(Math.random() * 100 + 50)}+ Items`;

            return (
              <motion.div
                key={cat._id || cat.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={href}
                  className="group block text-center"
                >
                  <div className={`relative aspect-square rounded-2xl bg-gradient-to-br ${color} p-6 flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                    {cat.image?.url ? (
                      <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover absolute inset-0 rounded-2xl opacity-60" />
                    ) : (
                      <span className="text-4xl relative z-10 group-hover:scale-110 transition-transform duration-300">
                        {emoji}
                      </span>
                    )}
                    <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{count}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link to="/shop" className="btn-secondary">
            Browse All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
