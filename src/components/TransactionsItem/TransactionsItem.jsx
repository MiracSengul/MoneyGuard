import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-hot-toast";
import {
  deleteTransaction,
  fetchCategories,
} from "../../redux/transactions/operations";
import { selectCategories } from "../../redux/transactions/selectors";
import { typeSymbol, sumColor } from "../../utils/transactionUtils";
import ModalEditTransaction from "../ModalEditTransaction/ModalEditTransaction";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import css from "./TransactionsItem.module.css";

const formatTransactionDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

const TransactionsItem = ({ transaction, isMobile: isMobileProp }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  
  const isMobileFallback = useMediaQuery({ maxWidth: 767 });
  const isMobile = typeof isMobileProp === "boolean" ? isMobileProp : isMobileFallback;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formattedAmount = useMemo(() => {
    return Math.abs(Number(transaction.amount || 0)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [transaction.amount]);

  const categoryName = useMemo(() => {
    const category = categories?.find(cat => cat.id === transaction.categoryId);
    return category?.name || "Other";
  }, [categories, transaction.categoryId]);

  const transactionColor = useMemo(() => sumColor(transaction.type), [transaction.type]);
  const transactionSymbol = useMemo(() => typeSymbol(transaction.type), [transaction.type]);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteTransaction = () => {
    dispatch(deleteTransaction(transaction.id))
      .unwrap()
      .then(() => {
        toast.success("Transaction deleted successfully", { duration: 2000 });
      })
      .catch(() => {
        toast.error("Failed to delete transaction. Please try again.", {
          duration: 3000,
        });
      })
      .finally(() => {
        closeDeleteModal();
      });
  };

  const renderMobileView = () => (
    <li className={css.mobileCard}>
      <div 
        className={css.colorAccent} 
        style={{ backgroundColor: transactionColor }} 
      />
      <div className={css.cardContent}>
        <div className={css.infoRow}>
          <span className={css.label}>Date</span>
          <span className={css.value}>
            {formatTransactionDate(transaction.transactionDate)}
          </span>
        </div>
        <div className={css.infoRow}>
          <span className={css.label}>Type</span>
          <span className={css.value}>{transactionSymbol}</span>
        </div>
        <div className={css.infoRow}>
          <span className={css.label}>Category</span>
          <span className={css.value}>{categoryName}</span>
        </div>
        <div className={css.infoRow}>
          <span className={css.label}>Comment</span>
          <span className={`${css.value} ${css.comment}`} title={transaction.comment}>
            {transaction.comment?.trim() ? transaction.comment : "❔️"}
          </span>
        </div>
        <div className={css.infoRow}>
          <span className={css.label}>Amount</span>
          <span className={css.amount} style={{ color: transactionColor }}>
            {formattedAmount}
          </span>
        </div>
        <div className={css.actionButtons}>
          <button 
            className={css.editButton} 
            onClick={openEditModal}
            aria-label="Edit transaction"
          >
            ✎ Edit
          </button>
          <button 
            className={css.deleteButton} 
            onClick={openDeleteModal}
            aria-label="Delete transaction"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );

  const renderDesktopView = () => (
    <tr className={css.tableRow}>
      <td className={css.dateCell}>
        {formatTransactionDate(transaction.transactionDate)}
      </td>
      <td className={css.typeCell}>{transactionSymbol}</td>
      <td className={css.categoryCell}>{categoryName}</td>
      <td className={css.commentCell} title={transaction.comment}>
        {transaction.comment?.trim() ? transaction.comment : "❔️"}
      </td>
      <td className={css.amountCell} style={{ color: transactionColor }}>
        {formattedAmount}
      </td>
      <td className={css.actionsCell}>
        <div className={css.actionButtons}>
          <button 
            className={css.editButton} 
            onClick={openEditModal}
            aria-label="Edit transaction"
          >
            ✎
          </button>
          <button 
            className={css.deleteButton} 
            onClick={openDeleteModal}
            aria-label="Delete transaction"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      {isEditModalOpen && (
        <ModalEditTransaction
          isOpen={isEditModalOpen}
          transaction={transaction}
          onClose={closeEditModal}
        />
      )}

      {isDeleteModalOpen && ReactDOM.createPortal(
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDeleteTransaction}
          onCancel={closeDeleteModal}
        />,
        document.body
      )}
    </>
  );
};

export default React.memo(TransactionsItem);