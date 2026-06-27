import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { formatCurrency } from '../utils/currency';

export default function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="mt-auto pt-6 px-4">
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
            <div className="text-center py-10">Loading bookings...</div>
          ) : error ? (
            <div className="text-red-500 py-10">{error}</div>
          ) : (
            <>
              {/* Stats Grid */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Active Now</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{activeBookings.length}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Completed</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{completedBookings.length}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500 text-sm font-semibold mb-1">Total Bookings</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{bookings.length}</p>
                </div>
              </section>

              <div className="space-y-12">
                {/* Active Bookings */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <h3 className="text-xl font-bold tracking-tight dark:text-white">Active Appointments</h3>
                  </div>
                  
                  {activeBookings.length === 0 ? (
                    <p className="text-slate-500">No active bookings found.</p>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {activeBookings.map((booking) => (
                        <Link key={booking._id} to={`/tracking?id=${booking._id}`} className="bg-white dark:bg-slate-900 p-6 rounded-xl flex flex-col md:flex-row gap-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
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
                            <div className="mt-auto flex items-center gap-4 text-xs text-slate-500">
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
                        </Link>
                      ))}
                    </div>
                  )}
                </section>

                {/* Completed Bookings */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <h3 className="text-xl font-bold tracking-tight dark:text-white">Previous Services</h3>
                  </div>

                  {completedBookings.length === 0 ? (
                    <p className="text-slate-500">No previous bookings found.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {completedBookings.map((booking) => (
                        <div key={booking._id} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-slate-100 dark:border-slate-700">
                          <div className="flex-1 w-full text-center sm:text-left">
                            <h5 className="font-bold text-slate-900 dark:text-white capitalize">{booking.serviceType || 'Service'}</h5>
                            <p className="text-xs text-slate-500">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                          </div>
                          <div className="hidden md:block px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
                            Completed
                          </div>
                          <div className="text-right w-full sm:w-auto flex justify-between sm:block">
                            <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(booking.amount)}</p>
                            <Link to={`/review?bookingId=${booking._id}`} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider hover:underline">Write Review</Link>
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
