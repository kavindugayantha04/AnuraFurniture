import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { getMe } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchCategories } from './store/slices/productSlice';
import { toggleDarkMode } from './store/slices/uiSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import AIChatbot from './components/ai/AIChatbot';
import LoadingScreen from './components/ui/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import { initSocket } from './services/socket';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Login = lazy(() => import('./pages/auth/Login'));
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const AIRecommendations = lazy(() => import('./pages/AIRecommendations'));
const AIRoomDesigner = lazy(() => import('./pages/AIRoomDesigner'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const AdminCustomOrders = lazy(() => import('./pages/admin/CustomOrders'));
const AdminBanners = lazy(() => import('./pages/admin/Banners'));
const AdminAIInsights = lazy(() => import('./pages/admin/AIInsights'));
const NotFound = lazy(() => import('./pages/NotFound'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const PageWrapper = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    dispatch(fetchCategories());
    if (token) {
      dispatch(getMe());
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (isAuthenticated) {
      const socket = initSocket();
    }
  }, [isAuthenticated]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password', '/auth/google'].some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg">
      <ScrollToTop />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
              <Route path="/shop/:category" element={<PageWrapper><Shop /></PageWrapper>} />
              <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
              <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
              <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
              <Route path="/privacy-policy" element={<PageWrapper><Privacy /></PageWrapper>} />
              <Route path="/custom-order" element={<PageWrapper><CustomOrder /></PageWrapper>} />
              <Route path="/ai-recommendations" element={<PageWrapper><AIRecommendations /></PageWrapper>} />
              <Route path="/ai-room-designer" element={<PageWrapper><AIRoomDesigner /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
              <Route path="/auth/google/callback" element={<PageWrapper><GoogleCallback /></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
              <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />

              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
                <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                <Route path="/order-success/:id" element={<PageWrapper><OrderSuccess /></PageWrapper>} />
                <Route path="/orders" element={<PageWrapper><MyOrders /></PageWrapper>} />
                <Route path="/orders/:id" element={<PageWrapper><OrderDetail /></PageWrapper>} />
                <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="/admin/products" element={<PageWrapper><AdminProducts /></PageWrapper>} />
                <Route path="/admin/orders" element={<PageWrapper><AdminOrders /></PageWrapper>} />
                <Route path="/admin/users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="/admin/categories" element={<PageWrapper><AdminCategories /></PageWrapper>} />
                <Route path="/admin/coupons" element={<PageWrapper><AdminCoupons /></PageWrapper>} />
                <Route path="/admin/custom-orders" element={<PageWrapper><AdminCustomOrders /></PageWrapper>} />
                <Route path="/admin/banners" element={<PageWrapper><AdminBanners /></PageWrapper>} />
                <Route path="/admin/ai-insights" element={<PageWrapper><AdminAIInsights /></PageWrapper>} />
              </Route>

              <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      {!isAdminRoute && !isAuthRoute && <Footer />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && !isAuthRoute && <AIChatbot />}
    </div>
  );
}

export default App;
