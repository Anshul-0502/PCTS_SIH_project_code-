import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Lock, Mail, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { AdminRole } from '../../types/admin';

export const AdminLoginPage: React.FC = () => {
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin.director@aiia.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<AdminRole>('Super Admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAsAdmin(email, role);
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleQuickLogin = async (selectedRole: AdminRole, selectedEmail: string) => {
    setLoading(true);
    await loginAsAdmin(selectedEmail, selectedRole);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>
        <span className="text-xs text-indigo-400 font-bold">AIIA Official Administration</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Hospital Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Module 9: Hospital Operations & Electronic Record Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Staff Official Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Security Password / Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-10 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Designated Administrative Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as AdminRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Super Admin">Super Admin (All Modules)</option>
                <option value="Hospital Admin">Hospital Admin</option>
                <option value="Appointment Staff">Appointment Staff</option>
                <option value="Pharmacy Staff">Pharmacy Staff</option>
                <option value="Lab Staff">Lab Staff</option>
                <option value="Emergency Staff">Emergency Staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-colors mt-2"
              id="admin-login-submit-button"
            >
              {loading ? 'Authenticating...' : 'Sign In as Staff'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switchers for SIH Review */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Role Test Logins
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('Super Admin', 'admin.director@aiia.gov.in')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-left text-slate-300 border border-slate-700 font-semibold"
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('Appointment Staff', 'appointments@aiia.gov.in')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-left text-slate-300 border border-slate-700 font-semibold"
              >
                📅 Appointment Desk
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('Pharmacy Staff', 'pharmacy@aiia.gov.in')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-left text-slate-300 border border-slate-700 font-semibold"
              >
                💊 Pharmacy Staff
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('Emergency Staff', 'emergency@aiia.gov.in')}
                className="p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg text-left text-slate-300 border border-slate-700 font-semibold"
              >
                🚑 Emergency Unit
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-500">
            Authorized Personnel Only • Audit Logged • Ministry of Ayush
          </div>

        </div>
      </div>
    </div>
  );
};
