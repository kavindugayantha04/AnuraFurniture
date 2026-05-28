import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: 15000, suffix: '+', label: 'Happy Customers', emoji: '😊' },
  { value: 500, suffix: '+', label: 'Products Available', emoji: '🪑' },
  { value: 14, suffix: ' Years', label: 'Of Excellence', emoji: '🏆' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate', emoji: '⭐' },
];

function AnimatedNumber({ value, suffix, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { start = end; clearInterval(timer); }
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 px-4 bg-gradient-to-r from-primary-800 to-cyan-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <span className="text-4xl mb-3 block">{stat.emoji}</span>
              <div className="font-display text-4xl md:text-5xl font-bold mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </div>
              <p className="text-blue-200 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
