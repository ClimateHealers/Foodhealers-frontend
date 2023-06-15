import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface PostEvent {
  eventName: string;
  lat: number;
  lng: number;
  fullAddress: string;
  postalCode: number;
  state: string;
  city: string;
  eventStartDate: number;
  additionalInfo: string;
  files: [];
}

export const postEvent = createAsyncThunk<PostEvent, PostEvent>(
  "PostEvent",
  async (PostEvent: PostEvent, { rejectWithValue, getState }: any) => {
    try {
      const token = getState().auth.data.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token} `,
        },
      };
      const result = await API.post("v1/api/event/", PostEvent, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
