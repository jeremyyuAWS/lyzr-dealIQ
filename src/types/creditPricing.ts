export interface CreditPricingItem {
  category: string;
  key: string;
  price: number;
  unit: string;
  editable?: boolean;
}

export const DEFAULT_CREDIT_PRICING: CreditPricingItem[] = [
  {
    category: 'Agent Creation',
    key: 'create.agent',
    price: 0.05,
    unit: 'per agent',
    editable: true
  },
  {
    category: 'App Creation',
    key: 'create.app',
    price: 1.00,
    unit: 'one-time',
    editable: true
  },
  {
    category: 'Knowledge Base Ingestion',
    key: 'kb.ingest',
    price: 1.00,
    unit: 'per 100k tokens',
    editable: true
  },
  {
    category: 'KB Storage',
    key: 'kb.storage',
    price: 0.2,
    unit: 'per GB/month',
    editable: true
  },
  {
    category: 'API Call (Light)',
    key: 'call.tool.api_light',
    price: 0.05,
    unit: 'per call',
    editable: true
  },
  {
    category: 'Web Fetch',
    key: 'call.tool.web_fetch',
    price: 0.1,
    unit: 'per URL/PDF',
    editable: true
  },
  {
    category: 'Deep Crawl',
    key: 'call.tool.deep_crawl',
    price: 0.25,
    unit: 'per extra page',
    editable: true
  },
  {
    category: 'RAI Human Monitor',
    key: 'call.rai_hm.run',
    price: 0.1,
    unit: 'per run',
    editable: true
  },
  {
    category: 'Evaluation Suite',
    key: 'call.eval.standard',
    price: 1.0,
    unit: 'per 100 tests',
    editable: true
  },
  {
    category: 'Inter-Agent Communication',
    key: 'inter-agent.msg',
    price: 1.0,
    unit: 'per 1M tokens',
    editable: true
  }
];
