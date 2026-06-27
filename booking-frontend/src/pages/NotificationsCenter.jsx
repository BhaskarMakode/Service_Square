import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';

const TYPE_CONFIGS = {
  success:  { icon: 'check_circle',          color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  payment:  { icon: 'payments',              color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  alert:    { icon: 'notifications_active',  color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  booking:  { icon: 'event_available',       color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' },
  info:     { icon: 'info',                  color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
  review:   { icon: 'star',                  color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400' },
  support:  { icon: 'support_agent',         color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
};

function getConfig(type) {
  return TYPE_CONFIGS[type] || TYPE_CONFIGS.info;
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const response = await apiClient.get('/notifications', { params: { limit: 100 } });
      if (response.data.success) {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (!unread.length) return;
    try {
      setMarkingAll(true);
      await Promise.all(unread.map(n => apiClient.put(`/notifications/${n._id}/read`)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-black rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Real-time updates on your bookings and activity.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              disabled={markingAll}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 hover:border-indigo-300 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              {markingAll ? 'Marking...' : 'Mark all read'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 animate-pulse flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-600 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-rose-300 mb-4 block">error</span>
            <p className="text-rose-500 font-bold mb-4">{error}</p>
            <button onClick={fetchNotifications} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">notifications_off</span>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">All caught up!</h3>
            <p className="text-slate-500 dark:text-slate-400">No notifications yet. You'll see booking updates, payment confirmations, and more here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => {
              const cfg = getConfig(n.type);
              return (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`group relative rounded-3xl p-5 border transition-all flex gap-4 items-start ${
                    !n.isRead ? 'cursor-pointer' : ''
                  } bg-white dark:bg-slate-800 ${
                    !n.isRead
                      ? 'border-indigo-200 dark:border-indigo-800 ring-1 ring-indigo-100 dark:ring-indigo-900/30 shadow-sm'
                      : 'border-slate-200/60 dark:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/80'
                  }`}
                >
                  {/* Unread dot */}
                  {!n.isRead && (
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/30 border-2 border-white dark:border-slate-900" />
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cfg.color}`}>
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className={`text-sm font-bold leading-snug ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-slate-400">{formatTime(n.createdAt)}</span>
                        <button
                          onClick={(e) => deleteNotification(n._id, e)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 transition-all"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    {!n.isRead && (
                      <span className="inline-block mt-2 text-xs font-bold text-indigo-500 dark:text-indigo-400">
                        Tap to mark as read
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
