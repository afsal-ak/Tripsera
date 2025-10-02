

// // import { useEffect } from "react";

// // import socket from "@/sockets/socket";
// // import { SOCKET_EVENTS } from "@/sockets/events";
// // import type { IMessage, ISendMessage } from "@/types/IMessage";

// // interface UseChatSocketProps {
// //   roomId?: string,
// //   currentUserId: string;
// //   currentUsername?: string;
// //   onUserOnline:(userId:string)=>void,
// //   onUserOffline:(userId:string)=>void,
// //   onMessageReceived: (message: IMessage) => void;
// //   onMessageDeleted: (messageId: string) => void;
// //   onMessageRead: (messageId: string, userId: string) => void;
// //   onTyping?: (userId: string, username: string) => void;
// //   onStopTyping?: (userId: string) => void;
// // }

// // export const useChatSocket = ({
// //   roomId,
// //   currentUserId,
// //   currentUsername,
// //   onUserOnline,
// //   onUserOffline,
// //   onMessageReceived,
// //   onMessageDeleted,
// //   onMessageRead,
// //   onTyping,
// //   onStopTyping,
// // }: UseChatSocketProps) => {
// //   useEffect(() => {
// //     if (!roomId) return;

// //     socket.emit(SOCKET_EVENTS.JOIN_ROOM, {roomId,userId:currentUserId});

// //     // socket.on(SOCKET_EVENTS.USER_ONLINE,({userId})=>onUserOnline?.(userId))
    
// //   socket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }) => onUserOnline?.(userId));
// //   socket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }) => onUserOffline?.(userId));

// //     socket.on(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
// //     socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
// //     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) => onMessageDeleted(messageId));
// //     socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) =>{
// //        onMessageRead(messageId, userId)
// //          console.log(`User ${userId} read message ${messageId}`);

// //     })
// //     socket.on(SOCKET_EVENTS.TYPING, ({ userId, username }) => {
// //       if (userId !== currentUserId) onTyping?.(userId, username);
// //     });

// //     socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
// //       if (userId !== currentUserId) onStopTyping?.(userId);
// //     });

// //     return () => {
// //   socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId: currentUserId });
// //       socket.off(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
// //       socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
// //       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
// //       socket.off(SOCKET_EVENTS.MESSAGE_READ);
// //       socket.off(SOCKET_EVENTS.TYPING);
// //       socket.off(SOCKET_EVENTS.STOP_TYPING);
// //     };
// //   }, [roomId, currentUserId, onMessageReceived, onMessageDeleted, onMessageRead, onTyping, onStopTyping]);


// //   const sendMessage = (messageData: ISendMessage) => {
// //     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
// //   }
// //   const deleteMessage = (messageId: string) => {
// //     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId })
// //   }


// //   const markAsRead = (messageId: string) => {
// //     console.log('marked as read')
// //     socket.emit(SOCKET_EVENTS.MARK_AS_READ, { roomId, messageId });
// //   };

// //   const startTyping = () => {
// //     socket.emit(SOCKET_EVENTS.TYPING, {
// //       roomId,
// //       userId: currentUserId,
// //       username: currentUsername,
// //     });
// //   };

// //   const stopTyping = () => {
// //     socket.emit(SOCKET_EVENTS.STOP_TYPING, {
// //       roomId,
// //       userId: currentUserId,
// //     });
// //   };
// //   socket.onAny((event, ...args) => {
// //     console.log("Socket event:", event, args);
// //   });

// //   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// // }

// // import { useEffect } from "react";
// // import socket from "@/sockets/socket";
// // import { SOCKET_EVENTS } from "@/sockets/events";
// // import type { IMessage, ISendMessage } from "@/types/IMessage";

// // interface UseChatSocketProps {
// //   roomId?: string;
// //   currentUserId: string;
// //   currentUsername?: string;
// //   partnerId?: string;
// //   onUserOnline: (userId: string) => void;
// //   onUserOffline: (userId: string) => void;
// //   onMessageReceived: (message: IMessage) => void;
// //   onMessageDeleted: (messageId: string) => void;
// //   onMessageRead: (messageId: string, userId: string) => void;
// //   onTyping?: (userId: string, username: string) => void;
// //   onStopTyping?: (userId: string) => void;
// // }

