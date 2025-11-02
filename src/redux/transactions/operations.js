import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/transactions");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/transactions", transactionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (transactionId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/transactions/${transactionId}`);
      return transactionId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/transactions/${id}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

export const transactionsSummary = createAsyncThunk(
  "transactions/transactionsSummary",
  async (date, thunkApi) => {
    try {
      const response = await axios.get(
        `/api/transactions-summary?month=${date.month}&year=${date.year}`
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
export const fetchCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async (_, thunkApi) => {
    try {
      const res = await axios.get("/api/transaction-categories");

      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);
