import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionsSummary } from "../../redux/transactions/operations";
import { colorSelect } from "../../utils/colorSelect";
import css from "./StatisticsTable.module.css";

function StatisticsTable() {
  const dispatch = useDispatch();
  const transactionsSummaryData = useSelector(
    (state) => state.transactions.transactionsSummary
  );
  const date = useSelector((state) => state.transactions.date);

  useEffect(() => {
    if (date.year) {
      dispatch(transactionsSummary(date));
    }
  }, [date, dispatch]);

  // Memoized category list
  const categoryList = useMemo(() => {
    return transactionsSummaryData.categoriesSummary
      ?.filter(category => category.name !== "Income")
      .map(category => ({
        color: colorSelect(category.name),
        name: category.name,
        amount: category.total,
      })) || [];
  }, [transactionsSummaryData.categoriesSummary]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h2 className={css.headerTitle}>Category</h2>
        <h2 className={css.headerTitle}>Amount</h2>
      </div>
      
      <ul className={css.categoryList}>
        {categoryList.length > 0 ? (
          categoryList.map((category) => (
            <li key={category.name} className={css.categoryItem}>
              <div className={css.categoryInfo}>
                <div 
                  className={css.colorIndicator}
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className={css.categoryName}>{category.name}</span>
              </div>
              <div className={css.categoryAmount}>
                {formatCurrency(category.amount)}
              </div>
            </li>
          ))
        ) : (
          <li className={css.noData}>No expense data available</li>
        )}
      </ul>

      <div className={css.summary}>
        <div className={css.summaryItem}>
          <span className={css.summaryLabel}>Expenses:</span>
          <span className={css.expenseValue}>
            -{formatCurrency(transactionsSummaryData.expenseSummary)}
          </span>
        </div>
        <div className={css.summaryItem}>
          <span className={css.summaryLabel}>Income:</span>
          <span className={css.incomeValue}>
            {formatCurrency(transactionsSummaryData.incomeSummary)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatisticsTable;