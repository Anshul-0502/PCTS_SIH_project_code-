import React, { createContext, useContext, useState, useEffect } from 'react';
import { PatientProfile } from '../types/patient';
import { AdminUser, AdminRole } from '../types/admin';
import { authService, AuthSession } from '../services/auth.service';

interface AuthContextType {
  userType: 'patient' | 'admin' | null;
  patient: PatientProfile | null;
  admin: AdminUser | null;
  loading: boolean;
  loginAsPatient: (identifier: string) => Promise<void>;
  loginAsAdmin: (email: string, role?: AdminRole) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentPatient: (updated: PatientProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession>({
    userType: 'patient',
    patient: null,
    admin: null,
    token: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentSession().then(s => {
      setSession(s);
      setLoading(false);
    });
  }, []);

  const loginAsPatient = async (identifier: string) => {
    const patient = await authService.loginPatient(identifier, 'mock-otp');
    setSession({
      userType: 'patient',
      patient,
      admin: null,
      token: 'patient-token',
    });
  };

  const loginAsAdmin = async (email: string, role?: AdminRole) => {
    const admin = await authService.loginAdmin(email, 'admin-pass', role);
    setSession({
      userType: 'admin',
      patient: null,
      admin,
      token: 'admin-token',
    });
  };

  const logout = async () => {
    await authService.logout();
    setSession({
      userType: null,
      patient: null,
      admin: null,
      token: null,
    });
  };

  const updateCurrentPatient = (updated: PatientProfile) => {
    setSession(prev => ({
      ...prev,
      patient: updated,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        userType: session.userType,
        patient: session.patient,
        admin: session.admin,
        loading,
        loginAsPatient,
        loginAsAdmin,
        logout,
        updateCurrentPatient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
