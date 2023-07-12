import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../Utils/APIUtils";
import { setAuthToken } from "../reducers/authreducers";

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

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    console.log("chekcing refresh token: ", refreshToken);

    const response = await API.post("v1/api/refresh-token/", {
      refreshTokenId: refreshToken,
    });
    console.log("checking response form refresh api", response.data);

    const { token } = response.data;

    console.log("checking new token: ", token);

    await AsyncStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

export const login = createAsyncThunk<LoginData, LoginData>(
  "auth/login",
  async (userData: LoginData, { rejectWithValue, dispatch }: any) => {
    try {
  

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const result = await API.post("v1/api/login/", userData, config);
      storeAuthData(result?.data);
      getAuthData().then(async (res) => {
        if (res.success) {
          const newToken = await refreshToken().then((res) =>
            JSON.stringify(res)
          );
          const parsedToken = JSON.parse(newToken);
          dispatch(setAuthToken(parsedToken));
        }
      });
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


    await AsyncStorage.setItem("@authData", authValue);
    await AsyncStorage.setItem("refreshToken", value?.refreshToken);
    await AsyncStorage.setItem("token", value?.token);
  } catch (e) {
    console.log("checking error", e);
  }
};

export const getAuthData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@authData");
    console.log("checking authData for user", jsonValue);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e);
  }
};

export const removeAuthData = async () => {
  try {
    await AsyncStorage.removeItem("@authData");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("token");

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
