import { createSlice } from "@reduxjs/toolkit";
import { login, getExpoPushToken } from "../actions/authAction";

const initialState = {
  data: {
    token: null,
  },
  error: null,
  loading: false,
  expoPushToken: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
    // setAuthToken: (state, action) => {
    //   state.data.token = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action?.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getExpoPushToken.fulfilled, (state, action) => {
        state.expoPushToken = action?.payload;
      });
  },
});
export const { logOut } = authSlice.actions;

export default authSlice.reducer;
