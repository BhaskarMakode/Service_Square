import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function AdminReports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchReports();
  }, [user, navigate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/report/all');
      if (res.data.success) {
        setReports(res.data.data.reports || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id) => {
    const action = window.prompt("Enter admin action (e.g., warn_user, ban_user, none):", "warn_user");
    if (action === null) return;
    const note = window.prompt("Enter action note:");
    if (note === null) return;

    try {
      setLoading(true);
      const res = await apiClient.put(`/report/${id}/action`, {
        status: "resolved",
        adminAction: action,
        actionNote: note
      });
      if (res.data.success) {
        fetchReports();
      }
    } catch (err) {
      alert(err.message || 'Failed to moderate report');
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'reviewed': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50';
    }
  };

  const urgentCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900 font-body">
      <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200/60 dark:border-slate-700/50 flex flex-col sticky top-0 h-screen">
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
            {urgentCount} Urgent Pending
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined">error</span>
                {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="p-10 text-center text-slate-500 font-bold animate-pulse">Loading Reports...</div>
            ) : reports.length === 0 ? (
              <div className="p-10 text-center text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">No reports found.</div>
            ) : (
              reports.map((report) => (
                <div key={report._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-indigo-200 transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-black text-slate-400 font-mono">#{report._id.substring(0, 8).toUpperCase()}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border uppercase ${getStatusStyles(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs font-bold text-slate-400">• {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mb-1 capitalize">"{report.reason}"</h3>
                    <p className="text-sm text-slate-500 mb-2">{report.description}</p>
                    <p className="text-sm text-slate-500">
                      Filed by <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{report.reportedBy?.name || 'Unknown'}</span> against <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{report.targetUser?.name || 'Unknown'}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => handleReview(report._id)} className="flex-1 md:flex-none px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/10 transition-all flex items-center justify-center gap-2">
                      Review
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-all">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