// // export const useChatSocket = ({
// //   roomId,
// //   currentUserId,
// //   currentUsername,
// //   partnerId,
// //   onUserOnline,
// //   onUserOffline,
// //   onMessageReceived,
// //   onMessageDeleted,
// //   onMessageRead,
// //   onTyping,
// //   onStopTyping,
// // }: UseChatSocketProps) => {
// //   useEffect(() => {
// //     if (!roomId) return;

// //     // join room with current user id
// //     socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, userId: currentUserId });

// //     // --- online / offline listeners ---
// //     socket.on(SOCKET_EVENTS.USER_ONLINE, ({ userId }) => {
// //       onUserOnline?.(userId);
// //     });

// //     socket.on(SOCKET_EVENTS.USER_OFFLINE, ({ userId }) => {
// //       onUserOffline?.(userId);
// //     });

// //     // handle initial online users list
// //     socket.on(SOCKET_EVENTS.CURRENT_ONLINE_USERS, ({ users }) => {
// //       if (partnerId && users.includes(partnerId)) {
// //         onUserOnline(partnerId);
// //       }
// //     });

// //     // --- message listeners ---
// //     socket.on(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
// //     socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
// //     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) =>
// //       onMessageDeleted(messageId)
// //     );
// //     socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) => {
// //       onMessageRead(messageId, userId);
// //       console.log(`User ${userId} read message ${messageId}`);
// //     });

// //     // --- typing listeners ---
// //     socket.on(SOCKET_EVENTS.TYPING, ({ userId, username }) => {
// //       if (userId !== currentUserId) onTyping?.(userId, username);
// //     });

// //     socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
// //       if (userId !== currentUserId) onStopTyping?.(userId);
// //     });

// //     // debug logger
// //     socket.onAny((event, ...args) => {
// //       console.log("Socket event:", event, args);
// //     });

// //     // cleanup
// //     return () => {
// //       socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId: currentUserId });
// //       socket.off(SOCKET_EVENTS.USER_ONLINE);
// //       socket.off(SOCKET_EVENTS.USER_OFFLINE);
// //       socket.off(SOCKET_EVENTS.CURRENT_ONLINE_USERS);
// //       socket.off(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
// //       socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
// //       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
// //       socket.off(SOCKET_EVENTS.MESSAGE_READ);
// //       socket.off(SOCKET_EVENTS.TYPING);
// //       socket.off(SOCKET_EVENTS.STOP_TYPING);
// //       socket.offAny();
// //     };
// //   }, [
// //     roomId,
// //     currentUserId,
// //     currentUsername,
// //     partnerId,
// //     onUserOnline,
// //     onUserOffline,
// //     onMessageReceived,
// //     onMessageDeleted,
// //     onMessageRead,
// //     onTyping,
// //     onStopTyping,
// //   ]);

// //   // --- exposed functions ---

// //   const sendMessage = (messageData: ISendMessage) => {
// //     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
// //   };

// //   const deleteMessage = (messageId: string) => {
// //     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
// //   };

// //   const markAsRead = (messageId: string) => {
// //     console.log("marked as read");
// //     socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
// //       roomId,
// //       messageId,
// //       userId: currentUserId, // FIXED: send userId also
// //     });
// //   };

// //   const startTyping = () => {
// //     socket.emit(SOCKET_EVENTS.TYPING, {
// //       roomId,
// //       userId: currentUserId,
// //       username: currentUsername,
// //     });
// //   };

// //   const stopTyping = () => {
// //     socket.emit(SOCKET_EVENTS.STOP_TYPING, {
// //       roomId,
// //       userId: currentUserId,
// //     });
// //   };

// //   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// // };


// import { useEffect, useCallback } from "react";
// import socket from "@/sockets/socket";
// import { SOCKET_EVENTS } from "@/sockets/events";
// import type { IMessage, ISendMessage } from "@/types/IMessage";

// interface UseChatSocketProps {
//   roomId?: string;
//   currentUserId: string;
//   currentUsername?: string;
//   partnerId?: string;
//   onUserOnline?: (userId: string) => void;
//   onUserOffline?: (userId: string) => void;
//   onMessageReceived: (message: IMessage) => void;
//   onMessageDeleted: (messageId: string) => void;
//   onMessageRead: (messageId: string, userId: string) => void;
//   onTyping?: (userId: string, username: string) => void;
//   onStopTyping?: (userId: string) => void;
// }

