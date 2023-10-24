import { createSlice } from "@reduxjs/toolkit";
import { allRequests } from "../actions/allRequests";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "allRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(allRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(allRequests.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
