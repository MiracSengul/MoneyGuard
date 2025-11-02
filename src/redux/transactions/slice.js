import { createSlice } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  transactionsSummary,
  fetchCategories,
} from "./operations";
import { logOut } from "../auth/operations";
import Toast from "react-hot-toast";

const initialState = {
  items: [],
  loading: false,
  error: null,
  transactionsSummary: {
    categoriesSummary: [],
    incomeSummary: 0,
    expenseSummary: 0,
    periodTotal: 0,
    year: 0,
    month: 0,
  },
  categories: {
    items: [],
  },
  date: {},
};

const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
  () => {
    Toast.error(
      "We can't reach the server, please try again later or contact support",
      {
        duration: 3000,
        style: { zIndex: 9999 },
      }
    );
  };
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, handlePending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, handleRejected)

      .addCase(createTransaction.pending, handlePending)
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(createTransaction.rejected, handleRejected)

      .addCase(deleteTransaction.pending, handlePending)
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, handleRejected)

      .addCase(updateTransaction.pending, handlePending)
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, handleRejected)

      .addCase(logOut.fulfilled, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      })

      .addCase(transactionsSummary.pending, handlePending)
      .addCase(transactionsSummary.fulfilled, (state, action) => {
        state.transactionsSummary = action.payload;
      })
      .addCase(transactionsSummary.rejected, handleRejected)
      .addCase(fetchCategories.pending, handlePending)
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.items = action.payload;
      })
      .addCase(fetchCategories.rejected, handleRejected);
  },
  reducers: {
    changeDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export default transactionsSlice.reducer;
export const { changeDate } = transactionsSlice.actions;
