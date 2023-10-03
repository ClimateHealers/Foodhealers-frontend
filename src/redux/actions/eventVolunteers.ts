import { AnyAction, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface eventVolunteers {
  eventId: Number;
}

export const GetEventVolunteers = createAsyncThunk<
eventVolunteers,
eventVolunteers
>("eventVolunteers", async (event_id: eventVolunteers, thunkAPI: any) => {
  try {
    const token = thunkAPI.getState().auth.data.token;
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
    const result = await API.get(`v1/api/event-volunteer-details/${event_id}/`, config);
    return result?.data;
    
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message);
  }
});
