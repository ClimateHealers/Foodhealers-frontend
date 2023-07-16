import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface FindFood {
  lat: number;
  lng: number;
  alt: number;
  eventStartDate: string;
  eventEndDate: string;
  city: string;
  fullAddress: string;
  postalCode: number;
  state: string;
}

export const findFood = createAsyncThunk<FindFood, FindFood>(
  "findFood",
  async (findFood: FindFood, { rejectWithValue }: any) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await API.get(
        `v1/api/find-food/?alt=${findFood.alt}&&city=${findFood?.city}&&lat=${findFood?.lat}&&lng=${findFood?.lng}&&eventStartDate=${findFood?.eventStartDate}&&fullAddress=${findFood.fullAddress}&&postalCode=${findFood.postalCode}&&eventEndDate=${findFood.eventEndDate}&&state=${findFood.state}`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
