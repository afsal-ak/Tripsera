import { useEffect, useState } from 'react';
import socket from '@/sockets/socket';
import { SOCKET_NOTIFICATION_EVENTS } from '@/sockets/events';
import { toast } from 'sonner';
import type { INotification } from '@/types/INotifications';

export function useAdminNotifications(adminId: string) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (!adminId) return;

    // Join admin's notification room
    socket.emit(SOCKET_NOTIFICATION_EVENTS.JOIN, adminId);

    // Listen for new booking notifications
    socket.on(SOCKET_NOTIFICATION_EVENTS.NEW, (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Show toast for real-time alert
      toast.info(`${notification.title}: ${notification.message}`);
    });

    return () => {
      socket.off(SOCKET_NOTIFICATION_EVENTS.NEW);
    };
  }, [adminId]);

  return { notifications };
}
