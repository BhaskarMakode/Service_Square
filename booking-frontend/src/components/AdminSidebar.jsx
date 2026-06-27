import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  ['/admin-dashboard',          'grid_view',       'Overview'],
  ['/admin-verification-queue', 'verified_user',   'Provider Verification'],
  ['/admin-users',              'group',           'User Management'],
  ['/admin-support',            'support_agent',   'Support Tickets'],
  ['/admin-analytics',          'analytics',       'Analytics'],
  ['/admin-categories',         'category',        'Categories'],
  ['/admin-reports',            'report',          'Reports'],
];

function AdminSidebar({ active }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 gap-2 z-50 border-r border-slate-200 dark:border-slate-800">
      <Link to="/" className="flex items-center gap-3 px-2 mb-6">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 leading-none">Service Square</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Admin Console</p>
        </div>
      </Link>
      <nav className="flex-1 flex flex-col gap-1">
        {NAV_LINKS.map(([to, icon, label]) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 ${
              active === to
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined text-xl" style={active === to ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
            <span className="text-sm font-medium tracking-wide">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="flex w-full items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export { AdminSidebar, NAV_LINKS };
export default AdminSidebar;
