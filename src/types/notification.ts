export type NotificationCategory = 'appointment' | 'medicine' | 'report' | 'hospital';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  actionLabel?: string;
  actionUrl?: string;
  metadata?: {
    appointmentId?: string;
    doctorName?: string;
    appointmentDate?: string;
    medicineName?: string;
    medicineDose?: string;
    medicineTiming?: string;
    isTaken?: boolean;
    reportId?: string;
    reportType?: string;
    announcementType?: string;
  };
}

export interface NotificationPreferences {
  appointmentNotifications: boolean;
  medicineReminders: boolean;
  reportAlerts: boolean;
  hospitalAnnouncements: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}
