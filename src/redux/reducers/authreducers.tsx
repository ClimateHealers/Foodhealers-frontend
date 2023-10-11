import { createSlice } from "@reduxjs/toolkit";
import { login } from "../actions/authAction";
import { updateProfile } from "../actions/authAction";

const initialState = {
  data: {
    token :null
  },
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      return initialState;
    },
    setAuthToken: (state, action) => {
      state.data.token = action.payload;
    }
  },
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
      }).addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});
export const { logOut, setAuthToken } = authSlice.actions;

export default authSlice.reducer;
