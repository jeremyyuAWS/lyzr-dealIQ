import {
  LYZR_PRICING,
  ScenarioInputs,
  UsageBreakdownItem,
  ScenarioCalculation,
  CreditEstimate,
  SetupCosts,
} from '../types/agentPricing';

function roundUpToThousandth(value: number): number {
  return Math.ceil(value * 1000) / 1000;
}

function calculateScenario(inputs: ScenarioInputs): ScenarioCalculation {
  const breakdown: UsageBreakdownItem[] = [];

  if (inputs.pagesChecked > 0) {
    const credits = inputs.pagesChecked * LYZR_PRICING.calls.toolWebFetch;
    breakdown.push({
      resource: 'Pages checked',
      units: inputs.pagesChecked,
      rateCPerUnit: LYZR_PRICING.calls.toolWebFetch,
      creditsC: credits,
    });
  }

  if (inputs.extraPages > 0) {
    const credits = inputs.extraPages * LYZR_PRICING.calls.toolDeepCrawl;
    breakdown.push({
      resource: 'Extra pages (same site)',
      units: inputs.extraPages,
      rateCPerUnit: LYZR_PRICING.calls.toolDeepCrawl,
      creditsC: credits,
    });
  }

  if (inputs.knowledgeLookups > 0) {
    const credits = inputs.knowledgeLookups * LYZR_PRICING.calls.kbRetrieve;
    breakdown.push({
      resource: 'Knowledge lookups',
      units: inputs.knowledgeLookups,
      rateCPerUnit: LYZR_PRICING.calls.kbRetrieve,
      creditsC: credits,
    });
  }

  if (inputs.memorySteps > 0) {
    const credits = inputs.memorySteps * LYZR_PRICING.calls.memoryOp;
    breakdown.push({
      resource: 'Memory step',
      units: inputs.memorySteps,
      rateCPerUnit: LYZR_PRICING.calls.memoryOp,
      creditsC: credits,
    });
  }

  if (inputs.apiActions > 0) {
    const credits = inputs.apiActions * LYZR_PRICING.calls.toolApiLight;
    breakdown.push({
      resource: 'App/API actions',
      units: inputs.apiActions,
      rateCPerUnit: LYZR_PRICING.calls.toolApiLight,
      creditsC: credits,
    });
  }

  if (inputs.safetyChecks > 0) {
    const credits = inputs.safetyChecks * LYZR_PRICING.calls.raiHmRun;
    breakdown.push({
      resource: 'Safety check',
      units: inputs.safetyChecks,
      rateCPerUnit: LYZR_PRICING.calls.raiHmRun,
      creditsC: credits,
    });
  }

  if (inputs.agentChatterTokens > 0) {
    const ratePer = LYZR_PRICING.core.agentCommunication.priceCredits / LYZR_PRICING.core.agentCommunication.perTokens;
    const credits = inputs.agentChatterTokens * ratePer;
    breakdown.push({
      resource: 'Agent chatter (tokens)',
      units: inputs.agentChatterTokens,
      rateCPerUnit: ratePer,
      creditsC: credits,
    });
  }

  const perUnitTotal = breakdown.reduce((sum, item) => sum + item.creditsC, 0);
  const perUnitTotalC = roundUpToThousandth(perUnitTotal);

  return {
    inputs,
    perUnitBreakdown: breakdown,
    perUnitTotalC,
    monthlyTotal30dC: 0,
  };
}

export function estimateCredits(
  scenario: string,
  unit: string,
  unitsPer30d: number,
  lightInputs: ScenarioInputs,
  heavyInputs: ScenarioInputs,
  includeSetup: boolean = false,
  kbIngestionTokens: number = 0,
  kbStorageGBMonth: number | null = null
): CreditEstimate {
  const lightCalc = calculateScenario(lightInputs);
  const heavyCalc = calculateScenario(heavyInputs);

  lightCalc.monthlyTotal30dC = roundUpToThousandth(lightCalc.perUnitTotalC * unitsPer30d);
  heavyCalc.monthlyTotal30dC = roundUpToThousandth(heavyCalc.perUnitTotalC * unitsPer30d);

  const setupItems: Array<{ item: string; creditsC: number }> = [];
  let setupTotal = 0;

  if (includeSetup) {
    setupItems.push({ item: 'create.agent', creditsC: LYZR_PRICING.create.agent });
    setupTotal += LYZR_PRICING.create.agent;
  }

  const kbIngestionCredits = kbIngestionTokens > 0
    ? (kbIngestionTokens / LYZR_PRICING.knowledgeBase.ingestion.perTokens) * LYZR_PRICING.knowledgeBase.ingestion.priceCredits
    : 0;

  const kbStorageCredits = kbStorageGBMonth !== null && kbStorageGBMonth > 0
    ? kbStorageGBMonth * LYZR_PRICING.knowledgeBase.storage.priceCredits
    : null;

  if (includeSetup && kbIngestionTokens > 0) {
    setupItems.push({ item: 'create.kb', creditsC: LYZR_PRICING.create.kb });
    setupTotal += LYZR_PRICING.create.kb;
  }

  setupTotal += kbIngestionCredits;
  if (kbStorageCredits !== null) {
    setupTotal += kbStorageCredits;
  }

  const setup: SetupCosts = {
    include: includeSetup,
    items: setupItems,
    kbIngestionTokens,
    kbIngestionCreditsC: roundUpToThousandth(kbIngestionCredits),
    kbStorageGBMonth,
    kbStorageCreditsC: kbStorageCredits !== null ? roundUpToThousandth(kbStorageCredits) : null,
    setupTotalC: roundUpToThousandth(setupTotal),
  };

  const maxCallsPerCategory = Math.max(
    lightInputs.pagesChecked,
    lightInputs.extraPages,
    lightInputs.knowledgeLookups,
    lightInputs.memorySteps,
    lightInputs.apiActions,
    lightInputs.safetyChecks,
    heavyInputs.pagesChecked,
    heavyInputs.extraPages,
    heavyInputs.knowledgeLookups,
    heavyInputs.memorySteps,
    heavyInputs.apiActions,
    heavyInputs.safetyChecks
  );

  const maxTokensPerUnit = Math.max(lightInputs.agentChatterTokens, heavyInputs.agentChatterTokens);

  return {
    scenario,
    unit,
    unitsPer30d,
    light: lightCalc,
    heavy: heavyCalc,
    setup,
    flags: {
      tokensSoftLimitPerUnit: maxTokensPerUnit >= 1000000,
      callCountSoftLimitPerUnit: maxCallsPerCategory > 20,
    },
    notes: 'Agent-action credits only; LLM/provider and external vendor/API fees are excluded. 30-day projection uses calendar days.',
  };
}

export function formatCreditDisplay(credits: number): string {
  return credits.toFixed(3);
}

export function formatUSDDisplay(credits: number): string {
  return `$${credits.toFixed(2)}`;
}

export function convertToOldPricing(creditsNew: number): { creditsOld: number; usd: number } {
  return {
    creditsOld: creditsNew * 100,
    usd: creditsNew * LYZR_PRICING.credit.usd,
  };
}
