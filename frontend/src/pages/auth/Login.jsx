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
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950 flex relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
        </div>

        {/* Left Panel — brand story */}
        <div className="hidden lg:flex lg:w-[52%] xl:w-1/2 flex-col justify-between p-12 xl:p-16 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-200/80 hover:text-white text-sm font-medium transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to store
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-10">
                <BrandLogo forDarkBg size="3xl" className="h-36 w-36 xl:h-40 xl:w-40 drop-shadow-[0_0_32px_rgba(34,211,238,0.35)]" />
              </div>

              <span className="badge-cyan mb-5 inline-block">✨ Premium Furniture · Dekatana</span>

              <h1 className="font-display text-4xl xl:text-5xl font-bold leading-[1.15] mb-5">
                <span className="text-white">Furniture </span>
                <span className="text-gradient-bright italic">කලාවේ</span>
                <br />
                <span className="text-gradient">මහ ගෙදර</span>
              </h1>

              <p className="text-blue-100/70 text-base leading-relaxed mb-10 max-w-md">
                Welcome back. Sign in to track orders, save your wishlist, and unlock AI-powered room design tools.
              </p>

              <div className="space-y-3">
                {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-white/15 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/40">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{label}</p>
                      <p className="text-blue-200/50 text-xs mt-0.5">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <p className="text-blue-200/40 text-xs tracking-wide">
            © {new Date().getFullYear()} Anura Furniture – Dekatana
          </p>
        </div>

        {/* Right Panel — sign in form */}
        <div className="flex-1 flex items-center justify-center p-5 sm:p-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="w-full max-w-[420px]"
          >
            {/* Mobile back link */}
            <Link
              to="/"
              className="lg:hidden inline-flex items-center gap-1.5 text-blue-200/80 hover:text-white text-sm mb-5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to store
            </Link>

            <div className="relative">
              {/* Card glow */}
              <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-primary-400/40 via-cyan-400/20 to-primary-600/30 blur-sm" />

              <div className="relative bg-white dark:bg-gray-900 rounded-[1.65rem] shadow-2xl shadow-primary-950/50 overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary-700 via-cyan-500 to-primary-600" />

                <div className="p-8 md:p-10">
                  <div className="text-center mb-8">
                    <div className="lg:hidden mx-auto mb-5">
                      <BrandLogo size="xl" className="h-20 w-20 drop-shadow-md" />
                    </div>
                    <h2 className="font-display text-2xl md:text-[1.65rem] font-bold text-gray-900 dark:text-white">
                      Welcome Back
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                      Sign in to continue your furniture journey
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className="input-field pl-11 focus:ring-primary-500/30 focus:border-primary-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                          className="input-field pl-11 pr-11 focus:ring-primary-500/30 focus:border-primary-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary py-3.5 text-base shadow-lg shadow-primary-700/25 hover:shadow-primary-600/35 disabled:opacity-70"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Sign In <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>

                  <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100 dark:border-gray-800" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white dark:bg-gray-900 px-4 text-[11px] text-gray-400 uppercase tracking-[0.14em] font-medium">
                        or continue with
                      </span>
                    </div>
                  </div>

                  <a
                    href={googleAuthHref}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 transition-all font-medium text-sm shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </a>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
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
    </>
  );
}
