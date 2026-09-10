import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types/notification';
import { notificationService } from '../services/notification.service';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markMedicineTaken: (id: string, isTaken: boolean) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = async () => {
    const list = await notificationService.getNotifications();
    const count = await notificationService.getUnreadCount();
    setNotifications(list);
    setUnreadCount(count);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await refreshNotifications();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await refreshNotifications();
  };

  const markMedicineTaken = async (id: string, isTaken: boolean) => {
    await notificationService.markMedicineTaken(id, isTaken);
    await refreshNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        markMedicineTaken,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
