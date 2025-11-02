import ReactDOM from "react-dom";
import { useCallback, useEffect } from "react";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm";
import styles from "./ModalAddTransaction.module.css";

const ModalAddTransaction = ({ isOpen, onClose }) => {
  const handleEscapeKey = useCallback((event) => {
    if (event.key === "Escape") onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) onClose();
  }, [onClose]);

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
      <div className={styles.modalContent}>
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        <AddTransactionForm onClose={onClose} />
      </div>
    </div>,
    document.getElementById("root") || document.body
  );
};

export default ModalAddTransaction;
