import { AnyAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface veganRecipesCat {
  categoryId: Number;
}

export const VeganRecipesCategory = createAsyncThunk<
  veganRecipesCat,
  veganRecipesCat
>("veganRecipeCat", async (category_id: veganRecipesCat, thunkAPI: any) => {
  try {
    const token = thunkAPI.getState().auth.data.token;
    const result = await API.get(`v1/api/recipe/${category_id}/`);
    return result?.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
});
