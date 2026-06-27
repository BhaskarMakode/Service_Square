import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminVerificationQueue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchCounts();
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') fetchProviders();
  }, [statusFilter, user]);

  const fetchCounts = async () => {
    try {
      const [pendRes, appRes, rejRes] = await Promise.all([
        apiClient.get('/admin/providers?verificationStatus=pending&limit=1'),
        apiClient.get('/admin/providers?verificationStatus=approved&limit=1'),
        apiClient.get('/admin/providers?verificationStatus=rejected&limit=1'),
      ]);
      setCounts({
        pending: pendRes.data.data?.pagination?.total || 0,
        approved: appRes.data.data?.pagination?.total || 0,
        rejected: rejRes.data.data?.pagination?.total || 0,
      });
    } catch {}
  };

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/admin/providers?verificationStatus=${statusFilter}&limit=50`);
      if (res.data.success) {
        setProviders(res.data.data.providers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  };

  const filtered = providers.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.userId?.name || '').toLowerCase().includes(q) ||
      (p.userId?.email || '').toLowerCase().includes(q) ||
      (p.userId?.phone || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen flex font-body antialiased">
      <AdminSidebar active="/admin-verification-queue" />

      <main className="ml-64 flex-1 min-h-screen p-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Provider Verification</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage professional service applications.</p>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all w-64 text-sm"
              placeholder="Search by name, email, category..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-medium border border-red-100 dark:border-red-800 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
            <button onClick={fetchProviders} className="ml-auto underline font-bold">Retry</button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            ['pending',  'Pending Review',    'pending_actions', 'text-amber-600',  'bg-amber-50 dark:bg-amber-900/20'],
            ['approved', 'Approved',          'verified',        'text-emerald-600','bg-emerald-50 dark:bg-emerald-900/20'],
            ['rejected', 'Rejected',          'block',           'text-rose-600',   'bg-rose-50 dark:bg-rose-900/20'],
          ].map(([status, label, icon, iconColor, bg]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                statusFilter === status
                  ? 'border-indigo-500 bg-white dark:bg-slate-800 shadow-lg'
                  : 'border-transparent bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
              <h3 className="text-3xl font-black mt-1">{counts[status]}</h3>
            </button>
          ))}
        </div>

        {/* Table */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-black text-lg capitalize">{statusFilter} Applications ({filtered.length})</h2>
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl gap-1">
              {['pending', 'approved', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    statusFilter === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Registered</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 animate-pulse font-bold">Loading providers...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">inbox</span>
                      <p className="text-slate-500 font-medium">No {statusFilter} applications{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
                    </td>
                  </tr>
                ) : filtered.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover bg-indigo-100"
                          src={p.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.userId?.name || 'P')}&background=4F46E5&color=fff`}
                          alt="Provider"
                        />
                        <div>
                          <p className="font-bold capitalize">{p.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{p.userId?.phone || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold capitalize">
                        {p.categoryId?.name || p.category || 'Service'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{p.userId?.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                        p.verificationStatus === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400' :
                        p.verificationStatus === 'rejected' ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-400' :
                        'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400'
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin-verification-detail?id=${p._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
                      >
                        View Details
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
