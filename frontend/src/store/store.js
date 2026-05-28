import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    orders: orderReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: { ignoredActions: ['auth/setUser'] } }),
});

export default store;
