import { PatientProfile } from '../types/patient';
import { AdminUser, AdminRole } from '../types/admin';
import { mockDefaultPatient } from '../mocks/patients';
import { mockAdminUsers } from '../mocks/adminStats';

export interface AuthSession {
  userType: 'patient' | 'admin' | null;
  patient: PatientProfile | null;
  admin: AdminUser | null;
  token: string | null;
}

const STORAGE_KEY = 'careplus_auth_session';

class AuthService {
  private getStoredSession(): AuthSession {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default logged in demo patient
    return {
      userType: 'patient',
      patient: mockDefaultPatient,
      admin: null,
      token: 'demo-jwt-token-patient',
    };
  }

  private setStoredSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  async getCurrentSession(): Promise<AuthSession> {
    await new Promise(r => setTimeout(r, 100));
    return this.getStoredSession();
  }

  async loginPatient(mobileOrEmail: string, _otpOrPass: string): Promise<PatientProfile> {
    await new Promise(r => setTimeout(r, 400));
    const session: AuthSession = {
      userType: 'patient',
      patient: { ...mockDefaultPatient, mobile: mobileOrEmail.includes('@') ? mockDefaultPatient.mobile : mobileOrEmail },
      admin: null,
      token: 'demo-jwt-token-patient',
    };
    this.setStoredSession(session);
    return session.patient!;
  }

  async loginAdmin(email: string, _password: string, role?: AdminRole): Promise<AdminUser> {
    await new Promise(r => setTimeout(r, 400));
    const matched = mockAdminUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) 
      || { ...mockAdminUsers[0], role: role || 'Hospital Admin' };

    const session: AuthSession = {
      userType: 'admin',
      patient: null,
      admin: matched,
      token: 'demo-jwt-token-admin',
    };
    this.setStoredSession(session);
    return matched;
  }

  async logout(): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const authService = new AuthService();
