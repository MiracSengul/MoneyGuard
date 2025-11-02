import React from 'react';
import Header from '../../components/Header/Header.jsx';
import Currency from '../../components/Currency/Currency.jsx';
import Navigation from '../../components/Navigation/Navigation.jsx';
import Balance from '../../components/Balance/Balance.jsx';
import ButtonAddTransactions from '../../components/ButtonAddTransactions/ButtonAddTransactions.jsx';
import styles from './Dashboard.module.css';
import TransactionList from '../../components/TransactionsList/TransactionsList.jsx';

const DashboardPage = () => {
  

  return (
    <>
    
 <div className={styles.backgroundDah}>
        <div className={styles.ellipse5}></div>
  <div className={styles.ellipse4}></div>
  <div className={styles.ellipse2}></div>
  <div className={styles.ellipse1}></div>

      <Header /> 
      <div className={styles.containerDash}>
        <div className={styles.leftContainerDash}>
          <div className={styles.tabletdivDash}>
            <div>
              <Navigation />
            </div>
            <Balance />
          </div>
         
          {!location.pathname.includes('currency') && (
            <div className={styles.CurrencyDash}>
              <Currency />
            </div>
          )}
        </div>
        <div>
         
          <TransactionList />
          <ButtonAddTransactions className={styles.addbuttonDash} />
        </div>
      </div>
      </div>
    </>
  );
};

export default DashboardPage;