import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/currency';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiClient.get('/bookings/my-bookings');
        if (response.data.success) {
          setBookings(response.data.data.bookings || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = bookings.filter(b => ['pending', 'accepted'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setCancellingId(bookingId);
      const res = await apiClient.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      if (res.data.success) {
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex fixed left-0 top-20 flex-col p-6 gap-4 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 h-screen w-72 rounded-r-3xl font-['Inter'] text-sm font-medium">
          <div className="mb-6 px-4">
            <h2 className="text-on-surface font-bold text-lg">My Account</h2>
            <p className="text-on-surface-variant text-xs">Manage your interactions</p>
          </div>
          <nav className="space-y-2">
            <Link className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/dashboard">
              <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
              <span>Dashboard Overview</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/chat">
              <span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
              <span>Messages</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/address-book">
              <span className="material-symbols-outlined" data-icon="location_on">location_on</span>
              <span>Address Book</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/invoices">
              <span className="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
              <span>Invoices</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-900/50 rounded-xl hover:translate-x-1 transition-all active:scale-[0.98] duration-150" to="/support">
              <span className="material-symbols-outlined" data-icon="help_center">help_center</span>
              <span>Support</span>
            </Link>
          </nav>
          <div className="mt-auto pt-6 px-4 space-y-3">
            <Link to="/provider" className="w-full inline-flex justify-center items-center gap-2 py-3 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              <span className="material-symbols-outlined text-sm">storefront</span>
              Become a Provider
            </Link>
            <Link to="/service-listing" className="w-full inline-flex justify-center py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform duration-200">
              Book New Service
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 md:p-12 max-w-7xl">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Your Bookings</h1>
            <p className="text-slate-500 text-lg">Manage your active and previous service appointments.</p>
          </header>

          {loading ? (
            <div className="animate-pulse space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-10 font-bold bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">{error}</div>
          ) : (
            <>
              {/* Stats Grid */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-500/30 transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-8xl">local_activity</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-indigo-100 text-sm font-bold tracking-widest uppercase mb-2">Active Now</p>
                    <p className="text-5xl font-black">{activeBookings.length}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 rounded-3xl text-white shadow-lg shadow-emerald-500/30 transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-8xl">task_alt</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-emerald-100 text-sm font-bold tracking-widest uppercase mb-2">Completed</p>
                    <p className="text-5xl font-black">{completedBookings.length}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-lg shadow-slate-900/30 transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                    <span className="material-symbols-outlined text-8xl">library_books</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Total Bookings</p>
                    <p className="text-5xl font-black">{bookings.length}</p>
                  </div>
                </div>
              </section>

              <div className="space-y-12">
                {/* Active Bookings */}
                <section>
                  <div className="flex items-center gap-4 mb-8 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Active Appointments</h3>
                      <p className="text-sm text-slate-500 font-medium">Services that are pending or ongoing</p>
                    </div>
                  </div>
                  
                  {activeBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm text-center">
                      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-indigo-500">calendar_month</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Active Appointments</h4>
                      <p className="text-slate-500 max-w-sm mb-8">You don't have any ongoing or upcoming service bookings at the moment.</p>
                      <Link to="/service-listing" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
                        Book a Service
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {activeBookings.map((booking) => (
                        <div key={booking._id} className="bg-white dark:bg-slate-900 p-6 rounded-xl flex flex-col justify-between border border-slate-200 dark:border-slate-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 group">
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {booking.status}
                              </div>
                              <p className="font-black text-lg text-indigo-600 dark:text-indigo-400">{formatCurrency(booking.amount)}</p>
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white leading-tight capitalize">{booking.serviceType || 'Service'}</h4>
                            <p className="text-slate-500 text-sm mb-4">
                              Address: <span className="text-slate-700 dark:text-slate-300 font-semibold">{booking.address}</span>
                            </p>
                            <div className="mt-auto flex items-center gap-4 text-xs text-slate-500 mb-6">
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">event</span>
                                {new Date(booking.bookingDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                {new Date(booking.scheduledStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                            <Link to={`/tracking?id=${booking._id}`} className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors">
                              Track Service
                            </Link>
                            <Link to={`/chat?bookingId=${booking._id}`} className="flex-1 text-center py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">chat_bubble</span>
                              Message
                            </Link>
                            {booking.status === 'pending' && (
                              <button 
                                onClick={() => handleCancelBooking(booking._id)}
                                disabled={cancellingId === booking._id}
                                className="flex-1 text-center py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Completed Bookings */}
                <section>
                  <div className="flex items-center gap-4 mb-8 bg-slate-100 dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 mt-20">
                    <div className="w-12 h-12 rounded-2xl bg-slate-700 text-white flex items-center justify-center shadow-lg shadow-slate-700/30">
                      <span className="material-symbols-outlined text-[24px]">history</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Previous Services</h3>
                      <p className="text-sm text-slate-500 font-medium">Your past service history</p>
                    </div>
                  </div>

                  {completedBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm text-center">
                      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-4xl text-slate-400">history</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No History Yet</h4>
                      <p className="text-slate-500 max-w-sm">Your completed service appointments will appear here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {completedBookings.map((booking) => (
                        <div key={booking._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl flex flex-col justify-between border border-slate-200 dark:border-slate-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                              </div>
                              <div>
                                <h5 className="font-bold text-lg text-slate-900 dark:text-white capitalize leading-tight">{booking.serviceType || 'Service'}</h5>
                                <p className="text-xs font-semibold text-slate-500 mt-1">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-lg text-slate-900 dark:text-white">{formatCurrency(booking.amount)}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                              Completed
                            </span>
                            <Link to={`/review?bookingId=${booking._id}`} className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group-hover:underline">
                              <span className="material-symbols-outlined text-[16px]">rate_review</span>
                              Write Review
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
      
      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 py-4 px-8 flex justify-between items-center z-50">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>
        <Link to="/service-listing" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <Link to="/address-book" className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">location_on</span>
          <span className="text-[10px] font-medium">Address</span>
        </Link>
      </nav>
    </>
  );
}
