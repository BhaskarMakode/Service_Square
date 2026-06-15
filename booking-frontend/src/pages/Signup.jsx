import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <main className="flex-1 flex items-center justify-center p-6 py-20 bg-surface-container-low">
      <div className="w-full max-w-lg bg-surface-container-lowest editorial-shadow rounded-3xl p-8 border border-outline-variant/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Create an Account</h1>
          <p className="text-slate-500 font-medium">Join Service Square to book top-rated professionals</p>
        </div>
        <form className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
              <input type="text" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
              <input type="text" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full bg-surface-container-high border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="••••••••" />
          </div>
          <Link to="/dashboard" className="block text-center w-full py-3.5 mt-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            Create Account
          </Link>
        </form>
        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:text-indigo-500">Log in</Link>
        </div>
      </div>
    </main>
  );
}
