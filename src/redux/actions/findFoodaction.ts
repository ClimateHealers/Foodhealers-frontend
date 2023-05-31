import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

export interface FindFood {
    lat:number,
    lng:number,
    alt:number,
    eventStartDate:string,
    eventEndDate:string,

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
        const result = await API.post("v1/api/find-food/", findFood, config);
        console.log("Checking result for login", result.data);
        return result.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );