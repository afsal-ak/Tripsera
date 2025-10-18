import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { IMessage, IChatRoom, IChatParticipant } from '@/types/IMessage';
import { getUserRoom } from '@/services/user/messageService';
import { adminGetUserRoom } from '@/services/admin/messageService';
import type { IChatRoomFilter } from '@/types/IChatRoom';
interface ChatRoomsState {
  rooms: IChatRoom[];
  activeRoomId?: string;
  loading: boolean;
  error?: string;
  onlineStatus: Record<string, boolean>;
  onlineUsers: string[];
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
  'chatRooms/fetchRooms',
  async (
    { isAdmin, filters }: { isAdmin?: boolean; filters?: IChatRoomFilter },
    { rejectWithValue }
  ) => {
    try {
      const res = isAdmin ? await adminGetUserRoom(filters) : await getUserRoom(filters);

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

      const room = state.rooms.find((r) => r._id === action.payload.roomId);
      if (room && room.unreadCounts) {
        //     console.log(room, 'from setacive')
        room.unreadCounts[action.payload.currentUserId] = 0;
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
      console.log(message, 'redux');
      if (room) {
        //  update last message info for chat list
        room.lastMessageContent = message.content || message.mediaUrl;
        //room.lastMessageAt = message.createdAt;

        //  if not sender, increase unread count
        if (message.senderId._id !== currentUserId) {
          if (!room.unreadCounts) {
            room.unreadCounts = { [currentUserId]: 1 };
            console.log(room.unreadCounts, 'if');
          } else {
            room.unreadCounts[currentUserId] = (room.unreadCounts[currentUserId] || 0) + 1;
          }
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
} = chatRoomsSlice.actions;

export default chatRoomsSlice.reducer;
