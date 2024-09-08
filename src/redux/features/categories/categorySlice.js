import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: "",
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCategories, setLoading, setError } = categorySlice.actions;

export default categorySlice.reducer;

export const useCategories = (state) => state.categories.categories;
