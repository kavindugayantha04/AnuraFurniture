import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Sparkles, TrendingUp, RefreshCw, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

export default function AdminAIInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get('/ai/sales-insights');
      setData(res);
    } catch (err) {
      console.error('Failed to fetch AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  return (
    <>
      <Helmet><title>AI Insights – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-primary-700 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Sales Insights</h1>
              <p className="text-gray-400 text-sm">Powered by OpenAI GPT</p>
            </div>
          </div>
          <button onClick={fetchInsights} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-xl text-sm transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array(3).fill(null).map((_, i) => <div key={i} className="h-32 bg-gray-800 rounded-2xl skeleton" />)}
          </div>
        ) : (
          <>
            {/* AI Insights Text */}
            {data?.insights && (
              <div className="bg-gradient-to-br from-purple-900/30 to-primary-900/30 border border-purple-800/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI Analysis</h3>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {data.insights}
                </div>
              </div>
            )}

            {/* Revenue Chart */}
            {data?.revenueData?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Monthly Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="_id" stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 12, color: '#fff' }}
                      formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Products */}
            {data?.topProducts?.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-5">Top Selling Products</h3>
                <div className="space-y-3">
                  {data.topProducts.slice(0, 8).map((product, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary-900/50 text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-200 text-sm truncate">{product.name}</p>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-600 to-cyan-500 rounded-full"
                            style={{ width: `${Math.min(100, (product.total / (data.topProducts[0]?.total || 1)) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm flex-shrink-0">{product.total} units</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            {data?.summary && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm mb-1">Orders (Last 30 Days)</p>
                  <p className="text-white text-3xl font-bold">{data.summary.ordersLast30Days}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-400 text-sm mb-1">Revenue (Last 30 Days)</p>
                  <p className="text-white text-3xl font-bold">Rs. {(data.summary.revenueLast30Days || 0).toLocaleString()}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
