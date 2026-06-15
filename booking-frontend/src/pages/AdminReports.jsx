import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminReports() {
  const reports = [
    { id: '#REP-7742', reporter: 'Kiran Desai', target: 'Amit Service Pvt', reason: 'Incomplete job, refused refund', status: 'Pending', date: '12 May 2026' },
    { id: '#REP-7741', reporter: 'System Bot', target: 'Bot Account #44', reason: 'Suspicious frequent spam booking', status: 'Investigating', date: '11 May 2026' },
    { id: '#REP-7738', reporter: 'Sarah Khan', target: 'John Cleaner', reason: 'Extremely late arrival', status: 'Resolved', date: '10 May 2026' },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Investigating': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50';
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900">
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">gavel</span>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Safety Center</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin-dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl font-semibold text-sm">
            <span className="material-symbols-outlined">grid_view</span> Dashboard
          </Link>
          <Link to="/admin-reports" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl font-bold text-sm">
            <span className="material-symbols-outlined">report</span> Moderation Queue
          </Link>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Incident Moderation</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Review user complaints, policy violations and fraud reports</p>
          </div>
          <div className="flex items-center gap-3 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-xl text-rose-600 font-bold text-sm">
            <span className="material-symbols-outlined text-xl">warning</span>
            3 Urgent Pending
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-200 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black text-slate-400 font-mono">{report.id}</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getStatusStyles(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-xs font-bold text-slate-400">• {report.date}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">"{report.reason}"</h3>
                  <p className="text-sm text-slate-500">
                    Filed by <span className="font-bold text-slate-700 dark:text-slate-300">{report.reporter}</span> against <span className="font-bold text-slate-700 dark:text-slate-300">{report.target}</span>
                  </p>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/10 transition-all flex items-center justify-center gap-2">
                    Review
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
