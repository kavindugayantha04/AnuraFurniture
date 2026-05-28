import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminRoute() {
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-8 h-8 border-4 border-primary-800 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
