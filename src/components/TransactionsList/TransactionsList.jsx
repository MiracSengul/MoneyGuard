import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { selectTransactions } from "../../redux/transactions/selectors";
import { selectTypeFilter } from "../../redux/filters/selectors";
import { fetchTransactions } from "../../redux/transactions/operations";
import TransactionsItem from "../TransactionsItem/TransactionsItem";
import ModalAddTransaction from "../ModalAddTransaction/ModalAddTransaction";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import TransactionsFilter from "../TransactionsFilter/TransactionsFilter";
import css from "./TransactionsList.module.css";

const TransactionList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const typeFilter = useSelector(selectTypeFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollWrapperRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Memoized sorted and filtered transactions
  const sortedTransactions = useMemo(() => {
    return [...(transactions || [])].sort(
      (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (typeFilter === "all") return sortedTransactions;
    return sortedTransactions.filter(
      (transaction) => transaction.type === typeFilter.toUpperCase()
    );
  }, [sortedTransactions, typeFilter]);

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Scroll to top function for table header
  const scrollToTop = () => {
    scrollWrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Empty state component
  const EmptyState = () => (
    <div className={css.emptyState}>
      <span className={css.emptyIcon}>🪙</span>
      <h3 className={css.emptyTitle}>No transactions yet</h3>
      <p className={css.emptyMessage}>
        Start tracking your money by adding your first transaction!
      </p>
      <button className={css.addButton} onClick={openModal}>
        <span className={css.addIcon}>＋</span>
        Add Transaction
      </button>
    </div>
  );

  // Desktop table component
  const DesktopTable = () => {
    const shouldScroll = filteredTransactions.length > 8;
    const TableContent = () => (
      <table className={css.transactionTable}>
        <colgroup>
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "27%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead className={css.tableHeader} onClick={scrollToTop}>
          <tr>
            <th className={css.dateHeader}>Date</th>
            <th className={css.typeHeader}>Type</th>
            <th className={css.categoryHeader}>Category</th>
            <th className={css.commentHeader}>Comment</th>
            <th className={css.amountHeader}>Amount</th>
            <th className={css.actionsHeader}></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="6">
                <EmptyState />
              </td>
            </tr>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionsItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </tbody>
      </table>
    );

    return shouldScroll ? (
      <div className={css.scrollWrapper} ref={scrollWrapperRef}>
        <TableContent />
      </div>
    ) : (
      <TableContent />
    );
  };

  // Mobile list component
  const MobileList = () => (
    <>
      <TransactionsFilter />
      <ul className={css.mobileList}>
        {filteredTransactions.length === 0 ? (
          <li>
            <EmptyState />
          </li>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionsItem
              key={transaction.id}
              transaction={transaction}
              isMobile={true}
            />
          ))
        )}
      </ul>
    </>
  );

  return (
    <>
      {isMobile ? <MobileList /> : (
        <div className={css.desktopContainer}>
          <div className={css.filterContainer}>
            <TransactionsFilter />
          </div>
          <DesktopTable />
        </div>
      )}

      <ModalAddTransaction isOpen={isModalOpen} onClose={closeModal}>
        <AddTransactionForm onClose={closeModal} />
      </ModalAddTransaction>
    </>
  );
};

export default TransactionList;