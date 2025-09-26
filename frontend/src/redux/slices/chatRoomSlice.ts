
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

//     addRoom: (state, action: PayloadAction<IChatRoom>) => {
//       const exists = state.rooms.some((r) => r._id === action.payload._id);
//       if (!exists) state.rooms.unshift(action.payload);
//     },

//     setActiveRoom: (state, action: PayloadAction<string>) => {
//       state.activeRoomId = action.payload;

//       // reset unread for current user when entering room
//       const room = state.rooms.find((r) => r._id === action.payload);
//       if (room && room.unreadCounts && action.payload) {
//         // Assuming the frontend knows currentUserId
//         // This should be handled when dispatching setActiveRoom with currentUserId
//       }
//     },

//     addMessageToRoom: (
//       state,
//       action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
//     ) => {
//       const { roomId, message, currentUserId } = action.payload;
//       let room = state.rooms.find((r) => r._id === roomId);

//       if (room) {
//         // Update last message content
//         room.lastMessageContent = message.content ||message.mediaUrl;

//         // Increment unread count for other participants
//         room.participants.forEach((p) => {
//           if (p._id !== currentUserId) {
//             room!.unreadCounts = room!.unreadCounts || {};
//             room!.unreadCounts[p._id] = (room!.unreadCounts[p._id] || 0) + 1;
//           }
//         });
//       } else {
//         // Room not found → create dynamically
//         room = {
//           _id: roomId,
//           participants: [message.senderId],
//           createdBy: message.senderId._id,
//           isGroup: false,
//           lastMessageContent: message.content ?? "",
//           unreadCounts: { [currentUserId]: 0 }, // new room, unread for current user = 0
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         } as IChatRoom;
//         state.rooms.unshift(room);
//       }

//       // Move updated room to top
//       state.rooms = [room, ...state.rooms.filter((r) => r._id !== roomId)];
//     },

//     deleteMessageFromRoom: (
//       state,
//       action: PayloadAction<{ roomId: string; messageId: string; lastMessageContent?: string }>
//     ) => {
//       const { roomId, messageId, lastMessageContent } = action.payload;
//       const room = state.rooms.find((r) => r._id === roomId);

//       if (room) {
//         if (room.lastMessageContent === lastMessageContent) {
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
//   addRoom,
//   setActiveRoom,
//   addMessageToRoom,
//   deleteMessageFromRoom,
//   markMessageAsReadInRoom,
// } = chatRoomsSlice.actions;

// export default chatRoomsSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { IMessage, IChatRoom } from "@/types/IMessage";
import { getUserRoom } from "@/services/user/messageService";
import { adminGetUserRoom } from "@/services/admin/messageService";
interface ChatRoomsState {
  rooms: IChatRoom[];
  activeRoomId?: string;
  loading: boolean;
  error?: string;
  onlineStatus: Record<string, boolean>;
  onlineUsers:string[],

}

const initialState: ChatRoomsState = {
  rooms: [],
  activeRoomId: undefined,
  loading: false,
  error: undefined,
  onlineStatus: {},
  onlineUsers: [] as string[],

};


export const fetchUserRooms = createAsyncThunk(
  "chatRooms/fetchRooms",
  async ({ isAdmin }: { isAdmin?: boolean }, { rejectWithValue }) => {
    try {
      const res = isAdmin ? await adminGetUserRoom() : await getUserRoom();
      return res.data as IChatRoom[];
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch rooms");
    }
  }
);


const chatRoomsSlice = createSlice({
  name: "chatRooms",
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IChatRoom>) => {
      const exists = state.rooms.some((r) => r._id === action.payload._id);
      if (!exists) state.rooms.unshift(action.payload);
    },

    setActiveRoom: (state, action: PayloadAction<{ roomId: string; currentUserId: string }>) => {
      state.activeRoomId = action.payload.roomId;

      const room = state.rooms.find((r) => r._id === action.payload.roomId);
      if (room && room.unreadCounts) {
        room.unreadCounts[action.payload.currentUserId] = 0;
        room.totalUnread = 0;
      }
    },

    addMessageToRoom: (
      state,
      action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
    ) => {
      const { roomId, message, currentUserId } = action.payload;
      let room = state.rooms.find((r) => r._id === roomId);

      if (room) {
        room.lastMessageContent = message.content || message.mediaUrl;

        room.participants.forEach((p) => {
          if (p._id !== currentUserId) {
            room!.unreadCounts = room!.unreadCounts || {};
            room!.unreadCounts[p._id] = (room!.unreadCounts[p._id] || 0) + 1;
          }
        });
room.totalUnread = room!.unreadCounts![currentUserId] || 0;

room.totalUnread = Object.values(room.unreadCounts || {}).reduce(
  (sum, v) => sum + v,
  0
);
      } else {
        // create room dynamically
        room = {
          _id: roomId,
          participants: [message.senderId],
          createdBy: message.senderId._id,
          isGroup: false,
          lastMessageContent: message.content ?? "",
          unreadCounts: { [currentUserId]: 0 },
          totalUnread: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as IChatRoom;
        state.rooms.unshift(room);
      }

      // move updated room to top
      state.rooms = [room, ...state.rooms.filter((r) => r._id !== roomId)];
    },

    deleteMessageFromRoom: (
      state,
      action: PayloadAction<{ roomId: string; messageId: string; lastMessageContent?: string }>
    ) => {
      const { roomId, lastMessageContent } = action.payload;
      console.log(lastMessageContent, 'redux')
      const room = state.rooms.find((r) => r._id === roomId);
      if (room) {
        room.lastMessageContent = "Message deleted";

      }
    },
  // updateUserOnlineStatus: (
  //     state,
  //     action: PayloadAction<{ userId: string; online: boolean }>
  //   ) => {
  //     state.onlineStatus[action.payload.userId] = action.payload.online;
  //   },
setUserOnline: (state, action: PayloadAction<string>) => {
  if (!state.onlineUsers.includes(action.payload)) {
    state.onlineUsers.push(action.payload);
  }
},
setUserOffline: (state, action: PayloadAction<string>) => {
  state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
},
setCurrentOnlineUsers: (state, action: PayloadAction<string[]>) => {
  state.onlineUsers = action.payload;
},

    markMessageAsReadInRoom: (
      state,
      action: PayloadAction<{ roomId: string; userId: string }>
    ) => {
      const { roomId, userId } = action.payload;
      const room = state.rooms.find((r) => r._id === roomId);
      if (room?.unreadCounts) {
        console.log(room.unreadCounts, 'unreadcount')
        room.unreadCounts[userId] = 0;
        room.totalUnread = 0;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRooms.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchUserRooms.fulfilled, (state, action: PayloadAction<IChatRoom[]>) => {
        state.loading = false;
        state.rooms = action.payload.map((room) => {
          const totalUnread = Object.values(room.unreadCounts || {}).reduce(
            (sum, v) => sum + v,
            0
          );
          return { ...room, totalUnread };
        });
      })
      .addCase(fetchUserRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addRoom,
  setActiveRoom,
  addMessageToRoom,
  deleteMessageFromRoom,
  markMessageAsReadInRoom,
 // updateUserOnlineStatus
 setCurrentOnlineUsers,
 setUserOffline,
 setUserOnline
} = chatRoomsSlice.actions;

export default chatRoomsSlice.reducer;
