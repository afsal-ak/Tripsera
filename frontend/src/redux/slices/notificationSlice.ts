import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { INotification, INotificationFilter } from '@/types/INotifications';

import {
  fetchAdminNotification,
  adminMarkNotificationAsRead,
} from '@/services/admin/notificationsService';

import {
  fetchUserNotification,
  userMarkNotificationAsRead,
} from '@/services/user/notificationsService';

interface NotificationState {
  items: INotification[];
  unreadCount: number;
  totalPages: number;
  loading: boolean;
  error?: string;
}

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  totalPages: 1,
  loading: false,
};

// --- Fetch Notifications (Admin or User) ---
export const fetchNotifications = createAsyncThunk<
  { data: INotification[]; pagination: { totalPages: number } },
  { isAdmin?: boolean; filters?: INotificationFilter }
>('notifications/fetch', async ({ isAdmin, filters }, { rejectWithValue }) => {
  try {
    const res = isAdmin
      ? await fetchAdminNotification(filters)
      : await fetchUserNotification(filters);

    return res;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to fetch notifications');
  }
});

// --- Mark Single Notification as Read ---
export const markAsReadThunk = createAsyncThunk<
  string, // return notificationId
  { id: string; isAdmin?: boolean }
>('notifications/markAsRead', async ({ id, isAdmin }, { rejectWithValue }) => {
  try {
    if (isAdmin) {
      await adminMarkNotificationAsRead(id);
    } else {
      await userMarkNotificationAsRead(id);
    }
    return id;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to mark notification as read');
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAllAsRead: (state) => {
      state.items = state.items.map((n) => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
      state.totalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.totalPages = action.payload.pagination.totalPages;
        state.unreadCount = action.payload.data.filter((n) => !n.isRead).length;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Mark notification as read
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const notification = state.items.find((n) => n._id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { addNotification, markAllAsRead, clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
