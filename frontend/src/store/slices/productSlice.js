import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const { data } = await api.get(`/products?${query}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/categories');
    return data.categories;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    categories: [],
    total: 0,
    pages: 0,
    page: 1,
    loading: false,
    productLoading: false,
    error: null,
    filters: {},
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = {}; },
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.pending, (state) => { state.productLoading = true; state.error = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.productLoading = false; state.product = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.productLoading = false; state.error = action.payload; })
      .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; });
  },
});

export const { setFilters, clearFilters, clearProduct } = productSlice.actions;
export default productSlice.reducer;
