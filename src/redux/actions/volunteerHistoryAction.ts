import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface volunteerHistory {
  token: string;
}


export const volunteerHistory = createAsyncThunk<volunteerHistory, volunteerHistory>(
  "volunteerHistory",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI.getState().auth.data.token;
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/volunteer-history/", config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
