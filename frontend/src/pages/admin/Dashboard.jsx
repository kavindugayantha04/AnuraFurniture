import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, Truck, AlertTriangle, Eye, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const COLORS = ['#1e3a8a', '#0891b2', '#f59e0b', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAIInsights] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes] = await Promise.all([
          api.get('/orders/dashboard/stats'),
        ]);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    {
      title: 'Total Revenue',
      value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`,
      sub: `Today: Rs. ${(stats.todayRevenue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'from-primary-500 to-primary-700',
      trend: '+12.5%',
      up: true,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      sub: `${stats.pendingOrders || 0} pending`,
      icon: ShoppingBag,
      color: 'from-cyan-500 to-cyan-700',
      trend: '+8.2%',
      up: true,
    },
    {
      title: 'Total Customers',
      value: stats.totalUsers || 0,
      sub: 'Registered users',
      icon: Users,
      color: 'from-gold-400 to-gold-600',
      trend: '+15.1%',
      up: true,
    },
    {
      title: 'Active Products',
      value: stats.totalProducts || 0,
      sub: 'In inventory',
      icon: Package,
      color: 'from-green-500 to-green-700',
      trend: '+2.3%',
      up: true,
    },
  ] : [];

  const orderStatusData = [
    { name: 'Pending', value: stats?.pendingOrders || 0 },
    { name: 'Confirmed', value: Math.floor((stats?.totalOrders || 0) * 0.3) },
    { name: 'Delivered', value: Math.floor((stats?.totalOrders || 0) * 0.5) },
    { name: 'Cancelled', value: Math.floor((stats?.totalOrders || 0) * 0.1) },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard – Anura Furniture</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <Link to="/admin/ai-insights" className="btn-cyan text-sm py-2 px-4">
            <Sparkles className="w-4 h-4" /> AI Insights
          </Link>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-2xl bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-xl -translate-x-4 -translate-y-4`} />
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${card.up ? 'text-green-400' : 'text-red-400'}`}>
                    {card.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {card.trend}
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{card.value}</p>
                <p className="text-gray-400 text-sm mt-1">{card.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{card.sub}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-6">Revenue Overview (30 Days)</h3>
            {stats?.revenueByDay?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.revenueByDay}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, color: '#fff' }}
                    formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1e3a8a" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-500">No revenue data yet</div>
            )}
          </div>

          {/* Order Status Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-6">Order Status</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {orderStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Top Products */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Top Products</h3>
              <Link to="/admin/products" className="text-primary-400 text-sm hover:underline">View All</Link>
            </div>
            {stats?.topProducts?.length > 0 ? (
              <div className="space-y-3">
                {stats.topProducts.slice(0, 5).map((product, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.total} sold</p>
                    </div>
                    <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-cyan-500 rounded-full"
                        style={{ width: `${(product.total / (stats.topProducts[0]?.total || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No sales data yet</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Package, label: 'Add Product', href: '/admin/products', color: 'bg-primary-900/30 text-primary-400 hover:bg-primary-900/50' },
                { icon: ShoppingBag, label: 'View Orders', href: '/admin/orders', color: 'bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50' },
                { icon: Users, label: 'Manage Users', href: '/admin/users', color: 'bg-gold-900/30 text-gold-400 hover:bg-gold-900/50' },
                { icon: Sparkles, label: 'AI Insights', href: '/admin/ai-insights', color: 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50' },
                { icon: AlertTriangle, label: 'Low Stock', href: '/admin/products?lowStock=true', color: 'bg-red-900/30 text-red-400 hover:bg-red-900/50' },
                { icon: Eye, label: 'View Site', href: '/', color: 'bg-green-900/30 text-green-400 hover:bg-green-900/50' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  target={action.href === '/' ? '_blank' : undefined}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${action.color}`}
                >
                  <action.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
