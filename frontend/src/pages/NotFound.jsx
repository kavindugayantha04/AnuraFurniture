import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 – Page Not Found | Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-[120px] font-black text-gradient leading-none mb-4"
          >
            404
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4" /> Go Home
            </Link>
            <Link to="/shop" className="btn-secondary">
              <Search className="w-4 h-4" /> Browse Products
            </Link>
          </div>
          <button onClick={() => window.history.back()} className="mt-4 text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center gap-1 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </motion.div>
      </div>
    </>
  );
}
