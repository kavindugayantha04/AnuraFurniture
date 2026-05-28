import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/notifications');
    return data.notifications;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const markAsRead = createAsyncThunk('notifications/markRead', async (id, { rejectWithValue }) => {
  try {
    await api.put(`/notifications/${id}/read`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const markAllRead = createAsyncThunk('notifications/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await api.put('/notifications/read-all');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const item = state.items.find(n => n._id === action.payload);
        if (item && !item.isRead) { item.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1); }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
