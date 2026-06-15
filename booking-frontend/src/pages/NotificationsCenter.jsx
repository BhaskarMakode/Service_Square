import React from 'react';

export default function NotificationsCenter() {
  const notifications = [
    { id: 1, title: 'Booking Confirmed!', body: 'Your cleaner will arrive by 10:00 AM tomorrow.', time: '5 mins ago', unread: true, type: 'success' },
    { id: 2, title: 'Payment Received', body: 'Transaction for #INV-2026-0042 was successful.', time: '2 hours ago', unread: false, type: 'payment' },
    { id: 3, title: 'Provider En Route', body: 'Rajesh is 1.2 km away from your location.', time: '1 day ago', unread: false, type: 'alert' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'success': return 'check_circle';
      case 'payment': return 'payments';
      case 'alert': return 'notifications_active';
      default: return 'info';
    }
  };

  const getIconColor = (type) => {
    switch(type) {
      case 'success': return 'bg-emerald-100 text-emerald-600';
      case 'payment': return 'bg-indigo-100 text-indigo-600';
      case 'alert': return 'bg-amber-100 text-amber-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Activity Feed</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time updates on your bookings and profile.</p>
          </div>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Mark all as read</button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className={`group relative rounded-3xl p-5 border transition-all flex gap-4 items-start cursor-pointer bg-white dark:bg-slate-800 ${
              n.unread ? 'border-indigo-200 ring-1 ring-indigo-100 dark:ring-indigo-900/20' : 'border-slate-200/60 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}>
              
              {n.unread && (
                <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 border-2 border-white dark:border-slate-900"></div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconColor(n.type)}`}>
                <span className="material-symbols-outlined text-2xl">{getIcon(n.type)}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-base font-bold truncate ${n.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {n.title}
                  </h3>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap mt-1">{n.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 leading-relaxed">
                  {n.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-black rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            Load Older Notifications
          </button>
        </div>
      </div>
    </div>
  );
}
