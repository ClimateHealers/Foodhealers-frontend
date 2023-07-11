import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import API, { attachToken } from "../../Utils/APIUtils";
import jwtDecode from "jwt-decode";

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
      storeAuthData(result?.data);
      attachToken(result?.data?.token, result?.data?.refreshToken);
      return result?.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//Async storage

const storeAuthData = async (value: any) => {
  try {
    const authValue = JSON.stringify(value);

    console.log("checking authValue for asyncstorage", authValue);

    await AsyncStorage.setItem("@authData", authValue);
  } catch (e) {
    console.log("checking error", e);
  }
};

export const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@authData");
    console.log("checking authData for malikshoaib", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeAuthData = async () => {
  try {
    await AsyncStorage.removeItem("@authData");

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
