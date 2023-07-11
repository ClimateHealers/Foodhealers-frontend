import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";




export interface AllEvents {
  token: string;
}

export const allEvents = createAsyncThunk<AllEvents, AllEvents>(
  "allEvents",
  async (_, thnukAPI: any) => {
    try {
        const token = thnukAPI.getState().auth.data.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/all-events/", config);
      return result?.data;
    } catch (error: any) {
      return thnukAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
