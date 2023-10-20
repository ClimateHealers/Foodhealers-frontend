import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";


export interface AcceptPickupAction {
  token: string;
}

export interface FetchPickupRequest {
  token: string;
  requestTypeId: number;
}

export interface UpdatePickupRequest {
  token: string;
  requestTypeId: number;
}

export const acceptPickup = createAsyncThunk<AcceptPickupAction, AcceptPickupAction>(
  "acceptPickup",
  async (acceptPickup: AcceptPickupAction, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post("v1/api/accept-pickup-request/", acceptPickup, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const fetchPickup = createAsyncThunk<FetchPickupRequest, FetchPickupRequest>(
  "fetchPickup",
  async (fetchPickupRequest: FetchPickupRequest, thunkAPI: any) => {
    try {
        const token = thunkAPI?.getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.get(`v1/api/accept-pickup-request/?requestTypeId=${fetchPickupRequest?.requestTypeId}`, config);
      return result?.data;
    } catch (error: any) {
      console.log("error", error);
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const updatePickupRequest = createAsyncThunk<UpdatePickupRequest, UpdatePickupRequest>(
  "updatePickupRequest",
  async (updatePickupRequest: UpdatePickupRequest, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.put("v1/api/accept-pickup-request/", updatePickupRequest, config);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
