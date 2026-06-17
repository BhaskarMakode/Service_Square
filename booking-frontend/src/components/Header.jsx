import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Inter'] antialiased tracking-tight h-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
        <Link to="/" className="text-2xl font-black tracking-tighter text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-600 rounded-lg"></span>
          Service Square
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/">Home</Link>
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/service-listing">Services</Link>
          <Link className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors" to="/provider">Become a Provider</Link>
        </nav>

        <div className="flex items-center gap-4 relative">
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
              </Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-all"
                >
                  <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4F46E5&color=fff`} className="w-8 h-8 rounded-xl shadow-sm" alt="User"/>
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
                        to={user?.role === 'provider' ? '/provider-panel' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard'} 
                        onClick={() => setIsUserMenuOpen(false)} 
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">dashboard</span> My Dashboard
                      </Link>
                      {user?.role === 'customer' && (
                        <>
                          <Link to="/address-book" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">location_on</span> Address Book
                          </Link>
                          <Link to="/invoices" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                            <span className="material-symbols-outlined text-lg">receipt</span> Transaction History
                          </Link>
                        </>
                      )}
                      <Link to="/support" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
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
              <Link to="/login" className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
