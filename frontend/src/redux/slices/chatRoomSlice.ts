import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IMessage, IChatRoom, IChatParticipant } from '@/types/IMessage';
import { getUserRoom } from '@/services/user/messageService';
import { adminGetUserRoom } from '@/services/admin/messageService';
import { companyGetUserRoom } from '@/services/company/messageService';
import type { IChatRoomFilter } from '@/types/IChatRoom';
import { EnumUserRole } from '@/Constants/enums/userEnum';
interface ChatRoomsState {
  rooms: IChatRoom[];
  activeRoomId?: string;
  loading: boolean;
  error?: string;
  onlineStatus: Record<string, boolean>;
  onlineUsers: string[];
  totalUnread: number;

}

const initialState: ChatRoomsState = {
  rooms: [],
  activeRoomId: undefined,
  loading: false,
  error: undefined,
  onlineStatus: {},
  onlineUsers: [] as string[],
  totalUnread: 0
};

// export const fetchUserRooms = createAsyncThunk(
//   'chatRooms/fetchRooms',
//   async (
//     { isAdmin, filters }: { isAdmin?: boolean; filters?: IChatRoomFilter },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = isAdmin ? await adminGetUserRoom(filters) : await getUserRoom(filters);
//       console.log(res, 'caht room');

//       return res.data as IChatRoom[];
//     } catch (err: any) {
//       return rejectWithValue(err.message || 'Failed to fetch rooms');
//     }
//   }
// );
export const fetchUserRooms = createAsyncThunk(
  'chatRooms/fetchRooms',
  async (
    { role, filters }: { role: 'user' | 'admin' | 'company'; filters?: IChatRoomFilter },
    { rejectWithValue }
  ) => {
    try {
      let res;

      if (role === EnumUserRole.ADMIN) {
        res = await adminGetUserRoom(filters);
      } else if (role === EnumUserRole.COMPANY) {
        res = await companyGetUserRoom(filters); //  NEW
      } else if (role===EnumUserRole.USER){
        res = await getUserRoom(filters);
      }

      return res.data as IChatRoom[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch rooms');
    }
  }
);
const chatRoomsSlice = createSlice({
  name: 'chatRooms',
  initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IChatRoom>) => {
      const exists = state.rooms.some((r) => r._id === action.payload._id);
      if (!exists) state.rooms.unshift(action.payload);
    },

   
setActiveRoom: (state, action: PayloadAction<{ roomId: string; currentUserId: string }>) => {
  state.activeRoomId = action.payload.roomId;
  const { roomId, currentUserId } = action.payload;

  const room = state.rooms.find((r) => r._id === roomId);
  if (room && room.unreadCounts) {
    const unreadCount = room.unreadCounts[currentUserId] || 0;

    // 🟢 Subtract from total unread
    state.totalUnread = Math.max(state.totalUnread - unreadCount, 0);

    // 🟢 Clear unread for this user in this room
    room.unreadCounts[currentUserId] = 0;
  }
},

    addMessageToRoom: (
      state,
      action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
    ) => {
      const { roomId, message, currentUserId } = action.payload;

      const sender: IChatParticipant = {
        _id: message.senderId._id,
        username: message.senderId.username || 'Unknown',
        profileImage: message.senderId.profileImage?.url,
      };

      const roomIndex = state.rooms.findIndex((r) => r._id === roomId);

      if (roomIndex !== -1) {
        // Room exists
        const room = state.rooms[roomIndex];
        room.lastMessageContent = message.content || message.mediaUrl;
        room.updatedAt = new Date();

        // Remove old position & move to top
        state.rooms.splice(roomIndex, 1);
        state.rooms.unshift(room);
      } else {
        // Room does not exist → create new
        const newRoom: IChatRoom = {
          _id: roomId,
          participants: [sender],
          createdBy: sender._id,
          isGroup: false,
          lastMessageContent: message.content ?? '',
          unreadCounts: { [currentUserId]: 0 },
          totalUnread: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.rooms.unshift(newRoom);
      }
    },

updateRoomOnNewMessage: (
  state,
  action: PayloadAction<{ roomId: string; message: IMessage; currentUserId: string }>
) => {
  const { roomId, message, currentUserId } = action.payload;
  const room = state.rooms.find((r) => r._id === roomId);

  if (room) {
    room.lastMessageContent = message.content || message.mediaUrl;
    room.updatedAt = new Date();

    //   If not sender, increase unread
    if (message.senderId._id !== currentUserId) {
      if (!room.unreadCounts) room.unreadCounts = {};
      const prev = room.unreadCounts[currentUserId] || 0;
      room.unreadCounts[currentUserId] = prev + 1;

      //   Also increase totalUnread
      state.totalUnread += 1;
    }
  }
},

    deleteMessageFromRoom: (
      state,
      action: PayloadAction<{ roomId: string; messageId: string; lastMessageContent?: string }>
    ) => {
      const { roomId } = action.payload;
      //console.log(lastMessageContent, 'redux')
      const room = state.rooms.find((r) => r._id === roomId);
      if (room) {
        room.lastMessageContent = 'Message deleted';
      }
    },
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

    markMessageAsReadInRoom: (state, action: PayloadAction<{ roomId: string; userId: string }>) => {
      const { roomId, userId } = action.payload;
      const room = state.rooms.find((r) => r._id === roomId);
    },
    setTotalUnread: (state, action: PayloadAction<number>) => {
      state.totalUnread = action.payload;
    },

    incrementTotalUnread: (state) => {
      state.totalUnread += 1;
    },

    decrementTotalUnread: (state) => {
      if (state.totalUnread > 0) state.totalUnread -= 1;
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
          const totalUnread = Object.values(room.unreadCounts || {}).reduce((sum, v) => sum + v, 0);
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
  updateRoomOnNewMessage,
  setCurrentOnlineUsers,
  setUserOffline,
  setUserOnline,
   setTotalUnread,           
  incrementTotalUnread,    
  decrementTotalUnread, 
} = chatRoomsSlice.actions;

export default chatRoomsSlice.reducer;
