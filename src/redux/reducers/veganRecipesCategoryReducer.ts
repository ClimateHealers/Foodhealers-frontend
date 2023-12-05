import { createSlice } from "@reduxjs/toolkit";
import {  VeganAllRecipes, VeganRecipesCategory } from "../actions/veganRecipesCategory";

const initialState = {
  data: {},
  error: null,
  loading: false,
  veganAllRecipeData: {}
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
      })
      .addCase(VeganAllRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VeganAllRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.veganAllRecipeData = action.payload;
        state.error = null;
      })
      .addCase(VeganAllRecipes.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default veganRecipesCategoryList.reducer;
