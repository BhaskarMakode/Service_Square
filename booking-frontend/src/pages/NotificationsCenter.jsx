import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

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
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-500 py-10 text-center">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No notifications found.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div 
                key={n._id} 
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`group relative rounded-3xl p-5 border transition-all flex gap-4 items-start ${!n.isRead ? 'cursor-pointer' : ''} bg-white dark:bg-slate-800 ${
                  !n.isRead ? 'border-indigo-200 ring-1 ring-indigo-100 dark:ring-indigo-900/20' : 'border-slate-200/60 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                
                {!n.isRead && (
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 border-2 border-white dark:border-slate-900"></div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getIconColor(n.type)}`}>
                  <span className="material-symbols-outlined text-2xl">{getIcon(n.type)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={`text-base font-bold truncate ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {n.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap mt-1">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
