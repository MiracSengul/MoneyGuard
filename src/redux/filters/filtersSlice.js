import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "all",
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setTypeFilter(state, action) {
      state.type = action.payload;
    },
  },
});

export const { setTypeFilter } = filtersSlice.actions;
export default filtersSlice.reducer;
