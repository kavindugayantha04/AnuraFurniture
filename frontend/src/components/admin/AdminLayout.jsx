import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag, Ticket,
  Palette, Megaphone, Sparkles, LogOut, ChevronLeft, ChevronRight,
  Bell, Settings, Sun, Moon, Menu, X, ExternalLink,
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Package, label: 'Products', href: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: Ticket, label: 'Coupons', href: '/admin/coupons' },
  { icon: Palette, label: 'Custom Orders', href: '/admin/custom-orders' },
  { icon: Megaphone, label: 'Banners', href: '/admin/banners' },
  { icon: Sparkles, label: 'AI Insights', href: '/admin/ai-insights' },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-display font-bold">A</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">Anura Furniture</p>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-700 text-white shadow-glow'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-gray-800 space-y-2`}>
        <Link to="/" target="_blank" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm ${collapsed ? 'justify-center' : ''}`}>
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'View Website'}
        </Link>
        <button onClick={handleLogout} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors text-sm w-full ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col bg-gray-900 border-r border-gray-800 relative z-20"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-30"
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-gray-900 border-r border-gray-800 z-40 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-white font-semibold hidden sm:block">
              {navItems.find(n => n.href === location.pathname)?.label || 'Admin Panel'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(toggleDarkMode())}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
