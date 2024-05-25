// utils/exchangeRateService.js

export async function getExchangeRate(fromCurrency, toCurrency) {
    // Hardcoded exchange rates for simplicity
    const exchangeRates = {
      USD: { EUR: 0.85, GBP: 0.75, JPY: 110 },
      EUR: { USD: 1.18, GBP: 0.88, JPY: 129 },
      GBP: { USD: 1.34, EUR: 1.14, JPY: 147 },
      JPY: { USD: 0.0091, EUR: 0.0078, GBP: 0.0068 },
    };
  
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  
    // Return the exchange rate if available, else return 1 as default
    return exchangeRates[fromCurrency]?.[toCurrency] || 1;
  }