import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface AcceptRequest{
  token: string;
}

export const acceptRequest = createAsyncThunk<AcceptRequest, AcceptRequest>(
  "acceptRequest",
  async (userData: AcceptRequest, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.put("v1/api/accept-food-request/", userData, config);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
