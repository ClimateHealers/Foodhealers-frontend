import { createSlice } from "@reduxjs/toolkit";
import { myEvents } from "../actions/myEvents";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "myEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(myEvents.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
