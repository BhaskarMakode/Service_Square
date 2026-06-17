import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    } else {
      setError("No booking ID found.");
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/bookings/${bookingId}`);
      if (res.data.success) {
        setBooking(res.data.data.booking);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading Confirmation...</div>;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 font-bold">{error || "Booking not found"}</div>
        <Link to="/" className="text-indigo-600 underline font-bold">Return Home</Link>
      </div>
    );
  }

  const providerName = booking.providerId?.userId?.name || booking.providerId?.fullName || "Your Provider";
  const providerCategory = booking.serviceType || "Service";
  const avatarUrl = booking.providerId?.userId?.avatar || `https://ui-avatars.com/api/?name=${providerName}&background=4F46E5&color=fff&size=512`;
  
  const dateObj = new Date(booking.scheduledStart);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endDateObj = new Date(booking.scheduledEnd);
  const formattedEndTime = endDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="antialiased text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-body min-h-screen">
      {/* Top Navigation (Reduced for Transactional Context) */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm h-20 border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
          <span className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">Service Square</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Booking Flow</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Hero Confirmation Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Your request has been accepted. We've notified your provider.</p>
          <div className="mt-6 inline-block px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-sm font-bold tracking-widest text-indigo-700 dark:text-indigo-400 uppercase">Order ID: #{booking._id.slice(-6).toUpperCase()}</span>
          </div>
        </section>

        {/* Bento Layout for Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Provider Card (Featured Artist) */}
          <div className="md:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -mr-12 -mt-12"></div>
            <h3 className="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase mb-6">Service Provider</h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img alt={providerName} className="w-24 h-24 rounded-xl object-cover bg-indigo-50" src={avatarUrl}/>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{providerName}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-3 capitalize">{providerCategory} Professional</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-xs font-semibold rounded-full text-indigo-600 dark:text-indigo-400">Verified</span>
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-xs font-semibold rounded-full text-amber-600 dark:text-amber-400">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Card */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Time & Date */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-start gap-4 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">calendar_today</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Appointment</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{formattedDate}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formattedTime} - {formattedEndTime}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 flex items-start gap-4 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">location_on</span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{booking.address}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary (Spanning) */}
          <div className="md:col-span-12 bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">payments</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Payment Status</p>
                  <p className="font-bold text-slate-900 dark:text-white">Authorized (Not Charged)</p>
                </div>
              </div>
              <div className="h-px w-full md:h-12 md:w-px bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center md:text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Amount</p>
                <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">${booking.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={`/tracking?bookingId=${booking._id}`} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-center inline-block">
            Track Service
          </Link>
          <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all duration-200 text-center inline-block">
            Back to Home
          </Link>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">Service Square</div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">© 2024 Service Square. Premium Editorial Marketplace.</p>
        </div>
      </footer>
    </div>
  );
}
