import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
  }, [user, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 20 };
      if (roleFilter) params.role = roleFilter;
      if (search) params.search = search;
      const res = await apiClient.get('/admin/users', { params });
      if (res.data.success) {
        setUsers(res.data.data.users || []);
        setPagination(res.data.data.pagination || { pages: 1, total: 0 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => { if (user?.role === 'admin') fetchUsers(); }, [fetchUsers, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Deactivate account for "${name}"? This cannot be undone.`)) return;
    try {
      setDeletingId(id);
      await apiClient.delete(`/admin/user/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to deactivate user.');
    } finally {
      setDeletingId(null);
    }
  };

  const ROLE_COLORS = {
    customer: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    provider:  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    admin:     'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex font-body antialiased">
      <AdminSidebar active="/admin-users" />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View, search, and manage all platform users.</p>
        </header>

        {/* Search + Filter */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={e => { setSearch(e.target.value); }}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl gap-1">
            {['', 'customer', 'provider', 'admin'].map(r => (
              <button key={r} type="button" onClick={() => { setRoleFilter(r); setPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${roleFilter === r ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                {r || 'All'}
              </button>
            ))}
          </div>
          <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">Search</button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl font-medium flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>{error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="font-black">{pagination.total} Users</span>
            <span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 animate-pulse font-bold">Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">group</span>
                      <p className="text-slate-500">No users found.</p>
                    </td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=4F46E5&color=fff`}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={u.name}
                        />
                        <div>
                          <p className="font-bold">{u.name || 'No name'}</p>
                          <p className="text-xs text-slate-500 font-mono">{u._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono">{u.phone}</p>
                      <p className="text-xs text-slate-400">{u.email || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.isActive && u._id !== user._id && (
                        <button
                          onClick={() => deleteUser(u._id, u.name)}
                          disabled={deletingId === u._id}
                          className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === u._id ? 'Deactivating...' : 'Deactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Previous
              </button>
              <span className="text-sm text-slate-500">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
