import { createSlice } from "@reduxjs/toolkit";
import { notfifications } from "../actions/notificationAction";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const notificationSlice = createSlice({
  name: "notificationsAction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(notfifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(notfifications.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(notfifications.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default notificationSlice.reducer;
