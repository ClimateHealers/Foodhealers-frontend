import { AnyAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface veganRecipesCat {
  categoryId: Number;
}

export interface veganAllRecipes {
  token: string;
  search_keyword: string;
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

export const VeganAllRecipes = createAsyncThunk<
  veganAllRecipes,
  veganAllRecipes
>("veganAllRecipes", async (searchData: veganAllRecipes, thunkAPI: any) => {
  try {
    const token = thunkAPI.getState().auth.data.token;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      params: {
        search_keyword: searchData,
      },
    };
    const result = await API.get(`v1/api/search-recipe/`, config);
    return result?.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
});
