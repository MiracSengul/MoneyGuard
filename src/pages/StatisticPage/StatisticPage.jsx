import Header from '../../components/Header/Header.jsx';
import Currency from '../../components/Currency/Currency.jsx';
import Navigation from '../../components/Navigation/Navigation.jsx';
import Balance from '../../components/Balance/Balance.jsx';
import styles from '../Dashboard/Dashboard.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import StatisticsTab from '../StatisticsTab.jsx';

const StatisticPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTabFromUrl = () => {
    if (location.pathname.includes('/statistics')) return 'statistics';
    if (location.pathname.includes('/currency')) return 'currency';
    return 'home';
  };

  const activeTab = getActiveTabFromUrl();

  const handleTabChange = tabName => {
    if (tabName === 'home') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${tabName}`);
    }
  };

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
                <Navigation
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
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
            <StatisticsTab />
          </div>
        </div>
      </div>
    </>
  );
};

export default StatisticPage;
