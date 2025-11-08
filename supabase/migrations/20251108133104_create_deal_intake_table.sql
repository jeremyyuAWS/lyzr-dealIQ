/*
  # Lyzr Deal Intake System

  1. New Tables
    - `deal_submissions`
      - `id` (uuid, primary key) - Unique identifier
      - `requestor_name` (text) - Name of person submitting
      - `requestor_email` (text) - Email with validation
      - `company` (text) - Company name
      - `region` (text) - Geographic region
      - `business_unit` (text) - Business unit or department
      - `problem_statement` (text) - Business pain description
      - `expected_outcomes` (text) - Success metrics
      - `target_production_date` (date) - When they want to go live
      - `preferred_path` (text) - Rapid Prototype or Paid Pilot
      - `deployment_preference` (text[]) - Array of deployment options
      - `data_privacy_requirements` (text[]) - Array of compliance needs
      - `data_notes` (text) - Additional data context
      - `critical_integrations` (text[]) - Array of integration needs
      - `integration_notes` (text) - Additional integration context
      - `executive_sponsor_name` (text) - Sponsor name
      - `executive_sponsor_email` (text) - Sponsor email
      - `budget_band` (text) - Budget range
      - `competitors` (text) - Competitor list
      - `deal_stage` (text) - Current stage in pipeline
      - `win_factors` (text) - Key reasons to choose Lyzr
      - `attachments` (jsonb) - Array of file/link objects
      - `created_at` (timestamptz) - Submission timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `deal_submissions` table
    - Add policy for public inserts (form submissions)
    - Add policy for authenticated reads (internal dashboard)
*/

CREATE TABLE IF NOT EXISTS deal_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requestor_name text NOT NULL,
  requestor_email text NOT NULL,
  company text,
  region text,
  business_unit text,
  problem_statement text NOT NULL,
  expected_outcomes text NOT NULL,
  target_production_date date NOT NULL,
  preferred_path text,
  deployment_preference text[] DEFAULT '{}',
  data_privacy_requirements text[] DEFAULT '{}',
  data_notes text,
  critical_integrations text[] DEFAULT '{}',
  integration_notes text,
  executive_sponsor_name text,
  executive_sponsor_email text,
  budget_band text,
  competitors text,
  deal_stage text,
  win_factors text,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE deal_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit deals"
  ON deal_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all deals"
  ON deal_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_deal_submissions_created_at ON deal_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_submissions_region ON deal_submissions(region);
CREATE INDEX IF NOT EXISTS idx_deal_submissions_deal_stage ON deal_submissions(deal_stage);