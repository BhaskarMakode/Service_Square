import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [role, setRole] = useState('customer');

  const roleTargets = {
    customer: '/dashboard',
    provider: '/provider-panel',
    admin: '/admin-dashboard'
  };

  return (
    <main className="flex-1 flex items-center justify-center p-6 py-20 bg-slate-50 dark:bg-slate-950 min-h-screen font-body selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Select your role to access your account</p>
        </div>

        {/* Modern Role Selector */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
          <button 
            onClick={() => setRole('customer')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'customer' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Customer
          </button>
          <button 
            onClick={() => setRole('provider')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'provider' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <span className="material-symbols-outlined text-lg">engineering</span>
            Provider
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${role === 'admin' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
            Admin
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Email Address</label>
            <input type="email" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Password</label>
            <input type="password" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" placeholder="••••••••" />
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Remember me</span>
            </label>
            <a href="#" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:opacity-80">Forgot password?</a>
          </div>

          <Link 
            to={roleTargets[role]} 
            className="block text-center w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl hover:shadow-xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/20"
          >
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Link>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
          Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign up now</Link>
        </div>
      </div>
    </main>
  );
}
