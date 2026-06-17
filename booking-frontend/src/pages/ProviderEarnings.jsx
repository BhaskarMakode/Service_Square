import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ProviderEarnings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchEarnings();
  }, [user, navigate]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data.bookings || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading earnings...</div>;
  }

  // Analytics Calculations
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const allEarnedBookings = bookings.filter(b => ['completed', 'accepted'].includes(b.status)); // or just completed for actual balance
  
  const availableBalance = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // This month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthBookings = completedBookings.filter(b => {
    const d = new Date(b.scheduledStart);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const thisMonthEarnings = thisMonthBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // Platform fees (mocked at 15% for display)
  const platformFees = availableBalance * 0.15;

  // Average job value
  const avgJobValue = completedBookings.length > 0 ? (availableBalance / completedBookings.length) : 0;

  // Recent payouts
  const payouts = completedBookings.slice(0, 10).map(b => {
    return [
      b.serviceType,
      new Date(b.scheduledStart).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      b.status,
      `$${b.amount.toFixed(2)}`
    ];
  });

  return (
    <main className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-white font-body">
      <section className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold mb-5 shadow-sm border border-emerald-200 dark:border-emerald-800">
              <span className="material-symbols-outlined text-lg">payments</span>
              Provider Portal
            </span>
            <h1 className="text-5xl font-black tracking-tight mb-3">Earnings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Track payouts, completed services, fees, and monthly performance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all text-center" to="/provider-panel">
              Dashboard
            </Link>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 text-center">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Download statement
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            ['Available balance', `$${availableBalance.toFixed(2)}`, 'account_balance_wallet', 'bg-indigo-600 text-white shadow-indigo-500/20'],
            ['This month', `$${thisMonthEarnings.toFixed(2)}`, 'trending_up', 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'],
            ['Platform fees', `$${platformFees.toFixed(2)}`, 'receipt_long', 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'],
            ['Avg. job value', `$${avgJobValue.toFixed(2)}`, 'bar_chart', 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'],
          ].map(([label, value, icon, styleClass]) => (
            <div className={`${styleClass} rounded-2xl p-6 border shadow-sm transition-transform hover:-translate-y-1`} key={label}>
              <span className={`material-symbols-outlined mb-5 p-3 rounded-xl inline-block ${label === 'Available balance' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400'}`}>
                {icon}
              </span>
              <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${label === 'Available balance' ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{label}</p>
              <p className="text-3xl font-black truncate">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
          <section className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Recent payouts</h2>
              <button className="text-indigo-600 dark:text-indigo-400 font-bold">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {payouts.length === 0 ? (
                     <tr>
                       <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No completed bookings found.</td>
                     </tr>
                  ) : (
                    payouts.map(({id, service, date, status, amount}) => (
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors" key={id}>
                        <td className="px-6 py-5 font-bold capitalize">{service}</td>
                        <td className="px-6 py-5 text-slate-500 dark:text-slate-400">{date}</td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold capitalize">
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-black text-indigo-600 dark:text-indigo-400">{amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500">insights</span>
              Weekly trend
            </h2>
            <div className="h-64 flex items-end gap-2 flex-1">
              {[42, 58, 35, 76, 62, 90, 68].map((height, index) => {
                const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                const isToday = index === 5; // mockup current day
                return (
                  <div className="flex-1 flex flex-col items-center gap-3 group" key={index}>
                    <div className="w-full relative h-full flex items-end justify-center">
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${isToday ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800'}`} 
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>{days[index]}</span>
                  </div>
                )
              })}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
