import { useEffect } from "react";
import socket from "@/sockets/socket";
import { SOCKET_EVENTS } from "@/sockets/events";

export function useGlobalSocket(userId: string) {
  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
}
