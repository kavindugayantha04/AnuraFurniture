import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/orders/my-orders?${query}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    total: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderSuccess: (state) => { state.success = false; state.error = null; },
    clearOrder: (state) => { state.order = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; state.success = true; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders; state.total = action.payload.total; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrderSuccess, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
