import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Pill, 
  FileText, 
  Megaphone, 
  CheckCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Settings2,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../store/NotificationContext';
import { NotificationCategory } from '../../types/notification';

export const NotificationCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    markMedicineTaken 
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<NotificationCategory | 'all' | 'unread'>('all');
  const [preferences, setPreferences] = useState({
    appointments: true,
    medicines: true,
    reports: true,
    hospital: true,
  });

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-emerald-600" />;
      case 'medicine':
        return <Pill className="w-5 h-5 text-amber-600" />;
      case 'report':
        return <FileText className="w-5 h-5 text-medical-600" />;
      case 'hospital':
        return <Megaphone className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getCategoryBg = (category: NotificationCategory) => {
    switch (category) {
      case 'appointment': return 'bg-emerald-50 border-emerald-200';
      case 'medicine': return 'bg-amber-50 border-amber-200';
      case 'report': return 'bg-medical-50 border-medical-200';
      case 'hospital': return 'bg-indigo-50 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
              Module 4 • Healthcare Alerts
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {t('notifications.title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('notifications.subtitle')}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-medical-700 bg-medical-50 hover:bg-medical-100 border border-medical-200 rounded-xl transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notifications.markAllRead')}</span>
          </button>
        )}
      </div>

      {/* Metrics Row (Matching images/27325c8d) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Total Alerts</span>
            <Bell className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{notifications.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in-app system</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Unread</span>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          </div>
          <p className="text-2xl font-black text-red-600">{unreadCount}</p>
          <span className="text-[11px] text-slate-400 font-medium">Require your review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Appointments</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {notifications.filter(n => n.category === 'appointment').length}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">Next: Today, 10:00 AM</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase">Reports Ready</span>
            <FileText className="w-4 h-4 text-medical-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {notifications.filter(n => n.category === 'report').length}
          </p>
          <span className="text-[11px] text-teal-600 font-medium">Physician summaries ready</span>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching images/27325c8d) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Notification Filter Tabs & Feed */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-1 shadow-2xs">
            {[
              { id: 'all', label: t('notifications.all') },
              { id: 'appointment', label: t('notifications.appointments') },
              { id: 'medicine', label: t('notifications.medicines') },
              { id: 'report', label: t('notifications.reports') },
              { id: 'hospital', label: t('notifications.hospital') },
              { id: 'unread', label: `${t('notifications.unread')} (${unreadCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-medical-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300" />
                <p>No notifications in this category</p>
              </div>
            ) : (
              filteredNotifications.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !item.isRead
                      ? 'bg-white border-medical-200 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    
                    {/* Category Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${getCategoryBg(item.category)}`}>
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {item.timestamp}
                          </span>
                          {!item.isRead && (
                            <span className="bg-medical-100 text-medical-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                              Unread
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>

                      {/* Action buttons based on notification type */}
                      <div className="pt-2 flex items-center gap-2 flex-wrap">
                        {item.category === 'medicine' && (
                          <>
                            <button
                              onClick={() => markMedicineTaken(item.id, true)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{t('notifications.markAsTaken')}</span>
                            </button>
                            <button
                              onClick={() => markAsRead(item.id)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                            >
                              {t('notifications.snooze')}
                            </button>
                          </>
                        )}

                        {item.category === 'appointment' && (
                          <a
                            href={item.actionUrl || '/hospital-services'}
                            className="px-3 py-1 bg-medical-600 hover:bg-medical-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                          >
                            <span>View Details</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {item.category === 'report' && (
                          <a
                            href="/reports"
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center gap-1 transition-colors"
                          >
                            <span>View Report</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {!item.isRead && item.category !== 'medicine' && (
                          <button
                            onClick={() => markAsRead(item.id)}
                            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Right Column: Notification Preferences (Matching images/27325c8d) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings2 className="w-4 h-4 text-medical-600" />
              <h3 className="font-bold text-slate-900 text-sm">Notification Preferences</h3>
            </div>

            <div className="space-y-4 text-xs">
              {[
                { key: 'appointments', label: 'Appointment Notifications', desc: 'Alerts about upcoming slots and doctor scheduling.' },
                { key: 'medicines', label: 'Medicine Reminders', desc: 'Timely reminders for your daily prescribed medications.' },
                { key: 'reports', label: 'Report Alerts', desc: 'Notifies when AI consultation summaries or lab tests are ready.' },
                { key: 'hospital', label: 'Hospital Announcements', desc: 'Updates on OPD timings, health camps, and notices.' },
              ].map(pref => (
                <div key={pref.key} className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{pref.label}</p>
                    <p className="text-[11px] text-slate-400">{pref.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                    <input
                      type="checkbox"
                      checked={(preferences as any)[pref.key]}
                      onChange={() => setPreferences({
                        ...preferences,
                        [pref.key]: !(preferences as any)[pref.key],
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-medical-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Rule Note */}
          <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-sky-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-950">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Reminder Protocol Safety</span>
            </div>
            <p className="text-[11px] text-sky-800 leading-relaxed">
              Medicine reminders are patient-managed scheduling aids only. The software does not independently prescribe, modify, or discontinue medications.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