// export const useChatSocket = ({
//   roomId,
//   currentUserId,
//   currentUsername,
//   partnerId,
//   onUserOnline,
//   onUserOffline,
//   onMessageReceived,
//   onMessageDeleted,
//   onMessageRead,
//   onTyping,
//   onStopTyping,
// }: UseChatSocketProps) => {

//   const handleUserOnline = useCallback(
//     ({ userId }: { userId: string }) => onUserOnline!(userId),
//     [onUserOnline]
//   );

//   const handleUserOffline = useCallback(
//     ({ userId }: { userId: string }) => onUserOffline!(userId),
//     [onUserOffline]
//   );

//   const handleCurrentOnlineUsers = useCallback(
//     ({ users }: { users: string[] }) => {
//       if (partnerId && users.includes(partnerId)) {
//         onUserOnline!(partnerId);
//       }
//     },
//     [partnerId, onUserOnline]
//   );

//   const handleMessageDeleted = useCallback(
//     ({ messageId }: { messageId: string }) => onMessageDeleted(messageId),
//     [onMessageDeleted]
//   );

//   const handleMessageRead = useCallback(
//     ({ messageId, userId }: { messageId: string; userId: string }) =>
//       onMessageRead(messageId, userId),
//     [onMessageRead]
//   );

//   const handleTyping = useCallback(
//     ({ userId, username }: { userId: string; username: string }) => {
//       if (userId !== currentUserId) onTyping?.(userId, username);
//     },
//     [currentUserId, onTyping]
//   );

//   const handleStopTyping = useCallback(
//     ({ userId }: { userId: string }) => {
//       if (userId !== currentUserId) onStopTyping?.(userId);
//     },
//     [currentUserId, onStopTyping]
//   );

//   useEffect(() => {
//     if (!roomId) return;

//     socket.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, userId: currentUserId });

//     // --- attach listeners ---
//     socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
//     socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
//     socket.on(SOCKET_EVENTS.CURRENT_ONLINE_USERS, handleCurrentOnlineUsers);
//     socket.on(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
//     socket.on(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
//     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
//     socket.on(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
//     socket.on(SOCKET_EVENTS.TYPING, handleTyping);
//     socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

//     // debug logger
//     socket.onAny((event, ...args) => {
//       console.log("Socket event:", event, args);
//     });

//     // cleanup listeners on unmount
//     return () => {
//       socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId: currentUserId });

//       socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
//       socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
//       socket.off(SOCKET_EVENTS.CURRENT_ONLINE_USERS, handleCurrentOnlineUsers);
//       socket.off(SOCKET_EVENTS.NEW_MESSAGE, onMessageReceived);
//       socket.off(SOCKET_EVENTS.MESSAGE_SEND, onMessageReceived);
//       socket.off(SOCKET_EVENTS.MESSAGE_DELETED, handleMessageDeleted);
//       socket.off(SOCKET_EVENTS.MESSAGE_READ, handleMessageRead);
//       socket.off(SOCKET_EVENTS.TYPING, handleTyping);
//       socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
//       socket.offAny();
//     };
//   }, [
//     roomId,
//     currentUserId,
//     partnerId,
//     handleUserOnline,
//     handleUserOffline,
//     handleCurrentOnlineUsers,
//     onMessageReceived,
//     handleMessageDeleted,
//     handleMessageRead,
//     handleTyping,
//     handleStopTyping,
//   ]);

//   // --- exposed functions ---
//   const sendMessage = (messageData: ISendMessage) => {
//     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
//   };

//   const deleteMessage = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
//   };

//   const markAsRead = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.MARK_AS_READ, {
//       roomId,
//       messageId,
//       userId: currentUserId,
//     });
//   };

//   const startTyping = () => {
//     socket.emit(SOCKET_EVENTS.TYPING, {
//       roomId,
//       userId: currentUserId,
//       username: currentUsername,
//     });
//   };

//   const stopTyping = () => {
//     socket.emit(SOCKET_EVENTS.STOP_TYPING, { roomId, userId: currentUserId });
//   };

//   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// };


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
    console.log('gggggggggggg')
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
