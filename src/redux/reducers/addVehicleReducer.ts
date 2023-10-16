import { createSlice } from "@reduxjs/toolkit";
import { fetchVehicle } from "../actions/addVehicle";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const fetchVehicleReducer = createSlice({
  name: "fetchVehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchVehicle.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default fetchVehicleReducer.reducer;
