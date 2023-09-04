import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface calendarEvent {
  startDate: string;
  endDate: string;
}

export const calendarEvent = createAsyncThunk<calendarEvent, calendarEvent>(
  "calendarEvent",
  async (date: calendarEvent, { rejectWithValue }: any) => {
    try {
      const result = await API.get(
        `v2/api/calender-events/?startDate=${date.startDate}&&endDate=${date.endDate}`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
