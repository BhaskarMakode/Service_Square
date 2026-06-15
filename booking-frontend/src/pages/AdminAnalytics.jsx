import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminAnalytics() {
  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      {/* Sidebar Navigation Shared Block */}
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">analytics</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Analytics Hub</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </Link>
          <Link to="/admin-analytics" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">bar_chart</span> Data & Charts
          </Link>
          <Link to="/admin-verification-queue" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">verified</span> KYC Queue
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 sticky top-0 z-10">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Platform Revenue & User Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Aggregated from core metrics API endpoints</p>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* High Level Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <p className="text-indigo-100 text-sm font-bold uppercase tracking-widest">Total Net Value (GMV)</p>
                <h2 className="text-4xl font-black mt-2">$1,205,400</h2>
                <div className="flex items-center mt-6 gap-2 text-indigo-50 font-bold text-sm">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span>14.2% MoM growth</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Platform Revenue (Fees)</p>
              <h2 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">$180,810</h2>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded-full">+8.1% vs targets</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase">Avg Order Value (AOV)</p>
              <h2 className="text-4xl font-black mt-2 text-slate-900 dark:text-white">$45.50</h2>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold rounded-full">Consistent</span>
              </div>
            </div>
          </div>

          {/* Grid Section for Category Breakdown and Heatmap Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Categories Area Chart Emulation */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">Booking Volume By Category</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Live Updates</span>
              </div>
              <div className="space-y-5 mt-6">
                {[
                  { name: 'Cleaning Services', count: 1450, pct: 75, color: 'bg-blue-500' },
                  { name: 'Plumbing', count: 890, pct: 45, color: 'bg-indigo-500' },
                  { name: 'Electrician', count: 1100, pct: 60, color: 'bg-emerald-500' },
                  { name: 'Salon At Home', count: 420, pct: 25, color: 'bg-rose-500' },
                  { name: 'Appliance Repair', count: 680, pct: 38, color: 'bg-amber-500' }
                ].map((cat, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between text-sm font-bold mb-1.5">
                      <span className="text-slate-700 dark:text-slate-300">{cat.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">{cat.count} ops</span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${cat.color}`} 
                        style={{ width: `${cat.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geographical Heatmap Simulation */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-lg text-white mb-2 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geographic Density
                  </h3>
                  <p className="text-slate-400 text-sm font-medium">Live clustering of active user requests.</p>
                </div>

                <div className="relative w-full aspect-video bg-slate-800 rounded-xl flex items-center justify-center overflow-hidden border border-slate-700/50 group">
                  <span className="text-slate-500 font-black tracking-widest uppercase text-xs group-hover:scale-110 transition-transform">Dynamic Map Engine Rendering</span>
                  {/* Floating Heat Nodes */}
                  <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-indigo-500/40 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-emerald-500/30 rounded-full blur-xl animate-pulse duration-2000"></div>
                  <div className="absolute top-1/2 right-1/2 w-8 h-8 bg-rose-500/40 rounded-full blur-xl animate-pulse duration-1500"></div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-col">
                    <span className="text-white font-black">Bengaluru</span>
                    <span className="text-slate-500 text-xs font-bold">Top Active Hub</span>
                  </div>
                  <div className="text-emerald-400 font-black text-xl">42%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
