/*
  # Create Opportunity Analysis Table

  1. New Tables
    - `opportunity_analysis`
      - `id` (uuid, primary key) - Unique identifier for the analysis
      - `deal_submission_id` (uuid, foreign key) - References the deal submission
      - `analysis_date` (timestamptz) - When the analysis was generated
      - `opportunity_score` (integer) - Overall opportunity score (0-100)
      - `complexity_level` (text) - Low, Medium, High, Very High
      - `estimated_agents` (integer) - Number of AI agents needed
      - `agent_details` (jsonb) - Detailed breakdown of agents and their roles
      - `tool_calling_required` (boolean) - Whether tool calling is needed
      - `tool_details` (jsonb) - Details of tools needed
      - `mcp_servers_required` (boolean) - Whether MCP servers are needed
      - `mcp_details` (jsonb) - Details of MCP servers
      - `estimated_level_of_effort` (text) - Small, Medium, Large, Extra Large
      - `estimated_hours` (integer) - Total estimated hours
      - `scope_of_work` (text) - Detailed scope description
      - `estimated_cost_min` (numeric) - Minimum estimated cost
      - `estimated_cost_max` (numeric) - Maximum estimated cost
      - `key_technical_requirements` (jsonb) - Array of technical requirements
      - `risk_factors` (jsonb) - Array of identified risks
      - `recommended_approach` (text) - Recommended implementation approach
      - `timeline_estimate_weeks` (integer) - Estimated timeline in weeks
      - `created_at` (timestamptz) - Timestamp of record creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `opportunity_analysis` table
    - Add policy for authenticated users to read all analysis
    - Add policy for authenticated users to insert/update analysis
*/

CREATE TABLE IF NOT EXISTS opportunity_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_submission_id uuid REFERENCES deal_submissions(id) ON DELETE CASCADE,
  analysis_date timestamptz DEFAULT now(),
  opportunity_score integer CHECK (opportunity_score >= 0 AND opportunity_score <= 100),
  complexity_level text CHECK (complexity_level IN ('Low', 'Medium', 'High', 'Very High')),
  estimated_agents integer DEFAULT 0,
  agent_details jsonb DEFAULT '[]'::jsonb,
  tool_calling_required boolean DEFAULT false,
  tool_details jsonb DEFAULT '[]'::jsonb,
  mcp_servers_required boolean DEFAULT false,
  mcp_details jsonb DEFAULT '[]'::jsonb,
  estimated_level_of_effort text CHECK (estimated_level_of_effort IN ('Small', 'Medium', 'Large', 'Extra Large')),
  estimated_hours integer DEFAULT 0,
  scope_of_work text,
  estimated_cost_min numeric(10, 2),
  estimated_cost_max numeric(10, 2),
  key_technical_requirements jsonb DEFAULT '[]'::jsonb,
  risk_factors jsonb DEFAULT '[]'::jsonb,
  recommended_approach text,
  timeline_estimate_weeks integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE opportunity_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all analysis"
  ON opportunity_analysis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert analysis"
  ON opportunity_analysis
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update analysis"
  ON opportunity_analysis
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_deal_submission
  ON opportunity_analysis(deal_submission_id);

CREATE INDEX IF NOT EXISTS idx_opportunity_analysis_opportunity_score
  ON opportunity_analysis(opportunity_score DESC);
