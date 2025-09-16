import { createSlice } from "@reduxjs/toolkit";
import { nearbyEvents } from "../actions/nearbyEvents";

const nearbyEventsSlice = createSlice({
  name: "nearbyEvents",
  initialState: {
    events: [] as any[],
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(nearbyEvents.pending, (state) => {
        state.error = null;
      })
      .addCase(nearbyEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      })
      .addCase(nearbyEvents.rejected, (state, action) => {
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default nearbyEventsSlice.reducer;
