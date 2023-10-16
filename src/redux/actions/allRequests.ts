import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface AllRequests {
  token: string;
  itemTypeId: number;
}


export const allRequests = createAsyncThunk<AllRequests, AllRequests>(
  "allRequests",
  async (itemTypeId: AllRequests, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get(`v1/api/all-requests/${itemTypeId?.itemTypeId}/`, config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
