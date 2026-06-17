import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If they landed here without a token and aren't authenticated, redirect to login to verify OTP first
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await register({ name, email, role });
      if (res.success) {
        // Redirect based on role
        if (role === 'provider') {
          navigate('/provider-panel');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || "Failed to register.");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 py-20 bg-surface-container-low selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-surface-container-lowest editorial-shadow rounded-3xl p-8 border border-outline-variant/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2">Complete Profile</h1>
          <p className="text-slate-500 font-medium">Almost there! Tell us a bit about yourself.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'customer' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Customer
          </button>
          <button 
            type="button"
            onClick={() => setRole('provider')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'provider' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-lg">engineering</span>
            Provider
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all dark:bg-slate-800 dark:text-white" 
              placeholder="Jane Doe" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address (Optional)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all dark:bg-slate-800 dark:text-white" 
              placeholder="you@example.com" 
            />
          </div>
          <div className="pt-2 text-sm text-slate-500">
            Phone Number: <strong>{location.state?.phone || 'Verified via OTP'}</strong>
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="block text-center w-full py-4 mt-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
          >
            {loading ? 'Saving...' : 'Complete Account'}
          </button>
        </form>
      </div>
    </main>
  );
}
