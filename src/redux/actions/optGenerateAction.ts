import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";




export interface OtpGenerate {
  token: string;
}


export const otpGenerate = createAsyncThunk<OtpGenerate, OtpGenerate>(
  "otpGenerate",
  async (otpGenerate: OtpGenerate, { rejectWithValue, getState }: any) => {
    try {
      const token = getState()?.auth?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      const result = await API.post("v1/api/generate-otp/", otpGenerate, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);
