import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export default function SupportTickets() {
  const [history, setHistory] = useState([]);
  const [subject, setSubject] = useState('Billing & Payment Issue');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/support/my-tickets');
      if (response.data.success) {
        setHistory(response.data.data.tickets || []);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please enter a description.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      const res = await apiClient.post('/support/create-ticket', { subject, issue: description, priority: 'medium' });
      if (res.data.success) {
        setDescription('');
        fetchTickets(); // Refresh list
        setMessage('Ticket submitted successfully.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white mb-12 relative overflow-hidden shadow-xl shadow-indigo-500/20">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black mb-4">Need assistance? We're here.</h1>
            <p className="text-indigo-100 font-medium max-w-md leading-relaxed">
              Our success champions will respond back to your ticket inquiry, typically within 1 business hour.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(error || message) && <div className={`lg:col-span-3 p-4 rounded-xl ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>{error || message}</div>}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-6">Open a new inquiry</h2>
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Inquiry Topic</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option>Billing & Payment Issue</option>
                  <option>Service Dispute</option>
                  <option>Technical Bug Report</option>
                  <option>Other Inquiries</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Tell us more</label>
                <textarea 
                  rows="5" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-slate-400"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-black mb-6">Active Tickets</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center p-4 text-slate-400 animate-pulse">Loading tickets...</div>
              ) : history.length === 0 ? (
                <div className="text-center p-10 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 text-sm font-medium">
                  No history found.
                </div>
              ) : (
                history.map((ticket) => (
                  <div key={ticket._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm group hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{ticket._id.slice(-6).toUpperCase()}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        ticket.status === 'open' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>{ticket.status}</span>
                    </div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 leading-snug">{ticket.subject}</p>
                    <span className="text-xs text-slate-400 font-medium">Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
