import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { EmergencyBanner } from '../common/EmergencyBanner';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { LayoutDashboard, Bot, FileText, Hospital, UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PatientLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 24x7 Emergency Ribbon */}
      <EmergencyBanner />

      {/* Main Header / Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

      {/* Main Body with Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop & Drawer Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Page Content Viewport */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      {/* Clinical Safety & Transparency Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 text-slate-500 text-xs text-center hidden md:block">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-semibold text-slate-700">
            {t('safety.disclaimer')}
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-[11px] pt-1">
            <span>Ministry of Ayush, Govt. of India</span>
            <span>•</span>
            <span>All India Institute of Ayurveda (AIIA)</span>
            <span>•</span>
            <span>Smart India Hackathon ID: 26047</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-medical-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/consultation"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
              isActive ? 'text-medical-600' : 'text-medical-700'
            }`
          }
        >
          <div className="w-9 h-9 -mt-4 rounded-full bg-medical-600 text-white flex items-center justify-center shadow-md shadow-medical-600/30">
            <Bot className="w-5 h-5" />
          </div>
          <span>AI Assist</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-medical-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/hospital-services"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-medical-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Hospital className="w-5 h-5" />
          <span>Services</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-medical-600' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <UserCircle className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
