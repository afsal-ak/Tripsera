import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socket from '@/sockets/socket';
import { SOCKET_EVENTS } from '@/sockets/events';
import {
  updateRoomOnNewMessage,
  deleteMessageFromRoom,
  markMessageAsReadInRoom,
  setUserOnline,
  setUserOffline,
  setCurrentOnlineUsers,
  incrementTotalUnread,
} from '@/redux/slices/chatRoomSlice';
import type { AppDispatch } from '@/redux/store';
import type { IMessage } from '@/types/IMessage';

interface UseChatRoomsSocketProps {
  currentUserId: string;
}

export const useChatRoomsSocket = ({ currentUserId }: UseChatRoomsSocketProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!currentUserId) return;

    socket.emit(SOCKET_EVENTS.USER_CONNECTED, { userId: currentUserId });

    const handleNewMessage = (message: IMessage) => {
      dispatch(updateRoomOnNewMessage({ roomId: message.roomId, message, currentUserId }));
     };

    const handleMessageDeleted = ({ roomId, messageId }: { roomId: string; messageId: string }) => {
      dispatch(deleteMessageFromRoom({ roomId, messageId }));
    };

    const handleMessageRead = ({ roomId, userId }: { roomId: string; userId: string }) => {
      dispatch(markMessageAsReadInRoom({ roomId, userId }));
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      dispatch(setUserOnline(userId));
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      dispatch(setUserOffline(userId));
    };

    const handleCurrentOnlineUsers = ({ users }: { users: string[] }) => {
      // console.log(" Current online users:", users);
      dispatch(setCurrentOnlineUsers(users));
    };

    //  remove any existing listeners first (prevents stacking)
    socket.off(SOCKET_EVENTS.NEW_MESSAGE);
    socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
    socket.off(SOCKET_EVENTS.MESSAGE_READ);
    socket.off(SOCKET_EVENTS.USER_ONLINE);
    socket.off(SOCKET_EVENTS.USER_OFFLINE);
    socket.off(SOCKET_EVENTS.CURRENT_ONLINE_USERS);

    //  attach fresh listeners
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
    socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
    socket.on(SOCKET_EVENTS.CURRENT_ONLINE_USERS, handleCurrentOnlineUsers);

    return () => {
      //  console.log("Cleaning up socket listeners for user:", currentUserId);
      socket.emit(SOCKET_EVENTS.USER_DISCONNECTED, { userId: currentUserId });

      socket.off(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
      socket.off(SOCKET_EVENTS.CURRENT_ONLINE_USERS, handleCurrentOnlineUsers);
    };
  }, [dispatch, currentUserId]);
};
