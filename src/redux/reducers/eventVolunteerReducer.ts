import { createSlice } from "@reduxjs/toolkit";
import { GetEventVolunteers } from "../actions/eventVolunteers";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const getEventVolunteerList = createSlice({
  name: "getVolunteers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetEventVolunteers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetEventVolunteers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(GetEventVolunteers.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default getEventVolunteerList.reducer;
