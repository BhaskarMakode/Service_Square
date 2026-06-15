import React from 'react';

export default function SupportTickets() {
  const history = [
    { id: '#TKT-9902', subject: 'Refund status for booking #B-10023', status: 'Resolved', lastUpdate: '2 days ago' },
    { id: '#TKT-9905', subject: 'Account billing clarification', status: 'Open', lastUpdate: '1 hour ago' }
  ];

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
          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-6">Open a new inquiry</h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Inquiry Topic</label>
                <select className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
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
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-slate-400"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>
              <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black shadow-lg hover:scale-[1.02] transition-all">
                Submit Ticket
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black mb-6">Active Tickets</h2>
            <div className="space-y-4">
              {history.map((ticket) => (
                <div key={ticket.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm group hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{ticket.id}</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      ticket.status === 'Open' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>{ticket.status}</span>
                  </div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 leading-snug">{ticket.subject}</p>
                  <span className="text-xs text-slate-400 font-medium">Updated {ticket.lastUpdate}</span>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="text-center p-10 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                  No history found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
