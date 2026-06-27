import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/serviceApi';
import { formatCurrency } from '../utils/currency';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ stats: {}, activities: [], dailyRevenue: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const response = await adminApi.dashboard();
      setData(response.data.data || { stats: {}, activities: [], dailyRevenue: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cards = useMemo(() => [
    ['Total Users',          data.stats.totalUsers,                      'group',                  'text-blue-600',   'bg-blue-50 dark:bg-blue-900/20'],
    ['Total Providers',      data.stats.totalProviders,                  'engineering',            'text-indigo-600', 'bg-indigo-50 dark:bg-indigo-900/20'],
    ['Active Providers',     data.stats.activeProviders,                 'verified',               'text-emerald-600','bg-emerald-50 dark:bg-emerald-900/20'],
    ['Pending KYC',          data.stats.pendingVerifications,            'pending_actions',        'text-amber-600',  'bg-amber-50 dark:bg-amber-900/20'],
    ['Active Bookings',      data.stats.activeBookings,                  'event_available',        'text-sky-600',    'bg-sky-50 dark:bg-sky-900/20'],
    ['Completed Bookings',   data.stats.completedBookings,               'task_alt',               'text-green-600',  'bg-green-50 dark:bg-green-900/20'],
    ['Cancelled Bookings',   data.stats.cancelledBookings,               'event_busy',             'text-rose-600',   'bg-rose-50 dark:bg-rose-900/20'],
    ['Open Support Tickets', data.stats.supportTickets,                  'support_agent',          'text-orange-600', 'bg-orange-50 dark:bg-orange-900/20'],
    ['Total Reviews',        data.stats.reviews,                         'reviews',                'text-purple-600', 'bg-purple-50 dark:bg-purple-900/20'],
    ['Platform Revenue',     formatCurrency(data.stats.platformRevenue || 0), 'payments',          'text-indigo-600', 'bg-indigo-50 dark:bg-indigo-900/20'],
    ['Provider Earnings',    formatCurrency(data.stats.providerEarnings || 0), 'account_balance_wallet','text-teal-600','bg-teal-50 dark:bg-teal-900/20'],
    ['Transactions',         data.stats.transactions,                    'receipt_long',           'text-slate-600',  'bg-slate-50 dark:bg-slate-800'],
  ], [data.stats]);

  const maxRevenue = Math.max(...data.dailyRevenue.map(item => item.amount || 0), 1);

  const activityIcon = (type) => {
    if (type?.includes('booking')) return 'event';
    if (type?.includes('payment')) return 'payments';
    if (type?.includes('review')) return 'star';
    if (type?.includes('verification') || type?.includes('provider')) return 'verified_user';
    if (type?.includes('support')) return 'support_agent';
    if (type?.includes('registration') || type?.includes('user')) return 'person_add';
    return 'notifications';
  };

  if (loading) return (
    <div className="min-h-screen flex">
      <AdminSidebar active="/admin-dashboard" />
      <main className="ml-64 flex-1 grid place-items-center">
        <div className="text-center animate-pulse">
          <span className="material-symbols-outlined text-5xl text-indigo-300 mb-4 block">analytics</span>
          <p className="font-bold text-slate-500">Loading admin dashboard...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex">
      <AdminSidebar active="/admin-dashboard" />

      <main className="ml-64 flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Platform Overview</h1>
            <p className="text-sm text-slate-500 mt-0.5">Live database metrics and real-time activity</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
              <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
            </button>
            <div className="text-sm font-bold px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl">{user?.name || 'Super Admin'}</div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
              <button onClick={load} className="ml-auto font-bold underline">Retry</button>
            </div>
          )}

          {/* Stats Grid */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map(([label, value, icon, iconColor, bgColor]) => (
              <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <div className="text-2xl font-black break-words">{value ?? 0}</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </section>

          {/* Revenue Chart + Activity Feed */}
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
            {/* Revenue Bar Chart */}
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-black text-lg">Daily Platform Revenue</h2>
                <span className="text-xs text-slate-400 font-medium">Last 7 days (commission)</span>
              </div>
              <p className="text-3xl font-black text-indigo-600 mb-6">{formatCurrency(data.stats.platformRevenue || 0)}</p>
              <div className="h-52 flex items-end gap-3">
                {data.dailyRevenue.length > 0 ? data.dailyRevenue.map(item => (
                  <div key={item.date} className="flex-1 min-w-0 h-full flex flex-col justify-end items-center gap-2" title={`${item.date}: ${formatCurrency(item.amount)}`}>
                    <div
                      className="w-full bg-indigo-600 rounded-t-lg hover:bg-indigo-500 transition-colors cursor-default"
                      style={{ height: `${Math.max((item.amount / maxRevenue) * 100, 3)}%` }}
                    />
                    <span className="text-[10px] text-slate-500 font-medium">
                      {new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })}
                    </span>
                  </div>
                )) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
                    <p className="text-sm font-medium">No payment data yet</p>
                  </div>
                )}
              </div>
            </section>

            {/* Activity Feed */}
            <section className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-black text-lg">Live Activity</h2>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">Live</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {data.activities.length > 0 ? data.activities.map((activity, index) => (
                  <div key={`${activity.type}-${activity.timestamp}-${index}`} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[16px]">{activityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">{activity.text}</p>
                      <time className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString('en-IN')}</time>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 text-center py-8">No system activity yet.</p>
                )}
              </div>
            </section>
          </div>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['/admin-verification-queue', 'pending_actions', 'Review KYC', 'bg-amber-600'],
              ['/admin-support',            'support_agent',   'Support Tickets', 'bg-rose-600'],
              ['/admin-analytics',          'analytics',       'View Analytics', 'bg-indigo-600'],
              ['/admin-users',              'group',           'User Management', 'bg-emerald-600'],
            ].map(([to, icon, label, bg]) => (
              <Link key={to} to={to} className={`${bg} text-white p-5 rounded-2xl flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-lg font-bold`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                {label}
              </Link>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
