import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Bell, User, Menu, X, Search, Sun, Moon,
  ChevronDown, Sparkles, Home, Package, Info, Phone, Wand2, LogOut
} from 'lucide-react';
import { toggleDarkMode, toggleMobileMenu, setSearchQuery } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { openCart } from '../../store/slices/cartSlice';
import BrandLogo from '../ui/BrandLogo';

const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/shop', label: 'Shop', icon: Package },
  { path: '/ai-recommendations', label: 'AI Picks', icon: Sparkles, highlight: true },
  { path: '/ai-room-designer', label: 'Room Design', icon: Wand2 },
  { path: '/custom-order', label: 'Custom Order', icon: Package },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Phone },
];

// Routes whose top section is a dark hero band flush under the navbar.
// Matches the exact path or any sub-path (e.g. '/shop' covers '/shop/living-room').
// NOTE: '/' (Home) is excluded — its hero uses a light white/blue background.
const DARK_HERO_ROUTES = [
  '/shop', '/about', '/contact', '/custom-order',
  '/ai-recommendations', '/ai-room-designer',
  '/terms', '/privacy', '/privacy-policy',
];

const isDarkHeroRoute = (pathname) =>
  DARK_HERO_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, mobileMenuOpen } = useSelector(s => s.ui);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { cart } = useSelector(s => s.cart);
  const { unreadCount } = useSelector(s => s.notifications);

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const [scrolled, setScrolled] = useState(false);
  // When transparent over a dark hero (or in dark mode), use light-on-dark styling
  const onDark = darkMode || (!scrolled && isDarkHeroRoute(location.pathname));
  const iconBtnClass = `p-2 rounded-xl transition-colors ${
    onDark
      ? 'text-white hover:bg-white/10'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
  }`;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    dispatch(setSearchQuery(searchInput));
    navigate(`/shop?q=${encodeURIComponent(searchInput)}`);
    setSearchOpen(false);
    setSearchInput('');
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  const isActiveNav = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass shadow-glass border-b border-white/10 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl'
            : onDark
              ? 'bg-primary-950/30 backdrop-blur-md border-b border-white/10'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-[4.5rem] lg:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Anura Furniture – Dekatana home">
              <BrandLogo forDarkBg={onDark} size="lg" className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] drop-shadow-sm" />
              <div className="hidden sm:block">
                <p className={`font-display font-bold text-sm leading-tight ${onDark ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Anura Furniture</p>
                <p className={`text-[10px] leading-tight tracking-widest uppercase ${onDark ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>Dekatana</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map(({ path, label, highlight }) => {
                const active = isActiveNav(path);
                return (
                <Link key={path} to={path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? onDark
                        ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/25'
                        : 'bg-primary-800 text-white shadow-sm'
                      : highlight
                        ? (onDark ? 'text-cyan-300 hover:bg-white/10' : 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20')
                        : (onDark ? 'text-white/90 hover:bg-white/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')
                  }`}
                >
                  {label}
                </Link>
              );})}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search */}
              <button onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
                className={iconBtnClass}>
                <Search className="w-5 h-5" />
              </button>

              {/* Dark Mode */}
              <button onClick={() => dispatch(toggleDarkMode())}
                className={iconBtnClass}>
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isAuthenticated && (
                <>
                  {/* Wishlist */}
                  <Link to="/wishlist" className={iconBtnClass}>
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Notifications */}
                  <Link to="/notifications" className={`${iconBtnClass} relative`}>
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </Link>
                </>
              )}

              {/* Cart */}
              <button onClick={() => dispatch(openCart())}
                className={`${iconBtnClass} relative`}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount > 9 ? '9+' : cartCount}</span>}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-700 to-cyan-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-glass border border-white/20 overflow-hidden z-50">
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                        </div>
                        {[
                          { path: '/profile', label: 'My Profile', icon: User },
                          { path: '/orders', label: 'My Orders', icon: Package },
                          { path: '/wishlist', label: 'Wishlist', icon: Heart },
                          ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin Dashboard', icon: Sparkles }] : []),
                        ].map(({ path, label, icon: Icon }) => (
                          <Link key={path} to={path} onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                            <Icon className="w-4 h-4 text-gray-400" />{label}
                          </Link>
                        ))}
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-white/10">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className={`ml-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors shadow-glow ${
                  onDark && !scrolled
                    ? 'bg-white text-primary-900 hover:bg-blue-50'
                    : 'bg-primary-800 text-white hover:bg-primary-700'
                }`}>
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => dispatch(toggleMobileMenu())} className={`lg:hidden ${iconBtnClass}`}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 glass">
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ path, label, icon: Icon, highlight }) => (
                  <Link key={path} to={path}
                    onClick={() => dispatch(toggleMobileMenu())}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActiveNav(path) ? 'bg-primary-800 text-white' :
                      highlight ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />{label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
            <motion.form initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input ref={searchRef} value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search furniture, styles, rooms… (AI-powered)"
                  className="w-full pl-12 pr-16 py-4 bg-white dark:bg-gray-900 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 shadow-2xl text-base border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary-500"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-800 text-white rounded-xl text-sm font-medium">Search</button>
              </div>
              <p className="text-white/50 text-sm mt-3 text-center">Try: "modern sofa under Rs.80,000" or "bedroom furniture set"</p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
