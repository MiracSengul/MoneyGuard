import React, { useEffect, useRef, useCallback } from 'react';
import css from './ConfirmDeleteModal.module.css';

const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onCancel]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={css.modalBackdrop} onClick={handleBackdropClick}>
      <div className={css.modalContent} ref={modalRef}>
        <h3 className={css.modalTitle}>
          Confirm Deletion
        </h3>
        <p className={css.modalMessage}>
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
        <div className={css.modalActions}>
          <button
            className={`${css.deleteButton} buttonEffect`}
            onClick={onConfirm}
            aria-label="Confirm deletion"
          >
            Delete
          </button>
          <button
            className={`${css.cancelButton} cancelEffects`}
            onClick={onCancel}
            aria-label="Cancel deletion"
          >
            Keep
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;