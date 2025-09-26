import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "@/sockets/socket";
import { SOCKET_EVENTS } from "@/sockets/events";

import {
  addMessageToRoom,
  deleteMessageFromRoom,
  markMessageAsReadInRoom,
  setUserOnline,
  setUserOffline,
  setCurrentOnlineUsers,
} from "@/redux/slices/chatRoomSlice";
import type { AppDispatch } from "@/redux/store";
import type { IMessage } from "@/types/IMessage";

interface UseChatRoomsSocketProps {
  currentUserId: string;
}

export const useChatRoomsSocket = ({ currentUserId }: UseChatRoomsSocketProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentUserId) return;

    // 🔹 Tell server this user is online globally
    socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId: currentUserId });

    // --- global message events ---
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
      dispatch(addMessageToRoom({ roomId: message.roomId, message, currentUserId }));
    });

    socket.on(
      SOCKET_EVENTS.MESSAGE_DELETED,
      ({ roomId, messageId }: { roomId: string; messageId: string }) => {
        dispatch(deleteMessageFromRoom({ roomId, messageId }));
      }
    );

    socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ roomId, userId }: { roomId: string; userId: string }) => {
      dispatch(markMessageAsReadInRoom({ roomId, userId }));
    });

    // --- presence events ---
    socket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }: { userId: string }) => {
      dispatch(setUserOnline(userId));
    });

    socket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }: { userId: string }) => {
      dispatch(setUserOffline(userId));
    });

    socket.on(SOCKET_EVENTS.CURRENT_ONLINE_USERS, ({ users }: { users: string[] }) => {
      dispatch(setCurrentOnlineUsers(users));
    });

    return () => {
      // 🔹 Tell server user is leaving
      socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId: currentUserId });

      socket.off(SOCKET_EVENTS.NEW_MESSAGE);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
      socket.off(SOCKET_EVENTS.MESSAGE_READ);

      socket.off(SOCKET_EVENTS.USER_ONLINE);
      socket.off(SOCKET_EVENTS.USER_OFFLINE);
      socket.off(SOCKET_EVENTS.CURRENT_ONLINE_USERS);
    };
  }, [dispatch, currentUserId]);
};
