import { DealSubmission } from '../types';
import { CurrencyCode } from './creditPricing';

const DEALS_KEY = 'lyzr_deal_submissions';
const DEAL_PRICING_KEY = 'lyzr_deal_pricing';

export interface DealPricingConfig {
  dealId: string;
  creditRate: number;
  currency: CurrencyCode;
  accountNotes: string;
  updatedAt: string;
}

export const storage = {
  async saveSubmission(deal: DealSubmission): Promise<DealSubmission> {
    const deals = await storage.getAllSubmissions();
    const newDeal = {
      ...deal,
      id: deal.id || `deal_${Date.now()}`,
      created_at: deal.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    deals.push(newDeal);
    localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
    return newDeal;
  },

  async getAllSubmissions(): Promise<DealSubmission[]> {
    const stored = localStorage.getItem(DEALS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async getSubmissionById(id: string): Promise<DealSubmission | null> {
    const deals = await storage.getAllSubmissions();
    return deals.find(d => d.id === id) || null;
  },

  async deleteSubmission(id: string): Promise<void> {
    const deals = await storage.getAllSubmissions();
    const filtered = deals.filter(d => d.id !== id);
    localStorage.setItem(DEALS_KEY, JSON.stringify(filtered));
  },

  async updateSubmission(id: string, updates: Partial<DealSubmission>): Promise<DealSubmission | null> {
    const deals = await storage.getAllSubmissions();
    const index = deals.findIndex(d => d.id === id);

    if (index === -1) return null;

    deals[index] = {
      ...deals[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(DEALS_KEY, JSON.stringify(deals));
    return deals[index];
  },

  async saveDealPricing(config: DealPricingConfig): Promise<void> {
    const allConfigs = await storage.getAllDealPricing();
    const index = allConfigs.findIndex(c => c.dealId === config.dealId);

    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      allConfigs[index] = updatedConfig;
    } else {
      allConfigs.push(updatedConfig);
    }

    localStorage.setItem(DEAL_PRICING_KEY, JSON.stringify(allConfigs));
  },

  async getDealPricing(dealId: string): Promise<DealPricingConfig | null> {
    const allConfigs = await storage.getAllDealPricing();
    return allConfigs.find(c => c.dealId === dealId) || null;
  },

  async getAllDealPricing(): Promise<DealPricingConfig[]> {
    const stored = localStorage.getItem(DEAL_PRICING_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async deleteDealPricing(dealId: string): Promise<void> {
    const allConfigs = await storage.getAllDealPricing();
    const filtered = allConfigs.filter(c => c.dealId !== dealId);
    localStorage.setItem(DEAL_PRICING_KEY, JSON.stringify(filtered));
  }
};
