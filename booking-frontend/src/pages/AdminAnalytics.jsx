import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [revenueData, setRevenueData] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [revRes, bookRes] = await Promise.all([
        apiClient.get('/analytics/revenue'),
        apiClient.get('/analytics/bookings')
      ]);

      if (revRes.data.success) {
        setRevenueData(revRes.data.data.summary);
      }
      if (bookRes.data.success) {
        setBookingData(bookRes.data.data.statusSummary);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading Analytics...</div>;
  }

  const totalGMV = revenueData?.totalRevenue || 0;
  const platformFees = revenueData?.totalPlatformEarnings || 0;
  const totalTransactions = revenueData?.transactions || 0;
  const aov = totalTransactions > 0 ? (totalGMV / totalTransactions) : 0;

  // For booking volume, we use status summary from backend instead of categories since category breakdown isn't available
  const bookingStatusData = bookingData || [];
  const totalBookings = bookingStatusData.reduce((sum, item) => sum + item.count, 0) || 1; // avoid division by zero

  const statusColors = {
    completed: 'bg-emerald-500',
    pending: 'bg-amber-500',
    accepted: 'bg-blue-500',
    rejected: 'bg-rose-500',
    cancelled: 'bg-slate-500'
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      {/* Sidebar Navigation Shared Block */}
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">analytics</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Analytics Hub</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </Link>
          <Link to="/admin-analytics" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">bar_chart</span> Data & Charts
          </Link>
          <Link to="/admin-verification-queue" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">verified</span> KYC Queue
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 sticky top-0 z-10">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Revenue & User Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Aggregated from core metrics API endpoints</p>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* High Level Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Total Net Value (GMV)</p>
                <h2 className="text-4xl font-black mt-2">${totalGMV.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
                <div className="flex items-center mt-6 gap-2 text-indigo-50 font-bold text-sm">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span>From all successful payments</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Platform Revenue (Fees)</p>
              <h2 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">${platformFees.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded-full">Retained Earnings</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Avg Order Value (AOV)</p>
              <h2 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">${aov.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded-full">{totalTransactions} transactions</span>
              </div>
            </div>
          </div>

          {/* Grid Section for Category Breakdown and Heatmap Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Volume Status Chart */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Booking Volume By Status</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full">Live Updates</span>
              </div>
              <div className="space-y-5 mt-6">
                {bookingStatusData.map((stat, i) => {
                  const pct = (stat.count / totalBookings) * 100;
                  const color = statusColors[stat.status] || 'bg-slate-500';
                  return (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between text-sm font-bold mb-1.5">
                        <span className="text-slate-700 dark:text-slate-300 capitalize">{stat.status}</span>
                        <span className="text-slate-500 dark:text-slate-400">{stat.count} bookings</span>
                      </div>
                      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${color}`} 
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                {bookingStatusData.length === 0 && (
                  <p className="text-slate-500 text-center py-4">No booking data available.</p>
                )}
              </div>
            </div>

            {/* Geographical Heatmap Simulation */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-lg text-white mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geographic Density
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">Live clustering of active user requests.</p>
                </div>

                <div className="relative w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700/50 group mt-4 mb-4">
                  <span className="text-slate-500 font-black tracking-widest uppercase text-xs group-hover:scale-110 transition-transform">Dynamic Map Engine Rendering</span>
                  {/* Floating Heat Nodes */}
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-indigo-500/40 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-emerald-500/30 rounded-full blur-xl animate-pulse duration-2000"></div>
                  <div className="absolute top-1/2 right-1/2 w-8 h-8 bg-rose-500/40 rounded-full blur-xl animate-pulse duration-1500"></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-col">
                    <span className="text-white font-black">Bengaluru</span>
                    <span className="text-slate-500 text-xs font-bold">Top Active Hub</span>
                  </div>
                  <div className="text-emerald-400 font-black text-xl">42%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
