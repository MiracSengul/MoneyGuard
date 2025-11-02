import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../redux/auth/operations";
import { selectUser, selectIsLoggedIn } from "../../redux/auth/selectors";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!showLogoutModal) return;

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setShowLogoutModal(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [showLogoutModal]);

  const handleBackdropClick = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setShowLogoutModal(false);
    }
  }, []);

  const username = user?.email ? user.email.split("@")[0] : "";

  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleConfirmLogout = () => {
    dispatch(logOut());
    setShowLogoutModal(false);
  };
  const handleCancelLogout = () => setShowLogoutModal(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo} onClick={scrollToTop}>
            <span className={styles.logoIcon}>
              <img src="/monerguard.svg" alt="Money Guard Logo" />
            </span>
            <h1 className={styles.logoText}>Money Guard</h1>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.username}>{username}</span>
            </div>

            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogoutClick}
              aria-label="Log out"
            >
              <span className={styles.logoutSeparator}></span>
              <img src="exit.svg" alt="Log out" className={styles.logoutIcon} />
              <span className={styles.logoutText}>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className={styles.modalOverlay} onClick={handleBackdropClick}>
          <div className={styles.modal}>
            <button
              className={styles.modalClose}
              onClick={handleCancelLogout}
              aria-label="Close modal"
            >
              ✕
            </button>
            
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <img
                  src="/monerguard.svg"
                  alt="Money Guard"
                  className={styles.modalLogo}
                />
                <h3 className={styles.modalTitle}>Money Guard</h3>
              </div>
              
              <p className={styles.modalMessage}>
                Are you sure you want to log out?
              </p>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.confirmBtn}
                  onClick={handleConfirmLogout}
                >
                  Log Out
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={handleCancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;