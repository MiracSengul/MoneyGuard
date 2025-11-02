import React, { useState } from "react";
import ModalAddTransaction from "../ModalAddTransaction/ModalAddTransaction.jsx";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm.jsx";
import styles from "./ButtonAddTransaction.module.css";
import "../../index.css";

const ButtonAddTransactions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.buttonContainer}>
      <button
        className={`${styles.floatingButton} buttonEffect`}
        onClick={openModal}
        aria-label="Add new transaction"
      >
        <span className={styles.plusIcon}>+</span>
      </button>

      <ModalAddTransaction isOpen={isModalOpen} onClose={closeModal}>
        <AddTransactionForm onClose={closeModal} />
      </ModalAddTransaction>
    </div>
  );
};

export default ButtonAddTransactions;