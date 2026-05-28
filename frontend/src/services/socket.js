import { io } from 'socket.io-client';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';

let socket = null;

export const initSocket = () => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || '', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
    const state = store.getState();
    if (state.auth.user?._id) {
      socket.emit('join_user', state.auth.user._id);
      if (state.auth.user.role === 'admin') {
        socket.emit('join_admin');
      }
    }
  });

  socket.on('order_update', (data) => {
    store.dispatch(addNotification({
      _id: Date.now().toString(),
      title: `Order ${data.status}`,
      message: `Your order ${data.orderNumber} has been ${data.status}.`,
      type: 'order',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
  });

  socket.on('chat_reply', (data) => {
    store.dispatch(addNotification({
      _id: Date.now().toString(),
      title: 'Support Reply',
      message: data.message,
      type: 'chat',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });

  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => { socket?.disconnect(); socket = null; };
