import { AdminUser, OperationalMetrics, MonthlyAppointmentStat, DepartmentUtilizationStat, AuditLogEntry } from '../types/admin';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'adm-001',
    name: 'Dr. Manoj Nessari',
    email: 'admin.director@aiia.gov.in',
    role: 'Super Admin',
    department: 'Hospital Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    lastLogin: 'Today, 08:30 AM',
  },
  {
    id: 'adm-002',
    name: 'Kavita Sundaram',
    email: 'appointments@aiia.gov.in',
    role: 'Appointment Staff',
    department: 'Central Registration & OPD Desk',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    lastLogin: 'Today, 09:00 AM',
  },
  {
    id: 'adm-003',
    name: 'Rameshwar Dayal',
    email: 'pharmacy@aiia.gov.in',
    role: 'Pharmacy Staff',
    department: 'Hospital Central Pharmacy',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    lastLogin: 'Today, 07:45 AM',
  },
  {
    id: 'adm-004',
    name: 'Dr. Shalini Gupta',
    email: 'pathology@aiia.gov.in',
    role: 'Lab Staff',
    department: 'Diagnostic Pathology',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    lastLogin: 'Yesterday, 05:15 PM',
  },
  {
    id: 'adm-005',
    name: 'Inspector Vijay Chauhan',
    email: 'emergency@aiia.gov.in',
    role: 'Emergency Staff',
    department: 'Emergency & Ambulance Command',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    lastLogin: 'Active Now',
  },
];

export const mockOperationalMetrics: OperationalMetrics = {
  totalRegisteredPatients: 1248,
  totalActiveDoctors: 36,
  totalAppointments: 842,
  todayAppointments: 128,
  totalAIConsultations: 964,
  totalReportsGenerated: 940,
  pendingLabBookings: 52,
  pharmacyLowStockAlerts: 4,
  activeAmbulanceRequests: 2,
  systemHealthPercent: 99.8,
};

export const mockMonthlyAppointments: MonthlyAppointmentStat[] = [
  { month: 'Jan', appointments: 520, consultations: 610 },
  { month: 'Feb', appointments: 680, consultations: 740 },
  { month: 'Mar', appointments: 810, consultations: 890 },
  { month: 'Apr', appointments: 750, consultations: 820 },
  { month: 'May', appointments: 890, consultations: 950 },
  { month: 'Jun', appointments: 980, consultations: 1040 },
];

export const mockDepartmentStats: DepartmentUtilizationStat[] = [
  { department: 'Kayachikitsa', patients: 380, capacityPercent: 88 },
  { department: 'Panchakarma', patients: 290, capacityPercent: 94 },
  { department: 'Shalya Tantra', patients: 180, capacityPercent: 72 },
  { department: 'Swasthavritta', patients: 150, capacityPercent: 65 },
  { department: 'Emergency Wing', patients: 248, capacityPercent: 82 },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-101',
    timestamp: '10 minutes ago',
    userName: 'Kavita Sundaram',
    userRole: 'Appointment Staff',
    action: 'Confirmed Appointment',
    module: 'Appointment Management',
    details: 'Approved APT-2025-0421 for patient Ravi Kumar with Dr. Ayesha Rahman.',
    status: 'Success',
  },
  {
    id: 'log-102',
    timestamp: '25 minutes ago',
    userName: 'Inspector Vijay Chauhan',
    userRole: 'Emergency Staff',
    action: 'Dispatched Ambulance',
    module: 'Emergency Management',
    details: 'Dispatched unit DL 1T 4492 to Sector 12 Dwarka.',
    status: 'Success',
  },
  {
    id: 'log-103',
    timestamp: '1 hour ago',
    userName: 'Dr. Shalini Gupta',
    userRole: 'Lab Staff',
    action: 'Uploaded Lab Report',
    module: 'Lab Management',
    details: 'Published CBC panel findings for patient Ravi Kumar (LBO-2025-081).',
    status: 'Success',
  },
  {
    id: 'log-104',
    timestamp: '2 hours ago',
    userName: 'Rameshwar Dayal',
    userRole: 'Pharmacy Staff',
    action: 'Updated Inventory Stock',
    module: 'Pharmacy Management',
    details: 'Restocked 150 units of Giloy Ghanvati 500mg.',
    status: 'Success',
  },
  {
    id: 'log-105',
    timestamp: '3 hours ago',
    userName: 'Dr. Manoj Nessari',
    userRole: 'Super Admin',
    action: 'Broadcasted Notification',
    module: 'Announcements',
    details: 'Sent hospital-wide OPD timing update notification to 1,248 patients.',
    status: 'Success',
  },
];
