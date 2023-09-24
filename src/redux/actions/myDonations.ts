import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";




export interface MyDonations {
  token: string;
}

export interface AllDonations {
  token: string;
}

export interface PostDonation{
  itemTypeId: number,
  pickupDate: Date,
  foodItem: string,
  quantity: string,
  phoneNumber: number,
  flatNo: number,
  address: string,
  city: string,
  state: string,
  postalCode: number,
  zipCode: number,
}

export const myDonations = createAsyncThunk<MyDonations, MyDonations>(
  "myDonations",
  async (_, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get("v1/api/donate-food/", config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const postDonation = createAsyncThunk<PostDonation, PostDonation>(
  "postDonation",
  async (PostDonation: PostDonation, { rejectWithValue, getState }: any) => {
    try {
      const token = getState().auth.data.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post("v1/api/donate-food/", PostDonation, config);
      console.log("resultresult: " + JSON.stringify(result));
      return result.data;
    } catch (error: any) {
      return rejectWithValue(JSON.stringify(error?.response));
      // return rejectWithValue(error?.response?.data?.message);
    }
  }
);
