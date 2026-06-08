import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
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

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

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
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-[#0f2744] to-slate-950 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
          <div className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-cyan-500/12 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/15 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 min-h-screen lg:grid lg:grid-cols-2 lg:items-center">
          {/* ── Left: Brand ── */}
          <div className="hidden lg:flex lg:items-center lg:justify-center px-10 xl:px-16 py-14 border-r border-white/[0.06]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="w-full max-w-[26rem] flex flex-col gap-8"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white text-sm font-medium transition-colors w-fit"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to store
              </Link>

              <div className="flex items-center gap-5">
                <BrandLogo
                  forDarkBg
                  size="2xl"
                  className="h-24 w-24 flex-shrink-0 drop-shadow-[0_0_28px_rgba(34,211,238,0.3)]"
                />
                <div className="min-w-0">
                  <p className="font-display font-bold text-white text-xl leading-tight tracking-tight">
                    Anura Furniture
                  </p>
                  <p className="text-[11px] text-cyan-300/80 uppercase tracking-[0.22em] mt-1 font-medium">
                    Dekatana
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 text-xs font-semibold tracking-wide mb-5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium Furniture Shop
                </span>

                <h1 className="mb-4">
                  <span className="login-title-en">Furniture</span>
                  <span className="login-title-si">
                    <span className="login-si-light">කලාවේ </span>
                    <span className="login-si-gradient">මහ ගෙදර</span>
                  </span>
                </h1>

                <p className="text-blue-100/60 text-[15px] leading-[1.75]">
                  Welcome back. Sign in to track orders, save your wishlist, and unlock AI-powered room design tools.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-white/15 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-cyan-600 flex items-center justify-center mb-2.5 shadow-md shadow-primary-950/50">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white text-[13px] font-semibold leading-snug">{label}</p>
                    <p className="text-blue-200/45 text-[11px] mt-1 leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-blue-200/35 text-xs pt-2">
                © {getCurrentYear()} Anura Furniture – Dekatana
              </p>
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <div className="flex items-center justify-center px-6 sm:px-10 xl:px-16 py-14 min-h-screen lg:min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="w-full max-w-[26rem]"
            >
              <Link
                to="/"
                className="lg:hidden inline-flex items-center gap-1.5 text-blue-200/70 hover:text-white text-sm mb-6 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to store
              </Link>

              {/* Mobile brand */}
              <div className="lg:hidden flex items-center gap-4 mb-8">
                <BrandLogo forDarkBg size="lg" className="h-16 w-16" />
                <div>
                  <p className="font-display font-bold text-white text-lg leading-tight">Anura Furniture</p>
                  <p className="text-cyan-300/70 text-[10px] uppercase tracking-[0.2em]">Dekatana</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-[1px] rounded-[1.7rem] bg-gradient-to-b from-primary-400/50 via-cyan-400/25 to-primary-700/40 opacity-80" />

                <div className="relative bg-white dark:bg-gray-900 rounded-[1.6rem] shadow-2xl shadow-black/30 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary-700 via-cyan-500 to-primary-600" />

                  <div className="px-8 py-9 sm:px-9 sm:py-10">
                    {/* Form header — left aligned */}
                    <div className="mb-8">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400 mb-2">
                        Member Access
                      </p>
                      <h2 className="font-display text-[1.75rem] font-bold text-gray-900 dark:text-white leading-tight">
                        Welcome Back
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                        Sign in to continue your furniture journey
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm leading-relaxed"
                      >
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-[1.15rem]">
                      <div>
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
                            className="input-field pl-11 h-12 text-[15px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                          />
                        </div>
                      </div>

                      <div>
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
                            className="input-field pl-11 pr-11 h-12 text-[15px] focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-1">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800 whitespace-nowrap"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary h-12 text-[15px] font-semibold shadow-lg shadow-primary-700/20 mt-1"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            Sign In
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    </form>

                    <div className="flex items-center gap-3 my-7">
                      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                      <span className="text-[10px] text-gray-400 uppercase tracking-[0.16em] font-medium whitespace-nowrap">
                        or continue with
                      </span>
                      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    </div>

                    <a
                      href={googleAuthHref}
                      className="w-full flex items-center justify-center gap-3 h-12 px-4 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-300 transition-all font-medium text-sm"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </a>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 leading-relaxed">
                      Don&apos;t have an account?{' '}
                      <Link
                        to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                        className="text-primary-700 dark:text-primary-400 font-semibold hover:underline"
                      >
                        Create one free
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
