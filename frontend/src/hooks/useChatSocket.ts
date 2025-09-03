// // import { useEffect } from "react";
// // import socket from "@/sockets/socket";
// // import { SOCKET_EVENTS } from "@/sockets/events";
// // import type { IMessage } from "@/types/Message";

// // interface UseChatSocketProps {
// //   roomId: string;
// //   currentUserId: string;
// //   onMessageReceived: (message: IMessage) => void;
// //   onMessageDeleted: (messageId: string) => void;
// //   onMessageRead: (messageId: string, userId: string) => void;
// //   onTyping?: (userId: string) => void;
// //   onStopTyping?: (userId: string) => void;
// // }

// // export const useChatSocket = ({
// //   roomId,
// //   currentUserId,
// //   onMessageReceived,
// //   onMessageDeleted,
// //   onMessageRead,
// //   onTyping,
// //   onStopTyping,
// // }: UseChatSocketProps) => {
// //   useEffect(() => {
// //     if (!roomId) return;

// //     socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);

// //     socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
// //       onMessageReceived(message);
// //     });

// //     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) => {
// //       onMessageDeleted(messageId);
// //     });

// //     socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) => {
// //       onMessageRead(messageId, userId);
// //     });

// //     socket.on(SOCKET_EVENTS.TYPING, ({ userId }) => {
// //       if (userId !== currentUserId) onTyping?.(userId);
// //     });

// //     socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
// //       if (userId !== currentUserId) onStopTyping?.(userId);
// //     });

// //     return () => {
// //       socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
// //       socket.off(SOCKET_EVENTS.NEW_MESSAGE);
// //       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
// //       socket.off(SOCKET_EVENTS.MESSAGE_READ);
// //       socket.off(SOCKET_EVENTS.TYPING);
// //       socket.off(SOCKET_EVENTS.STOP_TYPING);
// //     };
// //   }, [roomId]);

// //   const sendMessage = (messageData: Partial<IMessage>) => {
// //     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
// //   };

// //   const deleteMessage = (messageId: string) => {
// //     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
// //   };

// //   const markAsRead = (messageId: string) => {
// //     socket.emit(SOCKET_EVENTS.MARK_AS_READ, { roomId, messageId });
// //   };

// //   const startTyping = () => {
// //     socket.emit(SOCKET_EVENTS.TYPING, { roomId, userId: currentUserId });
// //   };

// //   const stopTyping = () => {
// //     socket.emit(SOCKET_EVENTS.STOP_TYPING, { roomId, userId: currentUserId });
// //   };

// //   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// // };



// import { useEffect } from "react";
// import socket from "@/sockets/socket";
// import { SOCKET_EVENTS } from "@/sockets/events";
// import type { IMessage } from "@/types/Message";

// interface UseChatSocketProps {
//   roomId: string;
//   currentUserId: string;
//   onMessageReceived: (message: IMessage) => void;
//   onMessageDeleted: (messageId: string) => void;
//   onMessageRead: (messageId: string, userId: string) => void;
//   onTyping?: (userId: string) => void;
//   onStopTyping?: (userId: string) => void;
// }

// export const useChatSocket = ({
//   roomId,
//   currentUserId,
//   onMessageReceived,
//   onMessageDeleted,
//   onMessageRead,
//   onTyping,
//   onStopTyping,
// }: UseChatSocketProps) => {
//   useEffect(() => {
//     if (!roomId) return;

//     socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);

//     socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
//       onMessageReceived(message);
//     });

//     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) => {
//       onMessageDeleted(messageId);
//     });

//     socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) => {
//       onMessageRead(messageId, userId);
//     });

//     socket.on(SOCKET_EVENTS.TYPING, ({ userId }) => {
//       if (userId !== currentUserId) onTyping?.(userId);
//     });

//     socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
//       if (userId !== currentUserId) onStopTyping?.(userId);
//     });

//     return () => {
//       socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
//       socket.off(SOCKET_EVENTS.NEW_MESSAGE);
//       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
//       socket.off(SOCKET_EVENTS.MESSAGE_READ);
//       socket.off(SOCKET_EVENTS.TYPING);
//       socket.off(SOCKET_EVENTS.STOP_TYPING);
//     };
//   }, [roomId]);

//   const sendMessage = (messageData: Partial<IMessage>) => {
//     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
//   };

//   const deleteMessage = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
//   };

//   const markAsRead = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.MARK_AS_READ, { roomId, messageId });
//   };

//   const startTyping = () => {
//     socket.emit(SOCKET_EVENTS.TYPING, { roomId, userId: currentUserId });
//   };

//   const stopTyping = () => {
//     socket.emit(SOCKET_EVENTS.STOP_TYPING, { roomId, userId: currentUserId });
//   };

//   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// };










// import { useEffect } from "react";
// import socket from "@/sockets/socket";
// import { SOCKET_EVENTS } from "@/sockets/events";
// import type { IMessage } from "@/types/Message";

