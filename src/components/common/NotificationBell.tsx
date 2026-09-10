import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../store/NotificationContext';
import { useTranslation } from 'react-i18next';

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 4);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-medical-600 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-medical-500"
        title="Notifications"
        id="notification-bell-button"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800 text-sm">{t('notifications.title')}</h4>
              {unreadCount > 0 && (
                <span className="bg-medical-100 text-medical-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} {t('notifications.unread')}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-medical-600 hover:text-medical-700 font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t('notifications.markAllRead')}</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No notifications right now
              </div>
            ) : (
              recentNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                    !n.isRead ? 'bg-medical-50/40 hover:bg-medical-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        !n.isRead ? 'bg-medical-500 ring-4 ring-medical-100' : 'bg-transparent'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5" />
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/70 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center justify-center gap-1 py-1"
            >
              <span>View All Notifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
