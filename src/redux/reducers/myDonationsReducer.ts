import { createSlice } from "@reduxjs/toolkit";
import { myDonations } from "../actions/myDonations";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "myDonations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myDonations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myDonations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(myDonations.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