// interface UseChatSocketProps {
//   roomId: string;
//   currentUserId: string;
//   currentUsername: string;
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
//   onMessageReceived,
//   onMessageDeleted,
//   onMessageRead,
//   onTyping,
//   onStopTyping,
// }: UseChatSocketProps) => {
//   useEffect(() => {
//     if (!roomId) return;

//     // Join room
//     socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId);

//     // ✅ Listen to new messages from others
//     socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
//       onMessageReceived(message);
//     });

//     // ✅ Listen to messages sent by the current user
//     socket.on(SOCKET_EVENTS.MESSAGE_SEND, (message: IMessage) => {
//       onMessageReceived(message);
//     });

//     // Message deleted
//     socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) => {
//       onMessageDeleted(messageId);
//     });

//     // Mark as read
//     socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) => {
//       onMessageRead(messageId, userId);
//     });

//     // Typing indicators
//     socket.on(SOCKET_EVENTS.TYPING, ({ userId, username }) => {
//       if (userId !== currentUserId) onTyping?.(userId, username);
//     });

//     socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
//       if (userId !== currentUserId) onStopTyping?.(userId);
//     });

//     return () => {
//       socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId);
//       socket.off(SOCKET_EVENTS.NEW_MESSAGE);
//       socket.off(SOCKET_EVENTS.MESSAGE_SEND);   
//       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
//       socket.off(SOCKET_EVENTS.MESSAGE_READ);
//       socket.off(SOCKET_EVENTS.TYPING);
//       socket.off(SOCKET_EVENTS.STOP_TYPING);
//     };
//   }, [roomId]);

//   const sendMessage = (messageData: Partial<IMessage>) => {
//     socket.emit(SOCKET_EVENTS.SEND_MESSAGE, messageData);
//   };

//   const deleteMessage = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomId, messageId });
//   };

//   const markAsRead = (messageId: string) => {
//     socket.emit(SOCKET_EVENTS.MARK_AS_READ, { roomId, messageId });
//   };

//   const startTyping = () => {
//     socket.emit(SOCKET_EVENTS.TYPING, {
//       roomId,
//       userId: currentUserId,
//       username: currentUsername,
//     });
//   };

//   const stopTyping = () => {
//     socket.emit(SOCKET_EVENTS.STOP_TYPING, {
//       roomId,
//       userId: currentUserId,
//     });
//   };

//   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
// };

import { useEffect } from "react";

import socket from "@/sockets/socket";
import { SOCKET_EVENTS } from "@/sockets/events";
import type { IMessage } from "@/types/Message";

interface UseChatSocketProps {
  roomId: string,
  currentUserId: string;
  currentUsername: string;
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

  useEffect(() => {
    if (!roomId) {
      return
    }

    //join room

    socket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId)

    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
      onMessageReceived(message)
    })

    socket.on(SOCKET_EVENTS.MESSAGE_SEND, (message: IMessage) => {
      onMessageReceived(message)
    })

    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, ({ messageId }) => {
      onMessageDeleted(messageId);
    })

    socket.on(SOCKET_EVENTS.MESSAGE_READ, ({ messageId, userId }) => {
      onMessageRead(messageId, userId);
    });

    //typing indicator
    socket.on(SOCKET_EVENTS.TYPING, ({ userId, username }) => {
      if (userId !== currentUserId) {
        onTyping?.(userId, username)
      }
    })

      socket.on(SOCKET_EVENTS.STOP_TYPING, ({ userId }) => {
        if (userId !== currentUserId) onStopTyping?.(userId);
      });

      return()=>{
        socket.emit(SOCKET_EVENTS.LEAVE_ROOM,roomId);
        socket.off(SOCKET_EVENTS.NEW_MESSAGE)
         socket.off(SOCKET_EVENTS.MESSAGE_SEND);   
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
      socket.off(SOCKET_EVENTS.MESSAGE_READ);
      socket.off(SOCKET_EVENTS.TYPING);
      socket.off(SOCKET_EVENTS.STOP_TYPING);
    
      }

    },[roomId])

    const sendMessage=(messageData:Partial<IMessage>)=>{
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE,messageData);
    }
const deleteMessage=(messageId:string)=>{
  socket.emit(SOCKET_EVENTS.DELETE_MESSAGE,{roomId,messageId})
}
 

  const markAsRead = (messageId: string) => {
    socket.emit(SOCKET_EVENTS.MARK_AS_READ, { roomId, messageId });
  };

  const startTyping = () => {
    socket.emit(SOCKET_EVENTS.TYPING, {
      roomId,
      userId: currentUserId,
      username: currentUsername,
    });
  };

  const stopTyping = () => {
    socket.emit(SOCKET_EVENTS.STOP_TYPING, {
      roomId,
      userId: currentUserId,
    });
  };

   return { sendMessage, deleteMessage, markAsRead, startTyping, stopTyping };
}