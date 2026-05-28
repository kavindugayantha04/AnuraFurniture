import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users/wishlist');
    return data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/users/wishlist/toggle', { productId });
    return data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    ids: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.ids = action.payload.map(p => p._id);
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.ids = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
