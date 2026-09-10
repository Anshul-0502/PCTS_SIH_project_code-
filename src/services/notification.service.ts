import { AppNotification, NotificationCategory, NotificationPreferences } from '../types/notification';
import { mockNotificationsList, mockDefaultNotificationPreferences } from '../mocks/notifications';

class NotificationService {
  private notifications: AppNotification[] = [...mockNotificationsList];
  private preferences: NotificationPreferences = { ...mockDefaultNotificationPreferences };

  async getNotifications(category?: NotificationCategory | 'all', unreadOnly?: boolean): Promise<AppNotification[]> {
    await new Promise(r => setTimeout(r, 200));
    let list = [...this.notifications];

    if (category && category !== 'all') {
      list = list.filter(n => n.category === category);
    }

    if (unreadOnly) {
      list = list.filter(n => !n.isRead);
    }

    return list;
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter(n => !n.isRead).length;
  }

  async markAsRead(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 100));
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  }

  async markAllAsRead(): Promise<void> {
    await new Promise(r => setTimeout(r, 150));
    this.notifications.forEach(n => (n.isRead = true));
  }

  async markMedicineTaken(id: string, isTaken: boolean): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    const notif = this.notifications.find(n => n.id === id);
    if (notif && notif.metadata) {
      notif.metadata.isTaken = isTaken;
      notif.isRead = true;
    }
  }

  async addNotification(data: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
      ...data,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  async getPreferences(): Promise<NotificationPreferences> {
    await new Promise(r => setTimeout(r, 100));
    return { ...this.preferences };
  }

  async updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    await new Promise(r => setTimeout(r, 200));
    this.preferences = { ...this.preferences, ...prefs };
    return { ...this.preferences };
  }
}

export const notificationService = new NotificationService();
