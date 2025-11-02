import { useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./Balance.module.css";
import { selectTransactions } from "../../redux/transactions/selectors";


const BalancePage = () => {
  const transactions = useSelector(selectTransactions);

  const { income, expense, balance } = useMemo(() => {
    const totals = (transactions || []).reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount || 0);
        
        if (transaction.type === "INCOME") {
          acc.income += amount;
        } else if (transaction.type === "EXPENSE") {
          acc.expense += Math.abs(amount); 
        }
        
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      income: totals.income,
      expense: totals.expense,
      balance: totals.income - totals.expense
    };
  }, [transactions]);

  const formatCurrency = (value) => {
    return value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const displayBalance = balance !== null && balance !== undefined;

  return (
    <div className={styles.containerBalance}>
      <div className={styles.balanceCard}>
        <h2 className={styles.titleBalance}>YOUR BALANCE</h2>
        <div className={styles.balanceAmount}>
          {displayBalance ? (
            `$ ${formatCurrency(balance)}`
          ) : (
            <span className={styles.loading}>Loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalancePage;
