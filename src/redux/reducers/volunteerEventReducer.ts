import { createSlice } from "@reduxjs/toolkit";
import { fetchVolunteerAtEvent } from "../actions/volunteerAction";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "fetchVolunteerAtEvent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVolunteerAtEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVolunteerAtEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchVolunteerAtEvent.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
