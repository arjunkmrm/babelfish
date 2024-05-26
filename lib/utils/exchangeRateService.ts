// utils/exchangeRateService.ts

type ExchangeRates = {
  [key: string]: {
    [key: string]: number;
  };
};

export async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  // Hardcoded exchange rates for simplicity
  const exchangeRates: ExchangeRates = {
    USD: { EUR: 0.85, GBP: 0.75, JPY: 110, SGD: 1.33 },
    EUR: { USD: 1.18, GBP: 0.88, JPY: 129, SGD: 1.56 },
    GBP: { USD: 1.34, EUR: 1.14, JPY: 147, SGD: 1.78 },
    JPY: { USD: 0.0091, EUR: 0.0078, GBP: 0.0068, SGD: 0.012 },
    SGD: { USD: 0.75, EUR: 0.64, GBP: 0.56, JPY: 83.33 },
  };

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return the exchange rate if available, else return 1 as default
  return exchangeRates[fromCurrency]?.[toCurrency] || 1;
}