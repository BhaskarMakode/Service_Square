import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../services/apiClient';

const SELF_MANAGED_ROUTES = [
  '/provider-panel',
  '/verification-status',
  '/booking',
  '/booking-page',
  '/admin-dashboard',
  '/admin-analytics',
  '/admin-categories',
  '/admin-reports',
  '/admin-verification-queue',
  '/admin-verification-detail',
  '/admin/queue',
  '/admin/detail',
  '/admin-support',
  '/admin-users',
];

export default function Header() {
  // ✅ ALL HOOKS MUST BE CALLED FIRST — before any conditional return
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, user, providerProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ useEffect BEFORE any early return
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await apiClient.get('/notifications', { params: { isRead: false, limit: 1 } });
        if (!cancelled && res.data?.success) {
          setUnreadCount(res.data.data?.pagination?.total || 0);
        }
      } catch {
        // silently ignore
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isAuthenticated, location.pathname]);

  // ✅ Conditional early return AFTER all hooks
  if (SELF_MANAGED_ROUTES.includes(location.pathname)) return null;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight h-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
        {/* Logo + Back */}
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 mr-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 active:scale-95 flex items-center justify-center cursor-pointer"
              title="Go Back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          )}
          <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            Service Square
          </Link>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/">Home</Link>
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/service-listing">Services</Link>
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/provider">Become a Provider</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 relative">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
                title={unreadCount > 0 ? `${unreadCount} unread` : 'Notifications'}
                onClick={() => setUnreadCount(0)}
              >
                <span className="material-symbols-outlined" style={unreadCount > 0 ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {unreadCount > 0 ? 'notifications_active' : 'notifications'}
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-all"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`}
                    className="w-8 h-8 rounded-xl shadow-sm object-cover"
                    alt="User"
                  />
                  <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[999]">
                    <div className="p-4 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || user?.phone || 'Guest'}</p>
                      <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      <Link
                        to={
                          user?.role === 'provider'
                            ? (providerProfile?.verificationStatus === 'approved' ? '/provider-panel' : '/verification-status')
                            : user?.role === 'admin' ? '/admin-dashboard'
                            : '/dashboard'
                        }
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">dashboard</span> My Dashboard
                      </Link>
                      {user?.role === 'customer' && (
                        <>
                          <Link to="/address-book" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">location_on</span> Address Book
                          </Link>
                          <Link to="/invoices" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">receipt</span> Transaction History
                          </Link>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin-support" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-lg">support_agent</span> Support Tickets
                        </Link>
                      )}
                      <Link to="/support" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-lg">help</span> Support Hub
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-50 dark:border-slate-700">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
