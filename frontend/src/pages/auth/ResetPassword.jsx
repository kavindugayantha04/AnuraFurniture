import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeOff, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password: formData.password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-primary-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
              <p className="text-gray-500 text-sm mt-2">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password}
                    onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min 6 characters" required minLength={6} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                    onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat password" required className="input-field pl-10" />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3.5">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
