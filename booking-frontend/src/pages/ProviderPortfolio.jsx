import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function ProviderPortfolio() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({ jobsCompleted: 0 });

  useEffect(() => {
    if (!user || user.role !== 'provider') {
      navigate('/');
      return;
    }
    fetchProfileAndData();
  }, [user, navigate]);

  const fetchProfileAndData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/profile');
      if (res.data.success && res.data.data.providerProfile) {
        const providerData = res.data.data.providerProfile;
        setProvider(providerData);
        
        // Fetch portfolio
        const portfolioRes = await apiClient.get(`/portfolio/${providerData._id}`);
        if (portfolioRes.data.success) {
          setPortfolio(portfolioRes.data.data.portfolio || []);
        }

        // Fetch bookings to calculate completed jobs
        const bookingsRes = await apiClient.get('/bookings/my-bookings');
        if (bookingsRes.data.success) {
          const completed = (bookingsRes.data.data.bookings || []).filter(b => b.status === 'completed').length;
          setMetrics({ jobsCompleted: completed });
        }
      } else {
        setError('Provider profile not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading Profile...</div>;
  }

  const name = user?.name || provider?.fullName || 'Provider';
  const category = provider?.category || 'Professional';
  const rating = provider?.rating || 'New';
  const experience = provider?.experience || 0;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      {/* Compact Provider Sub-Sidebar */}
      <aside className="w-20 md:w-64 bg-white dark:bg-slate-800 border-r border-slate-200/60 dark:border-slate-700 sticky top-0 h-screen flex flex-col transition-all z-20">
        <div className="p-4 flex justify-center md:justify-start border-b border-slate-100 dark:border-slate-700">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white">person</span>
          </div>
          <span className="hidden md:block ml-3 font-black text-slate-900 dark:text-white self-center">My Profile</span>
        </div>
        <nav className="p-3 space-y-1">
          <Link to="/provider-panel" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="hidden md:inline">Overview</span>
          </Link>
          <Link to="/provider-portfolio" className="flex items-center justify-center md:justify-start gap-3 px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">photo_library</span>
            <span className="hidden md:inline">Work Portfolio</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <div className="relative h-60 bg-gradient-to-r from-indigo-600 to-violet-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-20">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
              {error}
            </div>
          )}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
              <div className="flex gap-6 items-center md:items-end flex-wrap md:flex-nowrap">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${name}&size=120&background=4F46E5&color=fff`}
                  className="w-32 h-32 rounded-3xl border-8 border-white dark:border-slate-800 shadow-md object-cover bg-indigo-100 flex-shrink-0" 
                  alt="Profile"
                />
                <div className="mb-2 text-center md:text-left">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white capitalize">{name}</h1>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center md:justify-start gap-1 mt-1 capitalize">
                    <span className="material-symbols-outlined text-sm">work</span>
                    Professional {category}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  Edit Bio
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  Add Work
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10 py-6 border-t border-b border-slate-100 dark:border-slate-700">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{metrics.jobsCompleted}</p>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Completed Jobs</p>
              </div>
              <div className="text-center border-x border-slate-100 dark:border-slate-700">
                <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  {rating} <span className="material-symbols-outlined text-amber-400 text-xl">star</span>
                </p>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Avg Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900 dark:text-white">{experience} Yrs</p>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Experience</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                Recent Projects Showcase
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-md">{portfolio.length} Items</span>
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.length === 0 ? (
                  <div className="col-span-2 md:col-span-4 p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 font-medium">
                    No portfolio items found. Start uploading to show off your work!
                  </div>
                ) : (
                  portfolio.map((item, idx) => (
                    <div key={item._id || idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 cursor-pointer">
                      <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={item.title || "Portfolio Work"}/>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                        <button className="w-10 h-10 bg-white rounded-full text-slate-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform mb-2">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                        <span className="text-white font-bold text-sm px-2 text-center drop-shadow-md">{item.title}</span>
                      </div>
                    </div>
                  ))
                )}
                {portfolio.length > 0 && (
                  <button className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors group">
                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add_photo_alternate</span>
                    <span className="font-bold text-sm">Upload Item</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
