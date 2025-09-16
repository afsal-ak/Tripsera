// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import type { IMessage, IChatRoom } from "@/types/IMessage";

// interface ChatRoomsState {
//   rooms: IChatRoom[];
//   activeRoomId?: string;
// }

// const initialState: ChatRoomsState = {
//   rooms: [],
//   activeRoomId: undefined,
// };

// const chatRoomsSlice = createSlice({
//   name: "chatRooms",
//   initialState,
//   reducers: {
//     setRooms: (state, action: PayloadAction<IChatRoom[]>) => {
//       state.rooms = action.payload;
//     },

//     setActiveRoom: (state, action: PayloadAction<string>) => {
//       state.activeRoomId = action.payload;
//       // reset unread for current user when entering room
//       const room = state.rooms.find((r) => r._id === action.payload);
//       if (room?.unreadCounts) {
//         // assume you know currentUserId somewhere (can inject via thunk)
//         // room.unreadCounts[currentUserId] = 0;
//       }
//     },

//     addMessageToRoom: (
//       state,
//       action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
//     ) => {
//       const { roomId, message, currentUserId } = action.payload;
//       let room = state.rooms.find((r) => r._id === roomId);

//       if (room) {
//         // update last message preview
//         room.lastMessageContent = message.content ?? "";

//         // unread logic
//         if (room.unreadCounts) {
//           if (roomId !== state.activeRoomId) {
//             room.unreadCounts[currentUserId] =
//               (room.unreadCounts[currentUserId] || 0) + 1;
//           }
//         } else {
//           room.unreadCounts = { [currentUserId]: 1 };
//         }
//       } else {
//         // room not found → create one dynamically
//         room = {
//           _id: roomId,
//           participants: [message.senderId], // fallback, API should give full participants
//           createdBy: message.senderId._id,
//           isGroup: false,
//           lastMessageContent: message.content ?? "",
//           unreadCounts: { [currentUserId]: 1 },
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         } as IChatRoom;

//         state.rooms.unshift(room);
//       }

//       // reorder rooms so active room goes to top
//       state.rooms = [
//         room,
//         ...state.rooms.filter((r) => r._id !== roomId),
//       ];
//     },

//     deleteMessageFromRoom: (
//       state,
//       action: PayloadAction<{ roomId: string; messageId: string; lastMessageContent?: string }>
//     ) => {
//       const { roomId, messageId, lastMessageContent } = action.payload;
//       const room = state.rooms.find((r) => r._id === roomId);

//       if (room) {
//         // update last message content if the deleted one was the last
//         if (room.lastMessageContent === lastMessageContent) {
//           // fallback: you may need to fetch previous message from API
//           room.lastMessageContent = "Message deleted";
//         }
//       }
//     },

//     markMessageAsReadInRoom: (
//       state,
//       action: PayloadAction<{ roomId: string; userId: string }>
//     ) => {
//       const { roomId, userId } = action.payload;
//       const room = state.rooms.find((r) => r._id === roomId);

//       if (room?.unreadCounts) {
//         room.unreadCounts[userId] = 0;
//       }
//     },
//   },
// });

// export const {
//   setRooms,
//   setActiveRoom,
//   addMessageToRoom,
//   deleteMessageFromRoom,
//   markMessageAsReadInRoom,
// } = chatRoomsSlice.actions;

// export default chatRoomsSlice.reducer;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IMessage, IChatRoom } from "@/types/IMessage";

interface ChatRoomsState {
  rooms: IChatRoom[];
  activeRoomId?: string;
}

const initialState: ChatRoomsState = {
  rooms: [],
  activeRoomId: undefined,
};

const chatRoomsSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<IChatRoom[]>) => {
      state.rooms = action.payload;
    },

    addRoom: (state, action: PayloadAction<IChatRoom>) => {
      const exists = state.rooms.some((r) => r._id === action.payload._id);
      if (!exists) state.rooms.unshift(action.payload);
    },

    setActiveRoom: (state, action: PayloadAction<string>) => {
      state.activeRoomId = action.payload;

      // reset unread for current user when entering room
      const room = state.rooms.find((r) => r._id === action.payload);
      if (room && room.unreadCounts && action.payload) {
        // Assuming the frontend knows currentUserId
        // This should be handled when dispatching setActiveRoom with currentUserId
      }
    },

    addMessageToRoom: (
      state,
      action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
    ) => {
      const { roomId, message, currentUserId } = action.payload;
      let room = state.rooms.find((r) => r._id === roomId);

      if (room) {
        // Update last message content
        room.lastMessageContent = message.content ||message.mediaUrl;

        // Increment unread count for other participants
        room.participants.forEach((p) => {
          if (p._id !== currentUserId) {
            room!.unreadCounts = room!.unreadCounts || {};
            room!.unreadCounts[p._id] = (room!.unreadCounts[p._id] || 0) + 1;
          }
        });
      } else {
        // Room not found → create dynamically
        room = {
          _id: roomId,
          participants: [message.senderId],
          createdBy: message.senderId._id,
          isGroup: false,
          lastMessageContent: message.content ?? "",
          unreadCounts: { [currentUserId]: 0 }, // new room, unread for current user = 0
          createdAt: new Date(),
          updatedAt: new Date(),
        } as IChatRoom;
        state.rooms.unshift(room);
      }

      // Move updated room to top
      state.rooms = [room, ...state.rooms.filter((r) => r._id !== roomId)];
    },

    deleteMessageFromRoom: (
      state,
      action: PayloadAction<{ roomId: string; messageId: string; lastMessageContent?: string }>
    ) => {
      const { roomId, messageId, lastMessageContent } = action.payload;
      const room = state.rooms.find((r) => r._id === roomId);

      if (room) {
        if (room.lastMessageContent === lastMessageContent) {
          room.lastMessageContent = "Message deleted";
        }
      }
    },

    markMessageAsReadInRoom: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => {
      const { roomId, userId } = action.payload;
      const room = state.rooms.find((r) => r._id === roomId);

      if (room?.unreadCounts) {
        room.unreadCounts[userId] = 0;
      }
    },
  },
});

export const {
  setRooms,
  addRoom,
  setActiveRoom,
  addMessageToRoom,
  deleteMessageFromRoom,
  markMessageAsReadInRoom,
} = chatRoomsSlice.actions;

export default chatRoomsSlice.reducer;
