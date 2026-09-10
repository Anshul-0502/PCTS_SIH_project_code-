import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PatientLayout } from '../components/layout/PatientLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { PatientLoginPage } from '../pages/auth/PatientLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';

// Patient Portal Modules
import { PatientDashboardPage } from '../pages/dashboard/PatientDashboardPage';
import { PatientRegistrationPage } from '../modules/registration/PatientRegistrationPage'; // Module 1: Patient Registration
import { AIConsultationPage } from '../modules/consultation/AIConsultationPage'; // Module 2: AI Consultation
import { ReportHistoryPage } from '../modules/reports/ReportHistoryPage'; // Module 3: My Report History
import { NotificationCenterPage } from '../modules/notifications/NotificationCenterPage'; // Module 4: Notification Center
import { ProfileSettingsPage } from '../modules/profile/ProfileSettingsPage'; // Module 5: My Profile & Settings
import { LanguageSettingsPage } from '../modules/language/LanguageSettingsPage'; // Module 6: Multi-Language Support
import { HelpSupportPage } from '../modules/support/HelpSupportPage'; // Module 7: Help & Support
import { HospitalServicesPage } from '../modules/hospital/HospitalServicesPage'; // Module 8: Hospital Services

// Hospital Admin Portal (Module 9)
import { AdminPortalPage } from '../modules/admin/AdminPortalPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PatientLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Patient Portal (Modules 1 - 8) with PatientLayout */}
      <Route element={<PatientLayout />}>
        <Route path="/dashboard" element={<PatientDashboardPage />} />
        <Route path="/register" element={<PatientRegistrationPage />} />
        <Route path="/consultation" element={<AIConsultationPage />} />
        <Route path="/reports" element={<ReportHistoryPage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/language" element={<LanguageSettingsPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/hospital-services" element={<HospitalServicesPage />} />
      </Route>

      {/* Hospital Admin Portal (Module 9) with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminPortalPage />} />
        <Route path="patients" element={<AdminPortalPage />} />
        <Route path="doctors" element={<AdminPortalPage />} />
        <Route path="appointments" element={<AdminPortalPage />} />
        <Route path="pharmacy" element={<AdminPortalPage />} />
        <Route path="labs" element={<AdminPortalPage />} />
        <Route path="departments" element={<AdminPortalPage />} />
        <Route path="emergency" element={<AdminPortalPage />} />
        <Route path="notifications" element={<AdminPortalPage />} />
        <Route path="analytics" element={<AdminPortalPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
