import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoicesApi } from '../services/serviceApi';
import { formatCurrency } from '../utils/currency';

const paymentLabel = (invoice) => {
  const method = invoice.paymentMethod || invoice.paymentId?.paymentMethod || invoice.paymentStatus;
  return method ? String(method).replaceAll('_', ' ') : 'Payment recorded';
};

export default function InvoiceViewer() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await invoicesApi.history({ limit: 50 });
        setInvoices(res.data.data.invoices || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load invoices');
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600 text-3xl">receipt_long</span>
              Invoices & Receipts
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Detailed transaction and billing history</p>
          </div>
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 transition-colors text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Dashboard
          </Link>
        </header>

        {error && <div className="mb-6 p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-100 font-semibold">{error}</div>}

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 mb-3 block">receipt_long</span>
              <p className="text-slate-500 font-bold">No invoices generated yet.</p>
              <p className="text-slate-400 text-sm mt-1">Invoices are generated after completed bookings.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Invoice Number</th>
                    <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Date / Service</th>
                    <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Customer Address</th>
                    <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Payment</th>
                    <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">Total</th>
                    <th className="p-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {invoices.map((invoice) => {
                    const booking = invoice.bookingId || {};
                    const snapshot = invoice.bookingSnapshot || {};
                    const service = snapshot.serviceType || booking.serviceType || 'Service booking';
                    const generatedAt = invoice.generatedAt || invoice.createdAt;
                    const address = snapshot.address || booking.address || 'Address unavailable';
                    return (
                      <tr key={invoice._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/80 transition-colors">
                        <td className="p-5">
                          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">{invoice.invoiceNumber}</span>
                        </td>
                        <td className="p-5">
                          <p className="text-slate-900 dark:text-white font-bold text-base capitalize">{service}</p>
                          <span className="text-xs text-slate-400 font-medium">{generatedAt ? new Date(generatedAt).toLocaleString('en-IN') : 'Date unavailable'}</span>
                        </td>
                        <td className="p-5 max-w-xs">
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{address}</p>
                          <p className="text-xs text-slate-400 mt-1">{invoice.customerSnapshot?.name || invoice.customerId?.name || 'Customer'}</p>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium capitalize">
                            <span className="material-symbols-outlined text-slate-400 text-lg">payments</span>
                            {paymentLabel(invoice)}
                          </div>
                          <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-black capitalize ${
                            invoice.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {invoice.paymentStatus}
                          </span>
                        </td>
                        <td className="p-5 font-black text-slate-900 dark:text-white text-lg">
                          {formatCurrency(invoice.total || 0)}
                        </td>
                         <td className="p-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <Link to={`/bookings/${typeof booking === 'object' ? booking._id : booking}`} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 inline-flex items-center justify-center hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all" title="View Booking">
                               <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                             </Link>
                             <button
                               onClick={() => {
                                 const content = `Invoice: ${invoice.invoiceNumber}\nDate: ${new Date(invoice.generatedAt || invoice.createdAt).toLocaleString('en-IN')}\nService: ${service}\nTotal: ₹${invoice.total || 0}\nStatus: ${invoice.paymentStatus}`;
                                 const blob = new Blob([content], { type: 'text/plain' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `${invoice.invoiceNumber || 'invoice'}.txt`;
                                 a.click();
                                 URL.revokeObjectURL(url);
                               }}
                               className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 inline-flex items-center justify-center hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 transition-all"
                               title="Download Invoice"
                             >
                               <span className="material-symbols-outlined text-[18px]">download</span>
                             </button>
                           </div>
                         </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
