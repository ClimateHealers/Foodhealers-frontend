import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface AddVehicle{
  token: string;
}

export interface FetchVehicle{
  token: string;
}

export const addVehicle = createAsyncThunk<AddVehicle, AddVehicle>(
  "addVehicle",
  async (AddVehicle: AddVehicle, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post("v1/api/volunteer-vehicle/", AddVehicle, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const fetchVehicle = createAsyncThunk<FetchVehicle, FetchVehicle>(
  "fetchVehicle",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/volunteer-vehicle/", config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);
