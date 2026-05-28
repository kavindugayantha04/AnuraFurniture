import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, ArrowLeft, Check, Send } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
            <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Check Your Email</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
                </p>
                <p className="text-sm text-gray-400">
                  Didn't receive it?{' '}
                  <button onClick={() => setSent(false)} className="text-primary-700 dark:text-primary-400 hover:underline font-medium">
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Enter your email and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com" required className="input-field pl-10" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full btn-primary py-3.5">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Reset Link</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
