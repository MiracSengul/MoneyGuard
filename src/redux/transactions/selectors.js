export const selectTransactions = (state) => state.transactions.items;
export const selectLoading = (state) => state.transactions.loading;
export const selectError = (state) => state.transactions.error;
export const selectBalance = (state) => state.transactions.transactionsSummary.periodTotal;
export const selectCategories = (state) => state.transactions.categories.items;