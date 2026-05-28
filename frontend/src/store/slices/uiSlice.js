import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    language: localStorage.getItem('language') || 'en',
    isMobileMenuOpen: false,
    isSearchOpen: false,
    searchQuery: '',
    compareList: JSON.parse(localStorage.getItem('compareList') || '[]'),
    isLoading: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    toggleMobileMenu: (state) => { state.isMobileMenuOpen = !state.isMobileMenuOpen; },
    closeMobileMenu: (state) => { state.isMobileMenuOpen = false; },
    toggleSearch: (state) => { state.isSearchOpen = !state.isSearchOpen; },
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
    addToCompare: (state, action) => {
      if (state.compareList.length < 3 && !state.compareList.find(p => p._id === action.payload._id)) {
        state.compareList.push(action.payload);
        localStorage.setItem('compareList', JSON.stringify(state.compareList));
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(p => p._id !== action.payload);
      localStorage.setItem('compareList', JSON.stringify(state.compareList));
    },
    clearCompare: (state) => { state.compareList = []; localStorage.removeItem('compareList'); },
    setLoading: (state, action) => { state.isLoading = action.payload; },
  },
});

export const {
  toggleDarkMode, setLanguage, toggleMobileMenu, closeMobileMenu,
  toggleSearch, setSearchQuery, addToCompare, removeFromCompare, clearCompare, setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
