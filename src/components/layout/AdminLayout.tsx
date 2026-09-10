import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Calendar, 
  Pill, 
  FlaskConical, 
  Network, 
  Ambulance, 
  Megaphone, 
  BarChart3, 
  LogOut, 
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavItems = [
    { name: 'Dashboard', to: '/admin/dashboard', icon: BarChart3 },
    { name: 'Patient Management', to: '/admin/patients', icon: Users },
    { name: 'Doctor Management', to: '/admin/doctors', icon: UserCheck },
    { name: 'Appointments', to: '/admin/appointments', icon: Calendar },
    { name: 'Pharmacy Inventory', to: '/admin/pharmacy', icon: Pill },
    { name: 'Lab Test Operations', to: '/admin/labs', icon: FlaskConical },
    { name: 'Departments & Services', to: '/admin/departments', icon: Network },
    { name: 'Emergency & Ambulance', to: '/admin/emergency', icon: Ambulance },
    { name: 'Announcements', to: '/admin/notifications', icon: Megaphone },
    { name: 'Reports & Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight">CarePlus Hospital Admin</span>
                  <span className="bg-indigo-900/60 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-700/50">
                    AIIA Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Operational Command & Electronic Records</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link back to Patient View */}
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Switch to Patient View</span>
            </Link>

            {/* Admin User Info & Role Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <img
                src={admin?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'}
                alt={admin?.name || 'Admin'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white leading-tight">{admin?.name || 'Dr. Manoj Nessari'}</p>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{admin?.role || 'Super Admin'}</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors ml-1"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Admin Navigation Sidebar */}
        <aside
          className={`fixed top-14 bottom-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800/80 p-3 space-y-1 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static`}
        >
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Administrative Modules
          </div>

          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {adminNavItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-900 mt-4 px-3 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Restricted Staff Access</span>
            </div>
            <p className="text-[10px] text-slate-400">Activity logged for AIIA IT Audit compliance.</p>
          </div>
        </aside>

        {/* Admin Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
