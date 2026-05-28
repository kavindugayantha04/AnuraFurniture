import { motion } from 'framer-motion';
import BrandLogo from './BrandLogo';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6"
        >
          <BrandLogo forDarkBg size="3xl" className="h-40 w-40 mx-auto drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]" />
        </motion.div>

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
