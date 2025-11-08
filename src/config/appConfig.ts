export const APP_CONFIG = {
  enableDatabase: import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
  demoMode: true,
  requireAuth: false,
};

export const DEMO_STORAGE_KEY = 'lyzr_deal_intake_demos';
