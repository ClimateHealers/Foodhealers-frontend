import { createSlice } from "@reduxjs/toolkit";
import { findFood } from "../actions/findFoodaction";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const foodSlice = createSlice({
  name: "findFood",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findFood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findFood.fulfilled, (state, action) => {
        console.log("checking payload", action.payload);
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(findFood.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default foodSlice.reducer;
