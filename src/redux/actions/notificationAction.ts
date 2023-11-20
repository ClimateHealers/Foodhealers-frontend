import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface GetNotifications {
  token: string;
}

export interface PutNotifications {
  token: string;
}


export const notfifications= createAsyncThunk<GetNotifications, GetNotifications>(
  "notfifications",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI.getState().auth.data.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/volunteer-notifications/", config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const putNotifications = createAsyncThunk<PutNotifications, PutNotifications>(
  "putNotifications",
  async (userData: PutNotifications, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.put("v1/api/volunteer-notifications/", userData, config);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);