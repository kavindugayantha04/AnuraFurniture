import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Logo */}
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
          <span className="text-white font-display font-bold text-3xl">A</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-display text-2xl font-bold text-white mb-2"
        >
          Anura Furniture
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-cyan-300 text-sm italic"
        >
          Furniture කලාවේ මහ ගෙදර
        </motion.p>

        {/* Loading Bar */}
        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          />
        </div>
      </motion.div>
    </div>
  );
}
