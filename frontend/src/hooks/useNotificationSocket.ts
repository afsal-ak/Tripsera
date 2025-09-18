import { useEffect, useState } from "react";
import socket from "@/sockets/socket";
import { SOCKET_NOTIFICATION_EVENTS } from "@/sockets/events";
import type { INotification } from "@/types/INotifications";
import { toast } from "sonner";

export function useNotificationSocket(userId: string) {
  const [socketNotifications, setSocketNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (!userId) return;

    socket.emit(SOCKET_NOTIFICATION_EVENTS.JOIN, userId);

    socket.on(SOCKET_NOTIFICATION_EVENTS.NEW, (notification: INotification) => {
      setSocketNotifications((prev) => [notification, ...prev]);
      toast.info(`${notification.title}: ${notification.message}`);
    });

    return () => {
      socket.off(SOCKET_NOTIFICATION_EVENTS.NEW);
    };
  }, [userId]);

  return { socketNotifications };
}
