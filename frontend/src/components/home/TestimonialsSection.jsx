import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Chathura Perera',
    location: 'Colombo 07',
    avatar: 'CP',
    rating: 5,
    review: 'The sofa set I ordered is absolutely stunning! The quality far exceeded my expectations. Delivery was on time and the installation team was professional. Anura Furniture is truly the best in Sri Lanka!',
    product: 'Premium L-Shaped Sofa Set',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    name: 'Nimali Silva',
    location: 'Kandy',
    avatar: 'NS',
    rating: 5,
    review: 'We furnished our entire home with Anura Furniture and could not be happier! The AI room designer helped us visualize everything before buying. The staff was incredibly helpful and prices are very reasonable.',
    product: 'Complete Bedroom Set',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    name: 'Ruwan Fernando',
    location: 'Negombo',
    avatar: 'RF',
    rating: 5,
    review: 'Ordered a custom dining table for our villa. The craftsmanship is exceptional – every detail is perfect. The team was responsive and the delivery was faster than expected. Highly recommended!',
    product: 'Custom Teak Dining Table',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 4,
    name: 'Ayesha Jayawardena',
    location: 'Galle',
    avatar: 'AJ',
    rating: 5,
    review: 'Amazing experience from start to finish! The website is so easy to use and the AI chatbot helped me find exactly what I needed. The furniture arrived perfectly packed and looks even better in person.',
    product: 'Modern Bedroom Suite',
    color: 'from-teal-500 to-cyan-600',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="badge-gold mb-4">Testimonials</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle mx-auto">Real stories from real Sri Lankan families</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="card p-8 md:p-12 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${testimonials[current].color}`} />
              <Quote className="w-12 h-12 text-primary-100 dark:text-primary-900 mb-6" />

              <div className="flex mb-4">
                {Array(testimonials[current].rating).fill(null).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8 italic">
                "{testimonials[current].review}"
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-white font-bold`}>
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{testimonials[current].name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonials[current].location}</p>
                  </div>
                </div>
                <span className="badge-primary text-xs">{testimonials[current].product}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-primary-700 w-6' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
