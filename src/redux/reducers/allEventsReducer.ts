import { createSlice } from "@reduxjs/toolkit";
import { allEvents } from "../actions/allEvents";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const allEventSlice = createSlice({
  name: "allEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(allEvents.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default allEventSlice.reducer;
