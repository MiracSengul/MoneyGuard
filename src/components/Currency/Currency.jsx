import { useEffect, useState } from 'react';
import {
  fetchCurrencyData,
  getFromLocalStorage,
  saveToLocalStorage,
} from '../../services/currencyService.js';
import { isLessThanOneHour } from '../../utils/timeUtils.js';
import CurrencyChart from '../CurrencyChart/CurrencyChart.jsx';
import css from './Currency.module.css';
import Loader from '../Loader/Loader.jsx';
import Navigation from '../Navigation/Navigation.jsx';

const CurrencyRates = () => {
  const [currencyRates, setCurrencyRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadCurrencyData = async () => {
      try {
        const cachedData = getFromLocalStorage();
        
        if (cachedData && isLessThanOneHour(cachedData.timestamp)) {
          setCurrencyRates(cachedData.data);
        } else {
          const freshData = await fetchCurrencyData();
          saveToLocalStorage(freshData);
          setCurrencyRates(freshData);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrencyData();
  }, []);

  const getCurrencyName = (currencyCode) => {
    const currencies = {
      840: 'USD',
      978: 'EUR'
    };
    return currencies[currencyCode] || 'Unknown';
  };

  if (isLoading) return <Loader />;
  if (hasError) return <p className={css.errorMessage}>No data available</p>;

  return (
    <div className={css.currencyPage}>
      <div className={css.navigation}>
        <Navigation />
      </div>
      
      <div className={css.backgroundEllipse} data-type="purple"></div>
      <div className={css.backgroundEllipse} data-type="blue"></div>
      <div className={css.backgroundEllipse} data-type="pink"></div>
      
      <div className={css.contentWrapper}>
        <table className={css.ratesTable}>
          <thead className={css.tableHeader}>
            <tr>
              <th>Currency</th>
              <th>Purchase</th>
              <th>Sale</th>
            </tr>
          </thead>
          <tbody className={css.tableBody}>
            {currencyRates.map((rate) => (
              <tr key={rate.currencyCodeA} className={css.tableRow}>
                <td className={css.currencyName}>
                  {getCurrencyName(rate.currencyCodeA)}
                </td>
                <td className={css.rateValue}>
                  {rate.rateBuy.toFixed(2)}
                </td>
                <td className={css.rateValue}>
                  {rate.rateSell.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <CurrencyChart data={currencyRates} />
      </div>
    </div>
  );
};

export default CurrencyRates;
