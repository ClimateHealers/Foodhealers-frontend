import { AnyAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";



export const VeganRecipesCategories = createAsyncThunk<AnyAction>(
  "veganRecipes",
  async (_,thunkAPI: any) => {
    try {
      const result = await API.get("v1/api/categories/");
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
