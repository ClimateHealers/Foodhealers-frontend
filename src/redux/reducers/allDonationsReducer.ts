import { createSlice } from "@reduxjs/toolkit";
import { allDonations } from "../actions/allDonations";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "allDonations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(allDonations.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
