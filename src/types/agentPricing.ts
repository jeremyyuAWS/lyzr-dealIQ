export interface LyzrPricingRates {
  credit: {
    symbol: string;
    usd: number;
  };
  core: {
    llmUsage: string;
    agentCommunication: {
      priceCredits: number;
      perTokens: number;
    };
  };
  create: {
    agent: number;
    app: number;
    kb: number;
    raiHm: number;
    evalSuite: number;
    toolIntegration: number;
  };
  calls: {
    kbRetrieve: number;
    memoryOp: number;
    raiHmRun: number;
    evalStandard: number;
    evalEnterprise: number;
    toolApiLight: number;
    toolWebFetch: number;
    toolDeepCrawl: number;
  };
  knowledgeBase: {
    ingestion: {
      priceCredits: number;
      perTokens: number;
    };
    storage: {
      priceCredits: number;
      perGbMonth: number;
    };
  };
}

export const LYZR_PRICING: LyzrPricingRates = {
  credit: {
    symbol: 'C',
    usd: 1.0,
  },
  core: {
    llmUsage: 'pass-through',
    agentCommunication: {
      priceCredits: 1.0,
      perTokens: 1000000,
    },
  },
  create: {
    agent: 0.05,
    app: 1.0,
    kb: 1.0,
    raiHm: 1.0,
    evalSuite: 2.0,
    toolIntegration: 0.1,
  },
  calls: {
    kbRetrieve: 0.05,
    memoryOp: 0.05,
    raiHmRun: 0.1,
    evalStandard: 1.0,
    evalEnterprise: 1.0,
    toolApiLight: 0.05,
    toolWebFetch: 0.1,
    toolDeepCrawl: 0.25,
  },
  knowledgeBase: {
    ingestion: {
      priceCredits: 1.0,
      perTokens: 100000,
    },
    storage: {
      priceCredits: 0.2,
      perGbMonth: 1,
    },
  },
};

export interface ScenarioInputs {
  pagesChecked: number;
  extraPages: number;
  knowledgeLookups: number;
  memorySteps: number;
  apiActions: number;
  safetyChecks: number;
  agentChatterTokens: number;
}

export interface UsageBreakdownItem {
  resource: string;
  units: number;
  rateCPerUnit: number;
  creditsC: number;
}

export interface ScenarioCalculation {
  inputs: ScenarioInputs;
  perUnitBreakdown: UsageBreakdownItem[];
  perUnitTotalC: number;
  monthlyTotal30dC: number;
}

export interface SetupCosts {
  include: boolean;
  items: Array<{ item: string; creditsC: number }>;
  kbIngestionTokens: number;
  kbIngestionCreditsC: number;
  kbStorageGBMonth: number | null;
  kbStorageCreditsC: number | null;
  setupTotalC: number;
}

export interface CreditEstimate {
  scenario: string;
  unit: string;
  unitsPer30d: number;
  light: ScenarioCalculation;
  heavy: ScenarioCalculation;
  setup: SetupCosts;
  flags: {
    tokensSoftLimitPerUnit: boolean;
    callCountSoftLimitPerUnit: boolean;
  };
  notes: string;
}

export interface DemoScenario {
  name: string;
  unit: string;
  description: string;
  unitsPerMonth: number;
  light: ScenarioInputs;
  heavy: ScenarioInputs;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    name: 'Blog Post Writer',
    unit: 'post',
    description: 'AI agent that researches topics and writes blog posts',
    unitsPerMonth: 20,
    light: {
      pagesChecked: 2,
      extraPages: 0,
      knowledgeLookups: 0,
      memorySteps: 0,
      apiActions: 0,
      safetyChecks: 0,
      agentChatterTokens: 10000,
    },
    heavy: {
      pagesChecked: 8,
      extraPages: 4,
      knowledgeLookups: 2,
      memorySteps: 1,
      apiActions: 2,
      safetyChecks: 1,
      agentChatterTokens: 50000,
    },
  },
  {
    name: 'Research Digest',
    unit: 'daily run',
    description: 'Daily automated research summary and email delivery',
    unitsPerMonth: 30,
    light: {
      pagesChecked: 0,
      extraPages: 0,
      knowledgeLookups: 0,
      memorySteps: 0,
      apiActions: 5,
      safetyChecks: 0,
      agentChatterTokens: 20000,
    },
    heavy: {
      pagesChecked: 10,
      extraPages: 0,
      knowledgeLookups: 0,
      memorySteps: 1,
      apiActions: 10,
      safetyChecks: 1,
      agentChatterTokens: 50000,
    },
  },
  {
    name: 'Media Plan Session',
    unit: 'session',
    description: 'Interactive media planning with research and recommendations',
    unitsPerMonth: 50,
    light: {
      pagesChecked: 1,
      extraPages: 0,
      knowledgeLookups: 2,
      memorySteps: 1,
      apiActions: 4,
      safetyChecks: 0,
      agentChatterTokens: 20000,
    },
    heavy: {
      pagesChecked: 3,
      extraPages: 4,
      knowledgeLookups: 6,
      memorySteps: 2,
      apiActions: 12,
      safetyChecks: 1,
      agentChatterTokens: 80000,
    },
  },
];
