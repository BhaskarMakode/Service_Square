import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';

const STATUS_COLORS = {
  open:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  in_progress: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  resolved:    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  closed:      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
};

const PRIORITY_COLORS = {
  low:    'bg-slate-100 text-slate-600',
  medium: 'bg-blue-100 text-blue-700',
  high:   'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function AdminSupport() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchTickets();
  }, [user, navigate, statusFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { limit: 100 };
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/support/all', { params });
      if (res.data.success) {
        setTickets(res.data.data.tickets || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await apiClient.put(`/support/${id}`, { status: newStatus });
      if (res.data.success) {
        setTickets(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket?._id === id) {
          setSelectedTicket(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update ticket status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = tickets.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (t.subject || '').toLowerCase().includes(q) ||
      (t.issue || '').toLowerCase().includes(q) ||
      (t.userId?.name || '').toLowerCase().includes(q) ||
      (t.userId?.email || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex font-body antialiased">
      <AdminSidebar active="/admin-support" />

      <main className="ml-64 flex-1 p-8 min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">Support Tickets</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all customer and provider support requests.</p>
          </div>
          <button onClick={fetchTickets} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
            <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
          </button>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search by subject, user name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl gap-1">
            {['', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  statusFilter === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s || 'All'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-medium flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>{error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Ticket List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className="font-black">{filtered.length} Ticket{filtered.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-[calc(100vh-280px)] overflow-y-auto">
              {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse font-bold">Loading tickets...</div>
              ) : filtered.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">inbox</span>
                  <p className="text-slate-500 font-medium">No tickets found.</p>
                </div>
              ) : filtered.map(ticket => (
                <button
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selectedTicket?._id === ticket._id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-sm truncate flex-1">{ticket.subject}</span>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}>
                      {ticket.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{ticket.issue}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {ticket.userId?.name || 'Unknown User'}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold capitalize ${PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.medium}`}>
                      {ticket.priority}
                    </span>
                    <span className="ml-auto">{new Date(ticket.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Detail Panel */}
          {selectedTicket ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 h-fit sticky top-8 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket #{selectedTicket._id.slice(-6).toUpperCase()}</span>
                  <h3 className="font-black text-lg mt-1 leading-snug">{selectedTicket.subject}</h3>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-slate-400">close</span>
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-5">
                <img
                  src={selectedTicket.userId?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedTicket.userId?.name || 'U')}&background=4F46E5&color=fff`}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="User"
                />
                <div>
                  <p className="font-bold">{selectedTicket.userId?.name || 'Unknown User'}</p>
                  <p className="text-xs text-slate-500">{selectedTicket.userId?.email || selectedTicket.userId?.phone || 'No contact'}</p>
                  <p className="text-xs text-slate-400 capitalize">{selectedTicket.userId?.role || 'user'}</p>
                </div>
              </div>

              {/* Issue */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Description</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl">
                  {selectedTicket.issue || 'No description provided.'}
                </p>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Priority</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${PRIORITY_COLORS[selectedTicket.priority] || PRIORITY_COLORS.medium}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Created</p>
                  <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                    <button
                      key={s}
                      disabled={updatingId === selectedTicket._id || selectedTicket.status === s}
                      onClick={() => updateTicketStatus(selectedTicket._id, s)}
                      className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all disabled:opacity-50 active:scale-95 ${
                        selectedTicket.status === s
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}
                    >
                      {updatingId === selectedTicket._id ? '...' : s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center h-64">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">support_agent</span>
              <p className="text-slate-500 font-medium">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
