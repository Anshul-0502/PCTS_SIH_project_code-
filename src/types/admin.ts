export type AdminRole = 
  | 'Super Admin' 
  | 'Hospital Admin' 
  | 'Appointment Staff' 
  | 'Pharmacy Staff' 
  | 'Lab Staff' 
  | 'Emergency Staff'
  | 'View-Only Staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department?: string;
  avatarUrl?: string;
  lastLogin: string;
}

export interface OperationalMetrics {
  totalRegisteredPatients: number;
  totalActiveDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  totalAIConsultations: number;
  totalReportsGenerated: number;
  pendingLabBookings: number;
  pharmacyLowStockAlerts: number;
  activeAmbulanceRequests: number;
  systemHealthPercent: number;
}

export interface MonthlyAppointmentStat {
  month: string;
  appointments: number;
  consultations: number;
}

export interface DepartmentUtilizationStat {
  department: string;
  patients: number;
  capacityPercent: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  userRole: AdminRole;
  action: string;
  module: string;
  details: string;
  status: 'Success' | 'Warning' | 'Error';
}
