import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/authAction";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
