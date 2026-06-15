import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminCategories() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Home Cleaning', icon: 'cleaning_services', count: 45, status: 'Active' },
    { id: 2, name: 'Electrician', icon: 'bolt', count: 32, status: 'Active' },
    { id: 3, name: 'Plumbing Repairs', icon: 'handyman', count: 28, status: 'Active' },
    { id: 4, name: 'Appliance Repair', icon: 'home_repair_service', count: 19, status: 'Active' },
    { id: 5, name: 'Salon at Home', icon: 'content_cut', count: 12, status: 'Disabled' },
  ]);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">category</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Taxonomy Mgr</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </Link>
          <Link to="/admin-categories" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">category</span> Manage Categories
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Service Categories</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Create, disable, and group available service hierarchies</p>
          </div>
          <button className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Add New Category
          </button>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Visual Meta</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Category Name</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Providers Link</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider">Visibility</th>
                  <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <h4 className="text-slate-900 dark:text-white font-bold text-base">{cat.name}</h4>
                      <span className="text-xs text-slate-400 font-medium">cat_handle_00{cat.id}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-bold">
                        <span className="material-symbols-outlined text-lg text-slate-400">group</span>
                        {cat.count} Registered
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                        cat.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-900/20 flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
