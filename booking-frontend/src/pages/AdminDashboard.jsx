import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    activeBookings: 0,
    totalRevenue: 0,
    transactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardStats();
  }, [user, navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data.stats);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const activities = [
    { type: 'booking', text: 'New Electrician booking in Bengaluru', time: '2 min ago' },
    { type: 'provider', text: 'Amit Sharma requested profile verification', time: '15 min ago' },
    { type: 'payment', text: 'Platform commission received: $45.00', time: '1 hour ago' },
    { type: 'report', text: 'New support ticket filed regarding refund', time: '3 hours ago' }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading Admin Dashboard...</div>;
  }

  const statsCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, change: '+12%', icon: 'group', color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { label: 'Total Providers', value: stats?.totalProviders || 0, change: '+5.4%', icon: 'engineering', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+23%', icon: 'payments', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { label: 'Active Bookings', value: stats?.activeBookings || 0, change: '+2', icon: 'bookmark_added', color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 dark:border-slate-700/50 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">dashboard</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm transition-all">
            <span className="material-symbols-outlined">grid_view</span>
            Dashboard Overview
          </Link>
          <Link to="/admin-analytics" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm transition-all">
            <span className="material-symbols-outlined">analytics</span>
            Platform Analytics
          </Link>
          <Link to="/admin-verification-queue" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm transition-all">
            <span className="material-symbols-outlined">verified</span>
            KYC Queue
          </Link>
          <Link to="/admin-categories" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm transition-all">
            <span className="material-symbols-outlined">category</span>
            Categories
          </Link>
          <Link to="/admin-reports" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm transition-all">
            <span className="material-symbols-outlined">report</span>
            Moderation Center
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-8 py-5 sticky top-0 z-20 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Core Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Live operational data & platform health</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-indigo-50 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
              <img src={user?.avatar || "https://ui-avatars.com/api/?name=Admin&background=4F46E5&color=fff"} className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" alt="Admin"/>
              <span className="font-bold text-slate-800 dark:text-white text-sm capitalize">{user?.name || 'Root Admin'}</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-transform hover:-translate-y-1 cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${item.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                    {item.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{item.value}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats Chart Placeholder */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black text-slate-900 dark:text-white text-lg">Platform Revenue Activity</h2>
                <select className="bg-slate-50 dark:bg-slate-700 border-none text-slate-900 dark:text-white text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500">
                  <option>Past 7 Days</option>
                  <option>Past Month</option>
                </select>
              </div>
              <div className="h-64 w-full flex items-end justify-between gap-3 px-2">
                {[40, 70, 55, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className="w-full bg-indigo-50 dark:bg-slate-700 rounded-xl overflow-hidden flex items-end relative h-56">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:to-indigo-300 transition-all duration-500 rounded-t-xl" 
                        style={{ height: `${h}%` }}
                      ></div>
                    </div>
                    <span className="mt-3 text-xs font-bold text-slate-400">Day {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Realtime Log */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="font-black text-slate-900 dark:text-white text-lg mb-6">System Activity</h2>
              <div className="space-y-5">
                {activities.map((act, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug">{act.text}</p>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 inline-block">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
                View All Logs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
