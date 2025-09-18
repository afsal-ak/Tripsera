// src/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import socket from "@/sockets/socket";
import { fetchAdminNotification } from "@/services/admin/notificationsService";
import { fetchNotification } from "@/services/user/notificationsService";
import { SOCKET_NOTIFICATION_EVENTS } from "@/sockets/events";
import type { INotification } from "@/types/INotifications";
import { toast } from "sonner";
type Role = "user" | "admin";

export function useNotifications(userId: string, role: Role) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

console.log(role,'role')
  useEffect(() => {
    const load = async () => {
      if (role=='user') {
        const response = await fetchNotification();
        setNotifications(response.result.notification);
      } else if (role =='admin') {
        const response = await fetchAdminNotification();
        console.log(response,'resposne in not')
        setNotifications(response.data);
      }

    };
    if (userId) load();
  }, [userId]);

  // Socket join + new notification listener
  useEffect(() => {
    if (!userId) return;

    // Join personal room
    socket.emit(SOCKET_NOTIFICATION_EVENTS.JOIN, userId);

    // Listen for new notifications
    socket.on(SOCKET_NOTIFICATION_EVENTS.NEW, (notification: INotification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Optional: show toast
      //  toast.success(notification.message);
      toast.info(`${notification.title}: ${notification.message}`);

    });

    return () => {
      socket.off(SOCKET_NOTIFICATION_EVENTS.NEW);
    };
  }, [userId]);

  return { notifications };
}
