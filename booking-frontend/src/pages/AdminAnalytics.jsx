import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import AdminSidebar from '../components/AdminSidebar';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function LineChart({ data, valueKey = 'amount', labelKey = 'month', color = '#4F46E5' }) {
  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No data available</div>;
  }
  const values = data.map(d => Number(d[valueKey] || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const W = 400, H = 120, pad = 12;
  const pts = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (W - pad * 2);
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });
  const areaPath = `M${pts[0][0]},${pts[0][1]}` + pts.slice(1).map(([x,y]) => `L${x},${y}`).join('') + `L${pts[pts.length-1][0]},${H-pad}L${pts[0][0]},${H-pad}Z`;
  const linePath = `M${pts[0][0]},${pts[0][1]}` + pts.slice(1).map(([x,y]) => `L${x},${y}`).join('');
  const gradId = `g${color.replace('#','')}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40 overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
        {data.map((d, i) => {
          const lbl = d[labelKey];
          return <span key={i}>{typeof lbl === 'number' ? MONTH_NAMES[lbl - 1] : String(lbl || '').slice(-5)}</span>;
        })}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [revenueData, setRevenueData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [revRes, bookRes, provRes, usrRes] = await Promise.all([
        apiClient.get('/analytics/revenue'),
        apiClient.get('/analytics/bookings'),
        apiClient.get('/analytics/providers'),
        apiClient.get('/analytics/users'),
      ]);
      if (revRes.data.success) setRevenueData(revRes.data.data);
      if (bookRes.data.success) setBookingData(bookRes.data.data);
      if (provRes.data.success) setProviderData(provRes.data.data);
      if (usrRes.data.success) setUserData(usrRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  // Backend returns: monthlyRevenue[].{month, revenue, platformEarnings, providerEarnings, transactions}
  const rev = revenueData?.summary || {};
  const monthlyRevenue = revenueData?.monthlyRevenue || [];
  // Backend returns: monthlyBookings[].{month, status, count, amount}; statusSummary[].{status, count, amount}
  const statusSummary = bookingData?.statusSummary || [];
  const monthlyBookings = bookingData?.monthlyBookings || [];
  // collapse monthlyBookings by month for chart
  const monthlyBookingsCollapsed = Array.from(
    monthlyBookings.reduce((acc, item) => {
      const existing = acc.get(item.month) || { month: item.month, count: 0 };
      existing.count += item.count || 0;
      acc.set(item.month, existing);
      return acc;
    }, new Map()).values()
  ).sort((a, b) => a.month - b.month);

  const totalBookings = statusSummary.reduce((s, b) => s + (b.count || 0), 0) || 1;
  const topProviders = providerData?.providers || providerData?.topProviders || [];
  // userData: roleSummary[].{role,count}, monthlyUsers[].{month,role,count}
  const roleSummary = userData?.roleSummary || [];
  const monthlyUsers = userData?.monthlyUsers || [];
  const monthlyUsersCollapsed = Array.from(
    monthlyUsers.reduce((acc, item) => {
      const existing = acc.get(item.month) || { month: item.month, count: 0 };
      existing.count += item.count || 0;
      acc.set(item.month, existing);
      return acc;
    }, new Map()).values()
  ).sort((a, b) => a.month - b.month);

  const usersByRole = (role) => roleSummary.find(r => r.role === role)?.count || 0;

  const STATUS_COLORS = {
    completed: 'bg-emerald-500',
    pending:   'bg-amber-500',
    accepted:  'bg-blue-500',
    rejected:  'bg-rose-500',
    cancelled: 'bg-slate-400',
  };

  if (loading) return (
    <div className="min-h-screen flex">
      <AdminSidebar active="/admin-analytics" />
      <main className="ml-64 flex-1 grid place-items-center">
        <div className="text-center animate-pulse">
          <span className="material-symbols-outlined text-5xl text-indigo-300 mb-4 block">analytics</span>
          <p className="font-bold text-slate-500">Loading analytics...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex font-body antialiased">
      <AdminSidebar active="/admin-analytics" />

      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Platform Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">Revenue, bookings, providers, and user insights</p>
          </div>
          <button onClick={fetchAnalytics} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
          </button>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-medium border border-red-100 dark:border-red-800 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>{error}
              <button onClick={fetchAnalytics} className="ml-auto underline font-bold">Retry</button>
            </div>
          )}

          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              ['Total GMV',           rev.totalRevenue || 0,           'payments',              'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'],
              ['Platform Commission', rev.totalPlatformEarnings || 0,  'account_balance',       'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'],
              ['Provider Payouts',    rev.totalProviderEarnings || 0,  'account_balance_wallet','bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'],
              ['Total Transactions',  rev.transactions || 0,           'receipt_long',          'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'],
            ].map(([label, val, icon, cls]) => (
              <div key={label} className={`rounded-3xl p-6 ${cls}`}>
                <span className={`material-symbols-outlined text-2xl mb-3 block ${cls.includes('bg-indigo') ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${cls.includes('bg-indigo') ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>{label}</p>
                <h2 className="text-3xl font-black">{typeof val === 'number' && label !== 'Total Transactions' ? formatCurrency(val) : val}</h2>
              </div>
            ))}
          </div>

          {/* Revenue Line Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-xl">Monthly Revenue Trend</h3>
                <p className="text-sm text-slate-500 mt-0.5">Platform commission earnings — {revenueData?.year || new Date().getFullYear()}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Live Data
              </span>
            </div>
            <LineChart
              data={monthlyRevenue}
              valueKey="platformEarnings"
              labelKey="month"
              color="#4F46E5"
            />
            {monthlyRevenue.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">This Month</p>
                  <p className="text-lg font-black text-indigo-600">{formatCurrency(monthlyRevenue[monthlyRevenue.length - 1]?.platformEarnings || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Month</p>
                  <p className="text-lg font-black">{formatCurrency(monthlyRevenue[monthlyRevenue.length - 2]?.platformEarnings || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">All Time GMV</p>
                  <p className="text-lg font-black">{formatCurrency(rev.totalRevenue || 0)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Bookings + Users */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="font-black text-lg mb-4">Monthly Bookings</h3>
              <LineChart data={monthlyBookingsCollapsed} valueKey="count" labelKey="month" color="#10B981" />
              <div className="mt-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Status Breakdown</p>
                <div className="space-y-3">
                  {statusSummary.map(stat => {
                    const pct = Math.round(((stat.count || 0) / totalBookings) * 100);
                    return (
                      <div key={stat.status}>
                        <div className="flex justify-between text-sm font-bold mb-1">
                          <span className="capitalize">{stat.status}</span>
                          <span className="text-slate-500">{stat.count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${STATUS_COLORS[stat.status] || 'bg-slate-500'}`} style={{ width: `${pct}%`, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                  {statusSummary.length === 0 && <p className="text-slate-400 text-sm">No booking data available.</p>}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="font-black text-lg mb-4">User Growth</h3>
              <LineChart data={monthlyUsersCollapsed} valueKey="count" labelKey="month" color="#8B5CF6" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ['Customers', usersByRole('customer')],
                  ['Providers', usersByRole('provider')],
                  ['Admins',    usersByRole('admin')],
                ].map(([label, val]) => (
                  <div key={label} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl text-center">
                    <p className="text-2xl font-black">{val}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{label}</p>
                  </div>
                ))}
              </div>
              {userData && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">Active Verified Users</p>
                  <p className="text-2xl font-black text-purple-700 dark:text-purple-300">{userData.activeUsers || 0}</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Providers */}
          {topProviders.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
              <h3 className="font-black text-xl mb-6">Top Providers by Revenue</h3>
              <div className="space-y-4">
                {topProviders.slice(0, 10).map((p, i) => {
                  const maxEarnings = topProviders[0]?.totalEarnings || 1;
                  const pct = Math.round(((p.totalEarnings || 0) / maxEarnings) * 100);
                  return (
                    <div key={p.providerId || i} className="flex items-center gap-4">
                      <span className="w-6 text-sm font-black text-slate-400 text-right shrink-0">{i + 1}</span>
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'P')}&background=4F46E5&color=fff`}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                        alt={p.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold truncate">{p.name || 'Provider'}</span>
                          <span className="text-sm font-black text-indigo-600 shrink-0 ml-2">{formatCurrency(p.totalEarnings || 0)}</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%`, transition: 'width 1s ease' }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{p.completedBookings || 0} completed · {p.category || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
