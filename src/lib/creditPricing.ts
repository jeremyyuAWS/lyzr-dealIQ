const CREDIT_RATE_KEY = 'lyzr_credit_rate';
const DEFAULT_CREDIT_RATE = 0.01;

export interface CreditPricing {
  rate: number;
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

  setRate(rate: number, notes?: string): void {
    const pricing: CreditPricing = {
      rate,
      lastUpdated: new Date().toISOString(),
      notes,
    };
    localStorage.setItem(CREDIT_RATE_KEY, JSON.stringify(pricing));
  },

  getPricing(): CreditPricing {
    try {
      const stored = localStorage.getItem(CREDIT_RATE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load credit pricing:', error);
    }
    return {
      rate: DEFAULT_CREDIT_RATE,
      lastUpdated: new Date().toISOString(),
    };
  },

  formatCost(credits: number): string {
    const rate = this.getRate();
    const cost = credits * rate;
    return cost.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  formatCostCompact(credits: number): string {
    const rate = this.getRate();
    const cost = credits * rate;
    if (cost >= 1000) {
      return `$${(cost / 1000).toFixed(1)}k`;
    }
    return `$${cost.toFixed(0)}`;
  }
};
