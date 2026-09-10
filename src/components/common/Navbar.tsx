import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Search, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  ShieldAlert, 
  ChevronDown,
  Building2
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NotificationBell } from './NotificationBell';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { patient, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hospital-services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand & Toggle */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-slate-600 hover:text-medical-600 hover:bg-slate-100 transition-colors md:hidden focus:ring-2 focus:ring-medical-500"
                aria-label="Toggle Sidebar"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-medical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">CarePlus</span>
                  <span className="text-[10px] bg-medical-50 text-medical-700 font-bold px-1.5 py-0.5 rounded border border-medical-200">
                    AIIA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none">
                  {t('common.appSubtitle')}
                </p>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search doctors, symptoms, medicines, lab tests..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-medical-500 focus:border-medical-500 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Right: Actions (Language, Notification, Admin Switch, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notification Bell */}
            <NotificationBell />

            {/* Switch to Admin Portal shortcut */}
            <Link
              to="/admin/dashboard"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
              title="Hospital Administration Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Admin Portal</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-medical-500"
                id="patient-profile-dropdown-button"
              >
                <img
                  src={patient?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={patient?.fullName || 'Patient'}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {patient?.fullName || 'Ravi Kumar'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    ID: {patient?.id || 'PAT-2025-0892'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{patient?.fullName || 'Ravi Kumar'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{patient?.email || 'ravi.kumar@example.com'}</p>
                    <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Patient
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-medical-600 transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.profileSettings')}</span>
                    </Link>
                    <Link
                      to="/language"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-medical-600 transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.multiLanguage')}</span>
                    </Link>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 transition-colors font-semibold lg:hidden"
                    >
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Open Admin Portal</span>
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={async () => {
                        setProfileOpen(false);
                        await logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      <span>{t('common.logout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
