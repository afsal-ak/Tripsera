import { useEffect, useCallback } from "react";
import socket from "@/sockets/socket";
import { SOCKET_EVENTS } from "@/sockets/events";
import type { IMessage, ISendMessage } from "@/types/IMessage";

interface UseChatSocketProps {
  roomId?: string;
  currentUserId: string;
  currentUsername?: string;
  onMessageReceived: (message: IMessage) => void;
  onMessageDeleted: (messageId: string) => void;
  onMessageRead: (messageId: string, userId: string) => void;
  onTyping?: (userId: string, username: string) => void;
  onStopTyping?: (userId: string) => void;
}

export const useChatSocket = ({
  roomId,
  currentUserId,
  currentUsername,
  onMessageReceived,
  onMessageDeleted,
  onMessageRead,
  onTyping,
  onStopTyping,
}: UseChatSocketProps) => {
  const handleMessageDeleted = useCallback(
    ({ messageId }: { messageId: string }) => onMessageDeleted(messageId),
    [onMessageDeleted]
  );

  const handleMessageRead = useCallback(
    
    ({ messageId, userId }: { messageId: string; userId: string }) =>
      onMessageRead(messageId, userId),
    [onMessageRead]
  );

  const handleTyping = useCallback(
    ({ userId, username }: { userId: string; username: string }) => {
      if (userId !== currentUserId) onTyping?.(userId, username);
    },
    [currentUserId, onTyping]
  );

  const handleStopTyping = useCallback(
    ({ userId }: { userId: string }) => {
      if (userId !== currentUserId) onStopTyping?.(userId);
    },
    [currentUserId, onStopTyping]
  );

  useEffect(() => {
    if (!roomId) return;

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, userId: currentUserId });

    // --- room listeners only ---
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
   socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
    socket.on(SOCKET_EVENTS.TYPING, handleTyping);
    socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId: currentUserId });

      socket.off(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
      socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
      socket.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
      socket.off(SOCKET_EVENTS.TYPING, handleTyping);
      socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
    };
  }, [
    roomId,
    currentUserId,
    onMessageReceived,
    handleMessageDeleted,
    handleMessageRead,
    handleTyping,
    handleStopTyping,
  ]);

  // --- exposed functions ---
  const sendMessage = (messageData: ISendMessage) => {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
  };

  const deleteMessage = (messageId: string) => {
    socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
  };

  const markAsRead = (messageId: string) => {
    socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
      roomId,
      messageId,
      userId: currentUserId,
    });
  };

  const startTyping = () => {
    socket.emit(SOCKET_EVENTS.TYPING, {
      roomId,
      userId: currentUserId,
      username: currentUsername,
    });
  };

  const stopTyping = () => {
    socket.emit(SOCKET_EVENTS.STOP_TYPING, { roomId, userId: currentUserId });
  };

  return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
};
