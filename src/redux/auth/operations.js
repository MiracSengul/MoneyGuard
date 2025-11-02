import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

axios.defaults.baseURL = "https://wallet.b.goit.study";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk("auth/register", async (credentials, thunkAPI) => {
  try {
    const res = await axios.post("/api/auth/sign-up", credentials)
    
    setAuthHeader(res.data.token)

    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const logIn = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const res = await axios.post("/api/auth/sign-in", credentials);

      setAuthHeader(res.data.token);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.delete("/api/auth/sign-out");
    clearAuthHeader();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
export const refreshUser = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {

  const state = thunkAPI.getState()

  const token = state.auth.token

  if (token === null) {
    return thunkAPI.rejectWithValue("Unable to fetch user");
  }

  try {
    setAuthHeader(token)

    const res = await axios.get("/api/users/current");
    
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})
