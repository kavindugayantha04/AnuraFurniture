import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(search && { search }) }).toString();
      const { data } = await api.get(`/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleStatus = async (user) => {
    try {
      await api.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const setRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <>
      <Helmet><title>Users – Admin</title></Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Users <span className="text-gray-400 text-lg font-normal">({total})</span></h1>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary-500" />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? Array(5).fill(null).map((_, i) => (
                  <tr key={i}>{Array(7).fill(null).map((_, j) => <td key={j} className="px-4 py-4"><div className="h-4 bg-gray-800 rounded skeleton" /></td>)}</tr>
                )) : users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <p className="text-white text-sm font-medium">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{user.email}</td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{user.phone || '–'}</td>
                    <td className="px-4 py-4">
                      <select value={user.role} onChange={(e) => setRole(user._id, e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-gray-300 text-xs focus:outline-none">
                        <option value="customer">Customer</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge text-xs ${user.isActive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleStatus(user)}
                        className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-red-400 hover:bg-red-900/20' : 'text-green-400 hover:bg-green-900/20'}`}>
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
