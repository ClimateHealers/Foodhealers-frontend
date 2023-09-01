import { createSlice } from "@reduxjs/toolkit";
import {  VeganRecipesCategory } from "../actions/veganRecipesCategory";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const veganRecipesCategoryList = createSlice({
  name: "allEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(VeganRecipesCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VeganRecipesCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(VeganRecipesCategory.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default veganRecipesCategoryList.reducer;
