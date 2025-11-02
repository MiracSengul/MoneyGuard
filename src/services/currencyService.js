const API_URL = 'https://api.monobank.ua/bank/currency';
const STORAGE_KEY = 'currencyData';
const SUPPORTED_CURRENCIES = [
  { codeA: 840, codeB: 980, symbol: 'USD' }, // USD to UAH
  { codeA: 978, codeB: 980, symbol: 'EUR' }  // EUR to UAH
];

/**
 * @returns {Promise<Array>} Filtered currency data
 * @throws {Error} When API request fails
 */
export async function fetchCurrencyData() {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.filter(item => 
      item.currencyCodeB === 980 &&
      SUPPORTED_CURRENCIES.some(currency => currency.codeA === item.currencyCodeA)
    );
  } catch (error) {
    console.error('Failed to fetch currency data:', error);
    throw new Error('Unable to fetch currency rates. Please try again later.');
  }
}

/**
 * @param {Array} data - Currency data to save
 */
export function saveToLocalStorage(data) {
  try {
    const storageData = {
      timestamp: Date.now(), 
      data: data,
      expiresAt: Date.now() + (60 * 60 * 1000) 
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save currency data to localStorage:', error);
  }
}

/**
 * @returns {Object|null} Stored data or null if not found/expired
 */
export function getFromLocalStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    
    if (!rawData) {
      return null;
    }
    
    const storedData = JSON.parse(rawData);
    
    if (Date.now() > storedData.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return storedData;
  } catch (error) {
    console.error('Failed to retrieve currency data from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * @param {number} maxAge - Maximum age in milliseconds (default: 1 hour)
 * @returns {boolean} 
 */
export function isCachedDataValid(maxAge = 60 * 60 * 1000) {
  const storedData = getFromLocalStorage();
  
  if (!storedData) {
    return false;
  }
  
  return Date.now() - storedData.timestamp < maxAge;
}

/**
 * @param {number} currencyCode - Currency code (840 for USD, 978 for EUR)
 * @returns {string} symbol
 */
export function getCurrencySymbol(currencyCode) {
  const currency = SUPPORTED_CURRENCIES.find(curr => curr.codeA === currencyCode);
  return currency ? currency.symbol : 'Unknown';
}