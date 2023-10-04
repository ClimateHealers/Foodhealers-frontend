import { createSlice } from "@reduxjs/toolkit";
import { volunteerHistory } from "../actions/volunteerHistoryAction";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const volunteerHistorySlice = createSlice({
  name: "volunteerHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(volunteerHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(volunteerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(volunteerHistory.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default volunteerHistorySlice.reducer;
