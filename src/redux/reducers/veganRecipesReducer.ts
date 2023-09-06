import { createSlice } from "@reduxjs/toolkit";
import {  VeganRecipesCategories} from "../actions/veganRecipes";

const initialState = {
  data: {},
  error: null,
  loading: false,
};

const veganRecipes = createSlice({
  name: "allEvents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(VeganRecipesCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(VeganRecipesCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(VeganRecipesCategories.rejected, (state) => {
        state.loading = false;
        state.error = null;
      });
  },
});

export default veganRecipes.reducer;
