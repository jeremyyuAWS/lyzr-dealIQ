export interface DealSubmission {
  id?: string;
  requestor_name: string;
  requestor_email: string;
  company?: string;
  region?: string;
  business_unit?: string;
  problem_statement: string;
  expected_outcomes: string;
  target_production_date: string;
  preferred_path?: string;
  deployment_preference?: string[];
  data_privacy_requirements?: string[];
  data_notes?: string;
  critical_integrations?: string[];
  integration_notes?: string;
  executive_sponsor_name?: string;
  executive_sponsor_email?: string;
  budget_band?: string;
  competitors?: string;
  deal_stage?: string;
  win_factors?: string;
  attachments?: Array<{
    type: 'file' | 'url';
    name: string;
    url: string;
    size?: number;
    displayName?: string;
    description?: string;
    tags?: string[];
  }>;
  created_at?: string;
  updated_at?: string;
}
