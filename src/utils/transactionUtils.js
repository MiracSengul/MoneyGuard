export const typeSymbol = type => {
  return type === 'INCOME' ? '+' : type === 'EXPENSE' ? '-' : '';
};

export const sumColor = type => {
  return type === 'INCOME'
    ? 'rgba(255, 182, 39, 1)'
    : type === 'EXPENSE'
    ? 'rgba(255, 134, 141, 1)'
    : '';
};
