import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface AddVehicle{
  token: string;
}

export const addVehicle = createAsyncThunk<AddVehicle, AddVehicle>(
  "postDonation",
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
