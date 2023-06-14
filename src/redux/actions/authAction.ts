import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";

interface SignupData {
  tokenId: string;
  name: string;
  email: string;
  isVolunteer: boolean;
}

interface LoginData {
  tokenId: string;
}

export const registerUser = createAsyncThunk<SignupData, SignupData>(
  "auth/register",
  async (userData: SignupData, { rejectWithValue }: any) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await API.post("v1/api/signup/", userData, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk<LoginData, LoginData>(
  "auth/login",
  async (userData: LoginData, { rejectWithValue }: any) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await API.post("v1/api/login/", userData, config);
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
