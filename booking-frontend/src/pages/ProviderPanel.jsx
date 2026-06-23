import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ProviderPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch provider profile and bookings concurrently
      const [profileRes, bookingsRes] = await Promise.all([
        apiClient.get('/auth/profile'),
        apiClient.get('/bookings/my-bookings')
      ]);

      if (profileRes.data.success) {
        // If the backend /users/profile returns provider data alongside user data
        // Or if we need to fetch provider specifically:
        // Actually, we don't have a specific endpoint to just get "my provider profile".
        // Let's rely on user context and fetch bookings, we can calculate earnings.
      }
      
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data.bookings);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      setActionLoading(bookingId);
      const res = await apiClient.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        // Update local state
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold animate-pulse">Loading Provider Dashboard...</div>;
  }

  // Calculate metrics
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const upcomingJobs = bookings.filter(b => b.status === 'accepted').sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
  const newRequestsCount = pendingRequests.length;

  return (
    <div className="antialiased text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 font-body min-h-screen">
      {/* TopNavBar */}
      <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400">
            Service Square
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-indigo-700 dark:text-indigo-300 font-bold border-b-2 border-indigo-500 pb-1" to="/provider-panel">Dashboard</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/my-services">My Services</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider-panel">Jobs</Link>
            <Link className="text-slate-600 dark:text-slate-400 font-medium hover:text-indigo-500 transition-colors" to="/provider-earnings">Earnings</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-transform active:scale-95">notifications</button>
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden">
                {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover"/> : user?.name?.charAt(0) || 'P'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* SideNavBar - Desktop */}
        <aside className="hidden lg:flex flex-col p-6 gap-4 h-[calc(100vh-80px)] w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 sticky top-20">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">Navigation</h3>
          </div>
          <nav className="space-y-2">
            <Link className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-panel">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-portfolio">
              <span className="material-symbols-outlined">account_box</span>
              <span className="font-medium">My Portfolio</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-subscription">
              <span className="material-symbols-outlined">card_membership</span>
              <span className="font-medium">Premium Plan</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/provider-availability">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-medium">Availability</span>
            </Link>
            <Link className="text-slate-500 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-all hover:translate-x-1 active:scale-[0.98]" to="/chat">
              <span className="material-symbols-outlined">chat_bubble</span>
              <span className="font-medium">Messages</span>
            </Link>
          </nav>
          <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20">
              <p className="text-xs font-medium opacity-80 mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                <span className="font-bold">Accepting Jobs</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Provider Panel</h1>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                Welcome back, <span className="font-bold capitalize">{user?.name?.split(' ')[0] || 'Provider'}</span>. 
                You have {newRequestsCount} new job request{newRequestsCount !== 1 ? 's' : ''} waiting.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/provider-earnings" className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                View Earnings
              </Link>
              <Link to="/provider-availability" className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 rounded-xl font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all active:scale-95 hover:brightness-110 text-center">
                Manage Availability
              </Link>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Metrics Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm flex flex-col justify-between border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Earnings</p>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">${totalEarnings.toFixed(2)}</h2>
                </div>
                <div className="mt-8 h-32 w-full flex items-end gap-2">
                  {/* Simple Visual Chart Placeholder based on demo data */}
                  {[30, 50, 40, 70, 60, 100, 80].map((height, i) => (
                    <div key={i} className={`flex-1 rounded-t-lg transition-all ${i === 5 ? 'bg-indigo-600' : 'bg-indigo-100 dark:bg-indigo-900/40 hover:bg-indigo-200 dark:hover:bg-indigo-800'}`} style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <span className="material-symbols-outlined text-amber-400 text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</p>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">4.9/5</h2>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 self-start px-3 py-1.5 rounded-full mt-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +0.2 this month
                  </div>
                </div>
              </div>
            </div>

            {/* Job Requests (Asymmetric sidebar) */}
            <div className="lg:col-span-4 lg:row-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full max-h-[800px]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700 shrink-0">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600">move_to_inbox</span>
                    Job Requests
                  </h3>
                  {newRequestsCount > 0 && (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
                      {newRequestsCount} New
                    </span>
                  )}
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                      <p className="font-medium">No pending requests</p>
                    </div>
                  ) : (
                    pendingRequests.map(job => (
                      <div key={job._id} className="p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-bold text-slate-900 dark:text-white capitalize leading-tight pr-2">{job.serviceType}</div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-black text-lg">${job.amount}</div>
                        </div>
                        
                        <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                          <span className="material-symbols-outlined text-[16px] mt-0.5">location_on</span>
                          <span className="line-clamp-2 leading-snug">{job.address}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-5">
                          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                          <span>{new Date(job.scheduledStart).toLocaleDateString()} at {new Date(job.scheduledStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => handleUpdateBookingStatus(job._id, 'rejected')}
                            disabled={actionLoading === job._id}
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleUpdateBookingStatus(job._id, 'accepted')}
                            disabled={actionLoading === job._id}
                            className="bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm shadow-md shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Schedule (Wide component) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-600">event_upcoming</span>
                  Upcoming Schedule
                </h3>
                <Link to="/provider-availability" className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline text-sm bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg">
                  Full Calendar
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingJobs.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">event_busy</span>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No upcoming jobs scheduled.</p>
                  </div>
                ) : (
                  upcomingJobs.slice(0, 4).map((job, idx) => {
                    const startDate = new Date(job.scheduledStart);
                    const endDate = new Date(job.scheduledEnd);
                    const isToday = startDate.toDateString() === new Date().toDateString();
                    const monthStr = startDate.toLocaleString('default', { month: 'short' });
                    const dayStr = startDate.getDate();
                    
                    // alternate colors based on index for variety
                    const colorThemes = [
                      "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300",
                      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
                      "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
                      "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300"
                    ];
                    const theme = colorThemes[idx % colorThemes.length];

                    return (
                      <div key={job._id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all group relative overflow-hidden">
                        {isToday && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500"></div>}
                        
                        <div className={`flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-xl ${theme} shrink-0`}>
                          <span className="text-xs font-bold uppercase tracking-wider">{monthStr}</span>
                          <span className="text-2xl font-black leading-none mt-0.5">{dayStr}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg text-slate-900 dark:text-white capitalize truncate">{job.serviceType}</h4>
                            {isToday && <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-indigo-500 text-white rounded-full">Today</span>}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <p className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px]">schedule</span>
                              {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <p className="flex items-center gap-1.5 truncate">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              <span className="truncate">{job.address}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 sm:mt-0 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700 pt-3 sm:pt-0">
                          <div className="flex items-center gap-2">
                            <img className="w-10 h-10 rounded-full bg-slate-200 object-cover" src={job.customerId?.avatar || `https://ui-avatars.com/api/?name=${job.customerId?.name || 'C'}&background=random`} alt="Client" />
                            <div className="sm:hidden text-sm font-medium">{job.customerId?.name?.split(' ')[0] || 'Client'}</div>
                          </div>
                          
                          <button 
                            onClick={() => handleUpdateBookingStatus(job._id, 'completed')}
                            disabled={actionLoading === job._id}
                            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Support Widget */}
            <div className="lg:col-span-8 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h3 className="font-extrabold text-2xl mb-2">Need Provider Support?</h3>
                <p className="text-indigo-200 text-sm max-w-md">Our dedicated provider success team is available 24/7 to help you with job issues, payment questions, or account settings.</p>
              </div>
              <button className="relative z-10 w-full md:w-auto flex items-center justify-center gap-2 text-indigo-900 font-bold py-3 px-8 bg-white rounded-xl hover:bg-indigo-50 active:scale-95 transition-all shadow-lg shadow-black/20 shrink-0">
                <span className="material-symbols-outlined">headset_mic</span>
                Contact Support
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full pt-16 pb-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2">
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Service Square</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">Empowering elite service professionals. The premium marketplace for exceptional talent and discerning clients.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/provider-panel">Dashboard</Link></li>
              <li><Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/provider-earnings">Earnings</Link></li>
              <li><Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/provider-portfolio">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Support</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="#">Help Center</a></li>
              <li><a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="#">Provider Rules</a></li>
              <li><a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="#">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-slate-900 dark:text-white">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 Service Square. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">public</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">share</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
