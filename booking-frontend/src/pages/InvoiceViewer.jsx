import React from 'react';

export default function InvoiceViewer() {
  const invoices = [
    { id: 'INV-2026-0042', date: 'May 10, 2026', service: 'Deep Kitchen Cleaning', amount: '$89.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-0039', date: 'Apr 28, 2026', service: 'AC Repair & Service', amount: '$120.50', status: 'Paid', method: 'UPI Transfer' },
    { id: 'INV-2026-0035', date: 'Apr 15, 2026', service: 'Plumbing Checkup', amount: '$45.00', status: 'Refunded', method: 'Wallet' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600 text-3xl">receipt_long</span>
              Invoices & Receipts
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Detailed transaction and billing history</p>
          </div>
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-colors text-sm">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export FY26 History
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Invoice Number</th>
                  <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Date / Service</th>
                  <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Payment Method</th>
                  <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Total</th>
                  <th className="p-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-colors">
                    <td className="p-5">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">{inv.id}</span>
                    </td>
                    <td className="p-5">
                      <p className="text-slate-900 dark:text-white font-bold text-base">{inv.service}</p>
                      <span className="text-xs text-slate-400 font-medium">{inv.date}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
                        <span className="material-symbols-outlined text-slate-400 text-lg">credit_card</span>
                        {inv.method}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${
                        inv.status === 'Paid' 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-5 font-black text-slate-900 dark:text-white text-lg">
                      {inv.amount}
                    </td>
                    <td className="p-5 text-right">
                      <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all">
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
