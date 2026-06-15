import React from 'react';
import { Link } from 'react-router-dom';

const payouts = [
  ['Deep Clean - Residence', 'May 10', 'Completed', '$120.00'],
  ['Electrical Safety Audit', 'May 09', 'Processing', '$85.00'],
  ['Furniture Assembly', 'May 08', 'Completed', '$210.00'],
  ['Plumbing Checkup', 'May 06', 'Completed', '$64.00'],
];

export default function ProviderEarnings() {
  return (
    <main className="bg-background min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed text-primary rounded-full text-sm font-bold mb-5">
              <span className="material-symbols-outlined text-lg">payments</span>
              Provider Portal
            </span>
            <h1 className="text-5xl font-black tracking-tight text-on-surface mb-3">Earnings</h1>
            <p className="text-on-surface-variant text-lg">Track payouts, completed services, fees, and monthly performance.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="px-5 py-3 bg-surface-container-low text-primary rounded-xl font-bold" to="/provider-panel">
              Dashboard
            </Link>
            <button className="px-5 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20">
              Download statement
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[
            ['Available balance', '$2,840.50', 'account_balance_wallet', 'bg-primary text-on-primary'],
            ['This month', '$4,920.00', 'trending_up', 'bg-surface-container-lowest text-on-surface'],
            ['Platform fees', '$318.40', 'receipt_long', 'bg-surface-container-lowest text-on-surface'],
            ['Avg. job value', '$96.25', 'bar_chart', 'bg-surface-container-lowest text-on-surface'],
          ].map(([label, value, icon, tone]) => (
            <div className={`${tone} rounded-2xl p-6 border border-outline-variant/10 shadow-sm`} key={label}>
              <span className="material-symbols-outlined mb-5">{icon}</span>
              <p className="text-sm font-bold opacity-70 mb-1">{label}</p>
              <p className="text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h2 className="text-xl font-extrabold">Recent payouts</h2>
              <button className="text-primary font-bold">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-xs uppercase tracking-widest text-on-surface-variant">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {payouts.map(([service, date, status, amount]) => (
                    <tr className="hover:bg-surface-container-low/60 transition-colors" key={`${service}-${date}`}>
                      <td className="px-6 py-5 font-bold">{service}</td>
                      <td className="px-6 py-5 text-on-surface-variant">{date}</td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-primary">{amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
            <h2 className="text-xl font-extrabold mb-5">Weekly trend</h2>
            <div className="h-64 flex items-end gap-2">
              {[42, 58, 35, 76, 62, 90, 68].map((height, index) => (
                <div className="flex-1 flex flex-col items-center gap-2" key={height}>
                  <div className="w-full bg-primary rounded-t-lg" style={{ height: `${height}%` }}></div>
                  <span className="text-xs font-bold text-on-surface-variant">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
