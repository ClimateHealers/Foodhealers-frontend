import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface AcceptDonation{
  token: string;
}

export const acceptDonation = createAsyncThunk<AcceptDonation, AcceptDonation>(
  "acceptDonation",
  async (userData: AcceptDonation, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.put("v1/api/accept-food-donation/", userData, config);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
