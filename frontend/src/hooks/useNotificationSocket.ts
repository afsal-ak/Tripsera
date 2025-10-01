
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "@/sockets/socket";
import { SOCKET_NOTIFICATION_EVENTS } from "@/sockets/events";
import type { INotification } from "@/types/INotifications";
import { toast } from "sonner";
import { addNotification } from "@/redux/slices/notificationSlice";

export function useNotificationSocket(userId: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    socket.emit(SOCKET_NOTIFICATION_EVENTS.JOIN, userId);

    const handleNewNotification = (notification: INotification) => {
      dispatch(addNotification(notification));
      toast.info(`${notification.title}: ${notification.message}`);
    };

    socket.on(SOCKET_NOTIFICATION_EVENTS.NEW, handleNewNotification);

    return () => {
      socket.off(SOCKET_NOTIFICATION_EVENTS.NEW, handleNewNotification);
    };
  }, [userId, dispatch]);

  // Return an empty object or any other data if needed
  return {}; 
}
