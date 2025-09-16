// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import socket from "@/sockets/socket";
// import { SOCKET_EVENTS } from "@/sockets/events";
// import type { AppDispatch } from "@/redux/store";
// import {
//   addMessageToRoom,
//   deleteMessageFromRoom,
//   markMessageAsReadInRoom,
// } from "@/redux/slices/chatRoomSlice";
// import type { IMessage } from "@/types/IMessage";

// interface UseChatRoomsSocketProps {
//   currentUserId: string;
//   onNewMessage?: (roomId: string, message: IMessage) => void;
//   onMessageDeleted?: (roomId: string, messageId: string) => void;
//   onMessageRead?: (roomId: string, messageId: string, userId: string) => void;
// }

// export const useChatRoomsSocket = ({
//   currentUserId,
//   onNewMessage,
//   onMessageDeleted,
//   onMessageRead,
// }: UseChatRoomsSocketProps) => {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     // 📨 Handle new message
//   socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
//   dispatch(addMessageToRoom({ roomId: message.roomId, message, currentUserId }));
//   onNewMessage?.(message.roomId, message);
// });


//      socket.on(
//       SOCKET_EVENTS.MESSAGE_DELETED,
//       ({ roomId, messageId }: { roomId: string; messageId: string }) => {
//         dispatch(deleteMessageFromRoom({ roomId, messageId }));
//         onMessageDeleted?.(roomId, messageId);
//       }
//     );

//      socket.on(
//       SOCKET_EVENTS.MESSAGE_READ,
//       ({ roomId, messageId, userId }: { roomId: string; messageId: string; userId: string }) => {
//         dispatch(markMessageAsReadInRoom({ roomId, userId }));
//         onMessageRead?.(roomId, messageId, userId);
//       }
//     );

//     // Cleanup listeners on unmount
//     return () => {
//       socket.off(SOCKET_EVENTS.NEW_MESSAGE);
//       socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
//       socket.off(SOCKET_EVENTS.MESSAGE_READ);
//     };
//   }, [dispatch, currentUserId, onNewMessage, onMessageDeleted, onMessageRead]);
// };
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "@/sockets/socket";
import { SOCKET_EVENTS } from "@/sockets/events";
import type { AppDispatch } from "@/redux/store";
import {
  addMessageToRoom,
  deleteMessageFromRoom,
  markMessageAsReadInRoom,
} from "@/redux/slices/chatRoomSlice";
import type { IMessage } from "@/types/IMessage";

interface UseChatRoomsSocketProps {
  currentUserId: string;
  onNewMessage?: (roomId: string, message: IMessage) => void;
  onMessageDeleted?: (roomId: string, messageId: string) => void;
  onMessageRead?: (roomId: string, messageId: string, userId: string) => void;
}

export const useChatRoomsSocket = ({
  currentUserId,
  onNewMessage,
  onMessageDeleted,
  onMessageRead,
}: UseChatRoomsSocketProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // New message
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, (message: IMessage) => {
      dispatch(addMessageToRoom({ roomId: message.roomId, message, currentUserId }));
      onNewMessage?.(message.roomId, message);
    });

    // Message deleted
    socket.on(
      SOCKET_EVENTS.MESSAGE_DELETED,
      ({ roomId, messageId }: { roomId: string; messageId: string }) => {
        dispatch(deleteMessageFromRoom({ roomId, messageId }));
        onMessageDeleted?.(roomId, messageId);
      }
    );

    // Message read
    socket.on(
      SOCKET_EVENTS.MESSAGE_READ,
      ({ roomId, messageId, userId }: { roomId: string; messageId: string; userId: string }) => {
        dispatch(markMessageAsReadInRoom({ roomId, userId }));
        onMessageRead?.(roomId, messageId, userId);
      }
    );

    return () => {
      socket.off(SOCKET_EVENTS.NEW_MESSAGE);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED);
      socket.off(SOCKET_EVENTS.MESSAGE_READ);
    };
  }, [dispatch, currentUserId, onNewMessage, onMessageDeleted, onMessageRead]);
};
