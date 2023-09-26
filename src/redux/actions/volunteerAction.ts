import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";
import { Float } from "react-native/Libraries/Types/CodegenTypes";


export interface fetchVolunteerAtEvent{
  token:string;
}

export interface AddVolunteerEvent{
  eventId: number,
  volunteerName: string,
  availableToDate: Date,
  availableFromDate: Date,
  volunteerPhoneNumber: number,
  volunteerFullAddress: string,
  lat: Float,
  lng: Float,
  city: string,
  state: string,
  postalCode: number,
}

export const volunteerAtEvent = createAsyncThunk<AddVolunteerEvent, AddVolunteerEvent>(
  "volunteerAtEvent",
  async (AddVolunteerEvent: AddVolunteerEvent, { rejectWithValue, getState }: any) => {
    try {
        const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post("v1/api/apply-event-volunteer/", AddVolunteerEvent, config);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const fetchVolunteerAtEvent = createAsyncThunk<fetchVolunteerAtEvent, fetchVolunteerAtEvent>(
  "fetchVolunteerAtEvent",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
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