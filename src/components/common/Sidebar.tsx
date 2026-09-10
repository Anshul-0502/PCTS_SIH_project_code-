import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  FileText, 
  Bell, 
  UserCircle, 
  Globe2, 
  HelpCircle, 
  Hospital, 
  ShieldCheck, 
  PhoneCall
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../../store/NotificationContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { unreadCount } = useNotifications();

  const navigationItems = [
    {
      name: t('nav.dashboard'),
      to: '/dashboard',
      icon: LayoutDashboard,
      highlight: false,
    },
    {
      name: t('nav.aiConsultation'),
      to: '/consultation',
      icon: Bot,
      highlight: true, // Core Experience
      badge: 'Core',
    },
    {
      name: t('nav.myReports'),
      to: '/reports',
      icon: FileText,
      highlight: false,
    },
    {
      name: t('nav.notifications'),
      to: '/notifications',
      icon: Bell,
      highlight: false,
      count: unreadCount,
    },
    {
      name: t('nav.hospitalServices'),
      to: '/hospital-services',
      icon: Hospital,
      highlight: false,
    },
    {
      name: t('nav.profileSettings'),
      to: '/profile',
      icon: UserCircle,
      highlight: false,
    },
    {
      name: t('nav.multiLanguage'),
      to: '/language',
      icon: Globe2,
      highlight: false,
    },
    {
      name: t('nav.helpSupport'),
      to: '/help',
      icon: HelpCircle,
      highlight: false,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:z-0`}
      >
        {/* Brand Header for Mobile Drawer */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-medical-600 flex items-center justify-center text-white font-black text-sm">
              CP
            </div>
            <div>
              <p className="font-extrabold text-slate-800 text-sm">CarePlus Health</p>
              <p className="text-[10px] text-slate-500">Ministry of Ayush</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              ✕
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Patient Portal
          </div>

          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-medical-600 to-medical-700 text-white shadow-md shadow-medical-600/25'
                        : 'bg-medical-50 text-medical-700 font-bold'
                      : item.highlight
                      ? 'text-medical-700 hover:bg-medical-50/80 bg-medical-50/40 border border-medical-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive
                            ? item.highlight
                              ? 'text-white'
                              : 'text-medical-600'
                            : item.highlight
                            ? 'text-medical-600'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive && item.highlight
                            ? 'bg-white/20 text-white'
                            : 'bg-medical-100 text-medical-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Emergency Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60">
          <div className="bg-white border border-red-200 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 24x7</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Immediate triage & ambulance service without consultation.
            </p>
            <NavLink
              to="/hospital-services?tab=ambulance"
              onClick={onClose}
              className="mt-2.5 w-full block text-center bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              Request Ambulance
            </NavLink>
          </div>

          <div className="mt-3 px-2 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>SIH PS-26047</span>
            </span>
            <span>AIIA / Ayush</span>
          </div>
        </div>
      </aside>
    </>
  );
};
