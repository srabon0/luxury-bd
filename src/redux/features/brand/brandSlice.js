import { createSlice } from "@reduxjs/toolkit";
const brandSlice = createSlice({
  name: "brand",
  initialState: {
    brands: [],
    loading: false,
    error: "",
  },
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
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

export const { setBrands, setLoading, setError } = brandSlice.actions;

export default brandSlice.reducer;

export const useBrands = (state) => state.brand.brands;
