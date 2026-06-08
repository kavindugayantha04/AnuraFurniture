import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles,
  Truck, ShieldCheck, Award, ChevronLeft,
} from 'lucide-react';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import BrandLogo from '../../components/ui/BrandLogo';
import { getCurrentYear } from '../../utils/dates';

const FEATURES = [
  { icon: Award, label: 'Premium Craftsmanship', desc: 'Handpicked Sri Lankan quality' },
  { icon: Sparkles, label: 'AI Recommendations', desc: 'Personalized furniture picks' },
  { icon: Truck, label: 'Island-wide Delivery', desc: 'Free on orders over Rs. 50,000' },
  { icon: ShieldCheck, label: 'Trusted Warranty', desc: 'Peace of mind on every piece' },
];

const EASE = [0.22, 1, 0.36, 1];

const leftStagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.11, delayChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
};

const formStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
};

const formItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const redirect = searchParams.get('redirect') || '/';
  const googleAuthHref = `${import.meta.env.VITE_API_URL || '/api'}/auth/google${
    redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''
  }`;

  useEffect(() => {
    if (isAuthenticated) navigate(redirect, { replace: true });
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    dispatch(clearError());
    if (searchParams.get('error') === 'google_failed') {
      toast.error('Google sign-in failed. Add your Gmail as a test user in Google Cloud, then try again.');
    }
  }, [dispatch, searchParams]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
      toast.success(`Welcome back, ${result.payload.user.name}!`);
      navigate(redirect, { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In – Anura Furniture</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@500;600;700;800&family=Noto+Sans+Sinhala:wght@500;600;700;800&display=swap"
        />
      </Helmet>

      <style>{`
        .login-title-en {
          display: block;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.25rem, 4vw, 3.25rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fff;
        }
        .login-title-si {
          display: block;
          margin-top: 0.65rem;
          font-family: 'Abhaya Libre', 'Noto Sans Sinhala', sans-serif;
          font-size: clamp(1.75rem, 3.2vw, 2.65rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }
        .login-si-light { color: #bae6fd; font-weight: 700; }
        .login-si-gradient {
          background: linear-gradient(to right, #67e8f9, #93c5fd, #38bdf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
        @keyframes loginShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .login-shimmer-bar {
          background: linear-gradient(90deg, #1d4ed8, #06b6d4, #3b82f6, #06b6d4, #1d4ed8);
          background-size: 200% auto;
          animation: loginShimmer 4s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-[#0f2744] to-slate-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
          <motion.div
            className="absolute top-[-8rem] left-[15%] w-[32rem] h-[32rem] bg-cyan-500/12 rounded-full blur-[100px]"
            animate={{ x: [0, 40, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-6rem] right-[5%] w-96 h-96 bg-primary-600/15 rounded-full blur-[80px]"
            animate={{ x: [0, -30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.div
            className="absolute top-[40%] right-[30%] w-64 h-64 bg-cyan-400/8 rounded-full blur-[70px]"
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-2 lg:items-start">
          {/* ── Left: Brand ── */}
          <div className="hidden lg:flex lg:items-start lg:justify-center px-10 xl:px-16 pt-10 xl:pt-14 pb-14 border-r border-white/[0.06]">
            <motion.div
              variants={leftStagger}
              initial="hidden"
              animate="visible"
              className="w-full max-w-[26rem] flex flex-col gap-8"
            >
              <motion.div variants={fadeUp}>
                <motion.div whileHover={{ x: -4 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white text-sm font-medium transition-colors w-fit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to store
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-5">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex-shrink-0"
                >
                  <BrandLogo
                    forDarkBg
                    size="2xl"
                    className="h-24 w-24 drop-shadow-[0_0_28px_rgba(34,211,238,0.35)]"
                  />
                </motion.div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-white text-xl leading-tight tracking-tight">
                    Anura Furniture
                  </p>
                  <p className="text-[11px] text-cyan-300/80 uppercase tracking-[0.22em] mt-1 font-medium">
                    Dekatana
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <motion.span
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 text-xs font-semibold tracking-wide mb-5"
                  whileHover={{ scale: 1.03, borderColor: 'rgba(34,211,238,0.45)' }}
                >
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.span>
                  Premium Furniture Shop
                </motion.span>

                <h1 className="mb-4 overflow-hidden">
                  <motion.span
                    className="login-title-en block"
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.35, ease: EASE }}
                  >
                    Furniture
                  </motion.span>
                  <motion.span
                    className="login-title-si block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.48, ease: EASE }}
                  >
                    <span className="login-si-light">කලාවේ </span>
                    <span className="login-si-gradient">මහ ගෙදර</span>
                  </motion.span>
                </h1>

                <motion.p
                  className="text-blue-100/60 text-[15px] leading-[1.75]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Welcome back. Sign in to track orders, save your wishlist, and unlock AI-powered room design tools.
                </motion.p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 w-full">
                {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.09, duration: 0.5, ease: EASE }}
                    whileHover={{ y: -5, scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] transition-colors cursor-default"
                  >
                    <motion.div
                      className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-600 flex items-center justify-center mb-2.5 shadow-md shadow-primary-950/50"
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.4 }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <p className="text-white text-[13px] font-semibold leading-snug">{label}</p>
                    <p className="text-blue-200/45 text-[11px] mt-1 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="text-blue-200/35 text-xs pt-2"
              >
                © {getCurrentYear()} Anura Furniture – Dekatana
              </motion.p>
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <div className="flex items-start justify-center px-6 sm:px-10 xl:px-16 pt-10 xl:pt-14 pb-14 min-h-screen lg:min-h-0">
            <motion.div
              variants={fadeRight}
              initial="hidden"
              animate="visible"
              className="w-full max-w-[26rem]"
            >
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.45 }}
                className="lg:hidden"
              >
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 text-blue-200/70 hover:text-white text-sm mb-6 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to store
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="lg:hidden flex items-center gap-4 mb-8"
              >
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
                  <BrandLogo forDarkBg size="lg" className="h-16 w-16" />
                </motion.div>
                <div>
                  <p className="font-display font-bold text-white text-lg leading-tight">Anura Furniture</p>
                  <p className="text-cyan-300/70 text-[10px] uppercase tracking-[0.2em]">Dekatana</p>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
              >
                <motion.div
                  className="absolute -inset-[1px] rounded-[1.7rem] bg-gradient-to-b from-primary-400/50 via-cyan-400/25 to-primary-700/40"
                  animate={{ opacity: [0.6, 0.95, 0.6] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div className="relative bg-white dark:bg-gray-900 rounded-[1.6rem] shadow-2xl shadow-black/30 overflow-hidden">
                  <div className="h-1 login-shimmer-bar" />

                  <div className="px-8 py-9 sm:px-9 sm:py-10">
                    <motion.div
                      className="mb-8"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400 mb-2">
                        Member Access
                      </p>
                      <h2 className="font-display text-[1.75rem] font-bold text-gray-900 dark:text-white leading-tight">
                        Welcome Back
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                        Sign in to continue your furniture journey
                      </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {error && (
                        <motion.div
                          key="login-error"
                          initial={{ opacity: 0, y: -10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm leading-relaxed overflow-hidden"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.form
                      variants={formStagger}
                      initial="hidden"
                      animate="visible"
                      onSubmit={handleSubmit}
                      className="space-y-[1.15rem]"
                    >
                      <motion.div variants={formItem}>
                        <label htmlFor="login-email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Email Address
                        </label>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none" />
                          <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className="input-field pl-11 h-12 text-[15px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={formItem}>
                        <label htmlFor="login-password" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          Password
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 group-focus-within:text-primary-600 transition-colors pointer-events-none" />
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                            className="input-field pl-11 pr-11 h-12 text-[15px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all duration-300"
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={showPassword ? 'hide' : 'show'}
                                initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="block"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </motion.span>
                            </AnimatePresence>
                          </motion.button>
                        </div>
                      </motion.div>

                      <motion.div variants={formItem} className="flex items-center justify-between gap-4 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <motion.div whileHover={{ x: 2 }}>
                          <Link
                            to="/forgot-password"
                            className="text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 whitespace-nowrap"
                          >
                            Forgot password?
                          </Link>
                        </motion.div>
                      </motion.div>

                      <motion.div variants={formItem}>
                        <motion.button
                          type="submit"
                          disabled={loading}
                          onHoverStart={() => setBtnHover(true)}
                          onHoverEnd={() => setBtnHover(false)}
                          whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                          whileTap={{ scale: loading ? 1 : 0.98 }}
                          className="w-full btn-primary h-12 text-[15px] font-semibold shadow-lg shadow-primary-700/20 mt-1 disabled:opacity-70"
                        >
                          {loading ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-2">
                              Sign In
                              <motion.span animate={{ x: btnHover ? 5 : 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                                <ArrowRight className="w-4 h-4" />
                              </motion.span>
                            </span>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.form>

                    <motion.div
                      className="flex items-center gap-3 my-7"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.75, duration: 0.5 }}
                    >
                      <motion.div
                        className="flex-1 h-px bg-gray-100 dark:bg-gray-800"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{ originX: 1 }}
                      />
                      <span className="text-[10px] text-gray-400 uppercase tracking-[0.16em] font-medium whitespace-nowrap">
                        or continue with
                      </span>
                      <motion.div
                        className="flex-1 h-px bg-gray-100 dark:bg-gray-800"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{ originX: 0 }}
                      />
                    </motion.div>

                    <motion.a
                      href={googleAuthHref}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.85, duration: 0.45 }}
                      whileHover={{ scale: 1.02, y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-300 transition-colors font-medium text-sm"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </motion.a>

                    <motion.p
                      className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.95, duration: 0.45 }}
                    >
                      Don&apos;t have an account?{' '}
                      <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                        <Link
                          to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                          className="text-primary-700 dark:text-primary-400 font-semibold hover:underline"
                        >
                          Create one free
                        </Link>
                      </motion.span>
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
