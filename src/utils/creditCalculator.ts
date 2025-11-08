import { DealSubmission } from '../types';

export interface CreditEstimate {
  total_credits: number;
  breakdown: {
    prototype_phase: number;
    pilot_phase: number;
    production_monthly: number;
  };
  factors: {
    agent_count: number;
    integration_complexity: number;
    data_volume_multiplier: number;
  };
}

export interface TimelineEstimate {
  total_weeks: number;
  phases: {
    name: string;
    weeks: number;
    description: string;
  }[];
}

export function calculateCredits(deal: DealSubmission, estimatedAgents: number): CreditEstimate {
  const baseCreditsPerAgent = 50000;
  const integrationMultiplier = 1 + ((deal.critical_integrations?.length || 0) * 0.15);

  const dataComplexity = deal.data_privacy_requirements?.some(req =>
    req === 'PHI' || req === 'PCI' || req === 'Confidential'
  ) ? 1.3 : 1.0;

  const agentCredits = estimatedAgents * baseCreditsPerAgent;
  const prototypeCredits = Math.round(agentCredits * 0.3);
  const pilotCredits = Math.round(agentCredits * 0.7 * integrationMultiplier);
  const productionMonthly = Math.round(agentCredits * integrationMultiplier * dataComplexity);

  return {
    total_credits: prototypeCredits + pilotCredits + (productionMonthly * 3),
    breakdown: {
      prototype_phase: prototypeCredits,
      pilot_phase: pilotCredits,
      production_monthly: productionMonthly,
    },
    factors: {
      agent_count: estimatedAgents,
      integration_complexity: integrationMultiplier,
      data_volume_multiplier: dataComplexity,
    },
  };
}

export function calculateTimeline(deal: DealSubmission, complexity: string): TimelineEstimate {
  const phases = [];

  if (deal.preferred_path === 'Rapid Prototype (1 week)') {
    phases.push({
      name: 'Rapid Prototype',
      weeks: 1,
      description: 'Quick proof of concept with core functionality'
    });
    phases.push({
      name: 'Feedback & Iteration',
      weeks: 1,
      description: 'Gather stakeholder feedback and refine approach'
    });
    phases.push({
      name: 'Development',
      weeks: complexity === 'Very High' ? 12 : complexity === 'High' ? 10 : complexity === 'Medium' ? 8 : 6,
      description: 'Full agent development and integration'
    });
  } else {
    phases.push({
      name: 'Discovery & Planning',
      weeks: 2,
      description: 'Requirements gathering and technical design'
    });
    phases.push({
      name: 'Pilot Development',
      weeks: complexity === 'Very High' ? 10 : complexity === 'High' ? 8 : complexity === 'Medium' ? 6 : 4,
      description: 'Build core agents and integrations for pilot'
    });
    phases.push({
      name: 'Pilot Testing',
      weeks: 4,
      description: 'User testing, feedback, and optimization'
    });
  }

  phases.push({
    name: 'Production Hardening',
    weeks: 3,
    description: 'Security review, performance tuning, deployment prep'
  });

  phases.push({
    name: 'Deployment & Support',
    weeks: 2,
    description: 'Production rollout and initial support'
  });

  const totalWeeks = phases.reduce((sum, phase) => sum + phase.weeks, 0);

  return {
    total_weeks: totalWeeks,
    phases,
  };
}

export interface ResponsibleAIFeatures {
  required: string[];
  recommended: string[];
}

export function getResponsibleAIFeatures(deal: DealSubmission): ResponsibleAIFeatures {
  const required: string[] = [];
  const recommended: string[] = [];

  if (deal.data_privacy_requirements?.includes('PHI')) {
    required.push('HIPAA Compliance Module');
    required.push('Audit Logging & Traceability');
    required.push('Data Encryption at Rest & Transit');
  }

  if (deal.data_privacy_requirements?.includes('PCI')) {
    required.push('PCI-DSS Compliance Controls');
    required.push('Secure Data Masking');
    required.push('Access Control & Authentication');
  }

  if (deal.data_privacy_requirements?.includes('PII') || deal.data_privacy_requirements?.includes('Confidential')) {
    required.push('Data Privacy Controls');
    required.push('Role-Based Access Control (RBAC)');
  }

  if (deal.data_privacy_requirements?.includes('EU-only')) {
    required.push('GDPR Compliance Framework');
    required.push('Data Residency Controls (EU)');
    required.push('Right to Deletion Support');
  }

  if (deal.deployment_preference?.includes('On-Prem')) {
    recommended.push('On-Premise Security Hardening');
    recommended.push('Network Isolation Controls');
  }

  required.push('Explainable AI Decisions');
  required.push('Bias Detection & Monitoring');

  recommended.push('Human-in-the-Loop (HITL) Review Workflows');
  recommended.push('Confidence Scoring for Recommendations');
  recommended.push('Continuous Model Performance Monitoring');
  recommended.push('Ethical AI Guidelines Enforcement');

  return {
    required: Array.from(new Set(required)),
    recommended: Array.from(new Set(recommended)),
  };
}
