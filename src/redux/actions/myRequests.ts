import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";




export interface MyRequests {
  itemTypeId: number,
  token: string;
}

export interface PostRequest{
  itemTypeId: Number;
  token: string;
}

export const myRequests = createAsyncThunk<MyRequests, MyRequests>(
  "myRequests",
  async (itemTypeId: MyRequests, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get(`v1/api/request-food/${itemTypeId?.itemTypeId}/`, config);
      return result?.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const postRequest = createAsyncThunk<PostRequest, PostRequest>(
  "postRequest",
  async (postRequest: PostRequest,  { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post(`v1/api/request-food/${postRequest?.itemTypeId}/`, postRequest,config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
