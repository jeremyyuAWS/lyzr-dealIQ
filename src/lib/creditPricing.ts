const CREDIT_RATE_KEY = 'lyzr_credit_rate';
const DEFAULT_CREDIT_RATE = 0.01;
const DEFAULT_CURRENCY = 'USD';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'AUD' | 'CAD' | 'SGD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export interface CreditPricing {
  rate: number;
  currency: CurrencyCode;
  lastUpdated: string;
  notes?: string;
}

export const creditPricing = {
  getRate(): number {
    try {
      const stored = localStorage.getItem(CREDIT_RATE_KEY);
      if (stored) {
        const pricing: CreditPricing = JSON.parse(stored);
        return pricing.rate;
      }
    } catch (error) {
      console.error('Failed to load credit rate:', error);
    }
    return DEFAULT_CREDIT_RATE;
  },

  getCurrency(): CurrencyCode {
    try {
      const stored = localStorage.getItem(CREDIT_RATE_KEY);
      if (stored) {
        const pricing: CreditPricing = JSON.parse(stored);
        return pricing.currency || DEFAULT_CURRENCY;
      }
    } catch (error) {
      console.error('Failed to load currency:', error);
    }
    return DEFAULT_CURRENCY;
  },

  getCurrencySymbol(): string {
    const currency = this.getCurrency();
    const currencyInfo = CURRENCIES.find(c => c.code === currency);
    return currencyInfo?.symbol || '$';
  },

  setRate(rate: number, currency: CurrencyCode, notes?: string): void {
    const pricing: CreditPricing = {
      rate,
      currency,
      lastUpdated: new Date().toISOString(),
      notes,
    };
    localStorage.setItem(CREDIT_RATE_KEY, JSON.stringify(pricing));
    window.dispatchEvent(new Event('storage'));
  },

  getPricing(): CreditPricing {
    try {
      const stored = localStorage.getItem(CREDIT_RATE_KEY);
      if (stored) {
        const pricing = JSON.parse(stored);
        return {
          ...pricing,
          currency: pricing.currency || DEFAULT_CURRENCY
        };
      }
    } catch (error) {
      console.error('Failed to load credit pricing:', error);
    }
    return {
      rate: DEFAULT_CREDIT_RATE,
      currency: DEFAULT_CURRENCY,
      lastUpdated: new Date().toISOString(),
    };
  },

  formatCost(credits: number, includeSymbol: boolean = true): string {
    const rate = this.getRate();
    const cost = credits * rate;
    const symbol = includeSymbol ? this.getCurrencySymbol() : '';
    return `${symbol}${cost.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  formatCostCompact(credits: number): string {
    const rate = this.getRate();
    const cost = credits * rate;
    const symbol = this.getCurrencySymbol();
    if (cost >= 1000000) {
      return `${symbol}${(cost / 1000000).toFixed(1)}M`;
    }
    if (cost >= 1000) {
      return `${symbol}${(cost / 1000).toFixed(1)}k`;
    }
    return `${symbol}${cost.toFixed(0)}`;
  }
};
