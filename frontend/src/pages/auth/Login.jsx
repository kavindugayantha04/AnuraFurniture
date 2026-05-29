import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';
import { fetchWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';
import BrandLogo from '../../components/ui/BrandLogo';

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

      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-slate-950 flex">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
          </div>
          <div className="relative z-10 text-white text-center max-w-sm">
            <div className="mx-auto mb-8 animate-float">
              <BrandLogo forDarkBg size="3xl" className="h-44 w-44 mx-auto drop-shadow-[0_0_28px_rgba(34,211,238,0.4)]" />
            </div>
            <p className="text-cyan-300 italic text-lg mb-6">Furniture කලාවේ මහ ගෙදර</p>
            <p className="text-gray-400 leading-relaxed">
              Welcome back! Sign in to access your orders, wishlist, and personalized AI recommendations.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { emoji: '🛋️', label: 'Premium Quality' },
                { emoji: '🤖', label: 'AI Powered' },
                { emoji: '🚚', label: 'Free Delivery' },
                { emoji: '🛡️', label: '1 Year Warranty' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <span className="text-2xl">{item.emoji}</span>
                  <p className="text-gray-300 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden mx-auto mb-4">
                  <BrandLogo size="xl" className="h-24 w-24 drop-shadow-md" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to your account</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Your password"
                      required
                      className="input-field pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-700 dark:text-primary-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 text-base"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              {/* Demo credentials */}
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Demo Accounts:</p>
                <p className="text-xs text-blue-500 dark:text-blue-300">Admin: admin@anura.lk / Admin123!</p>
                <p className="text-xs text-blue-500 dark:text-blue-300">User: user@anura.lk / User123!</p>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-gray-900 px-4 text-xs text-gray-400 uppercase tracking-wide">
                    or continue with
                  </span>
                </div>
              </div>

              <a
                href={googleAuthHref}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </a>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-primary-700 dark:text-primary-400 font-semibold hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
