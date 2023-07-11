import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";




export interface MyEvent {
  token: string;
}

export const myEvents = createAsyncThunk<MyEvent, MyEvent>(
  "myEvents",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI.getState().auth.data.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/event/", config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
