import { useState } from 'react';
import Layout from '../components/Layout';
import Topbar from '../components/Topbar';
import Badge, { getStatusBadge } from '../components/Badge';
import { mockNotifications } from '../data/mockData';
import type { Notification } from '../types';
import { useLang } from '../context/LanguageContext';

export default function NotificationsPage() {
  const { t } = useLang();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => filter === 'all' || !n.read);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const getNotifIcon = (type: Notification['type']) => {
    const icons: Record<string, string> = {
      appointment: 'calendar_today',
      payment: 'payments',
      inventory: 'inventory_2',
      message: 'mail',
      system: 'settings',
    };
    return icons[type] ?? 'notifications';
  };

  const getNotifColor = (type: Notification['type'], priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400';
    const typeColors: Record<string, string> = {
      appointment: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      payment: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      inventory: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      message: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      system: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    };
    return typeColors[type] ?? 'bg-slate-100 text-slate-600';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Layout>
      <Topbar title="Notifications" />

      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
        {/* Header controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-2 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              {t.notifications.markAllRead}
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-5xl text-slate-300">notifications_none</span>
              <p className="text-slate-500">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
            </div>
          ) : filtered.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-primary/5 dark:bg-primary/10 border-primary/20'
              }`}
              onClick={() => markRead(notif.id)}
            >
              {/* Icon */}
              <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotifColor(notif.type, notif.priority)}`}>
                <span className="material-symbols-outlined text-[20px]">{getNotifIcon(notif.type)}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{notif.time}</span>
                  <Badge variant={getStatusBadge(notif.priority)}>{notif.priority} priority</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">{t.notifications.settingsTitle}</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: t.notifications.apptReminders, desc: t.notifications.apptRemindersDesc, enabled: true },
              { label: t.notifications.lowStockAlerts, desc: t.notifications.lowStockDesc, enabled: true },
              { label: t.notifications.paymentReminders, desc: t.notifications.paymentRemindersDesc, enabled: false },
              { label: t.notifications.systemUpdates, desc: t.notifications.systemUpdatesDesc, enabled: true },
            ].map((setting) => (
              <div key={setting.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{setting.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{setting.desc}</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${setting.enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
