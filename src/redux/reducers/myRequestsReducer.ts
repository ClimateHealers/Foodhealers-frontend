import { createSlice } from "@reduxjs/toolkit";
import { myRequests } from "../actions/myRequests";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const eventSlice = createSlice({
  name: "myRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(myRequests.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default eventSlice.reducer;
