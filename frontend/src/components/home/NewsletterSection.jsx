import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check, Sparkles } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubscribed(true);
    setLoading(false);
    toast.success('Successfully subscribed! Check your email for a 10% discount code.');
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-950/20 dark:to-cyan-950/20" />
      <div className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1e3a8a 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-700 dark:text-primary-300" />
          </div>

          <span className="badge-cyan mb-4">Newsletter</span>
          <h2 className="section-title mb-4">Get Exclusive Deals & Inspiration</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">
            Subscribe to our newsletter and get <strong className="text-primary-700 dark:text-primary-300">10% off</strong> your first order.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-8 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            Plus weekly interior design tips and exclusive product launches
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-green-700 dark:text-green-300">You're subscribed!</p>
                <p className="text-green-600 dark:text-green-400 text-sm">Check your inbox for your 10% discount code</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-shrink-0"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Subscribe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          <p className="text-gray-400 text-xs mt-4">
            No spam, ever. Unsubscribe anytime. Your privacy is important to us.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
