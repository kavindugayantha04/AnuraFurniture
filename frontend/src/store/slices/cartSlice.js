import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async (itemData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/add', itemData);
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/item/${itemId}`, { quantity });
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/item/${itemId}`);
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const applyCoupon = createAsyncThunk('cart/coupon', async (code, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/coupon', { code });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
    couponDiscount: 0,
    appliedCoupon: null,
    isOpen: false,
  },
  reducers: {
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    clearCoupon: (state) => { state.appliedCoupon = null; state.couponDiscount = 0; },
  },
  extraReducers: (builder) => {
    const setLoading = (state) => { state.loading = true; state.error = null; };
    const setCart = (state, action) => { state.loading = false; state.cart = action.payload; };
    const setError = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, setError)
      .addCase(addToCart.pending, setLoading)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, setError)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, (state) => { state.cart = null; state.appliedCoupon = null; state.couponDiscount = 0; })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.appliedCoupon = action.payload.coupon;
        state.couponDiscount = action.payload.coupon.discount;
      })
      .addCase(applyCoupon.rejected, setError);
  },
});

export const { toggleCart, openCart, closeCart, clearCoupon } = cartSlice.actions;
export default cartSlice.reducer;
