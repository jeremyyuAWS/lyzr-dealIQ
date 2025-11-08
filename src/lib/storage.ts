import { DealSubmission } from '../types';

const DEALS_KEY = 'lyzr_deal_submissions';

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
  }
};
