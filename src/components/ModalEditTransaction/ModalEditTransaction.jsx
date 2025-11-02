import React, { useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./ModalEditTransaction.module.css";
import EditTransactionForm from "../EditTransactionForm/EditTransactionForm";

const ModalEditTransaction = ({ isOpen, onClose, transaction }) => {
  const handleEscapeKey = useCallback((event) => {
    if (event.key === "Escape") onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) onClose();
  }, [onClose]);

  const handleModalClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContent} onClick={handleModalClick}>
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Close edit transaction modal"
        >
          ✕
        </button>
        <EditTransactionForm 
          transactionData={transaction} 
          onCancel={onClose} 
        />
      </div>
    </div>,
    document.getElementById("root") || document.body
  );
};

export default ModalEditTransaction;