import { DealSubmission } from '../types';

export interface Scenario {
  name: string;
  color: string;
  data: Partial<DealSubmission>;
}

export const SCENARIOS: Scenario[] = [
  {
    name: 'Credit Card Dispute AI',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
    data: {
      requestor_name: 'Rachel M. Okafor',
      requestor_email: 'rachel.okafor@firstsource.com',
      company: 'BMO Bank',
      region: 'NA',
      business_unit: 'Digital Banking & Fraud Operations',
      problem_statement: 'Credit card dispute processing takes 7-10 days with high manual effort for fraud validation and documentation. Customer service agents spend 40% of time on repetitive data entry and status updates. Current systems lack integration between fraud detection, dispute intake, and resolution workflows, leading to compliance gaps and customer frustration with opaque processes.',
      expected_outcomes: 'Reduce dispute resolution time to under 48 hours, automate 70% of routine dispute validation, achieve 95% fraud detection accuracy, ensure 100% compliance traceability for Canadian banking regulations, improve customer satisfaction scores by 35%',
      target_production_date: '2025-09-01',
      preferred_path: 'Paid Pilot (3 months)',
      deployment_preference: ['On-Prem'],
      data_privacy_requirements: ['PII', 'PCI', 'Confidential'],
      data_notes: 'Must comply with OSFI (Office of the Superintendent of Financial Institutions) and PIPEDA regulations. All data processing must occur within Canadian borders.',
      critical_integrations: ['Salesforce', 'Oracle', 'Other'],
      integration_notes: 'Core banking system integration (Temenos), fraud detection system (FICO Falcon), and dispute management platform. Requires real-time API access and event streaming.',
      executive_sponsor_name: 'David Chen',
      executive_sponsor_email: 'david.chen@bmo.com',
      budget_band: '$500k–$1M',
      competitors: 'NICE Actimize, FICO Decision Management, IBM Watson AIOps',
      deal_stage: 'RFP',
      win_factors: 'Explainable AI decisions for regulatory compliance, conversational dispute intake with HITL review, proven Canadian banking expertise, seamless core banking integration',
      attachments: [
        {
          type: 'file',
          name: 'Dispute_Process_Flow.pptx',
          url: '#',
          size: 2458000,
          displayName: 'Current Dispute Resolution Process',
          description: 'PowerPoint presentation showing the existing 10-day dispute workflow with manual touchpoints',
          tags: ['Process Flow', 'Current State']
        },
        {
          type: 'file',
          name: 'Fraud_Detection_Stats_Q3.pdf',
          url: '#',
          size: 1245000,
          displayName: 'Q3 Fraud Detection Performance',
          description: 'Quarterly report on fraud detection accuracy and false positive rates',
          tags: ['Metrics', 'Fraud']
        },
        {
          type: 'url',
          name: 'https://bmo.com/compliance/osfi-guidelines',
          url: 'https://bmo.com/compliance/osfi-guidelines',
          displayName: 'OSFI Compliance Requirements',
          description: 'Link to internal compliance documentation for Canadian banking regulations',
          tags: ['Compliance', 'Reference']
        },
        {
          type: 'file',
          name: 'meeting_notes_2025-10-15.txt',
          url: '#',
          size: 12400,
          displayName: 'Stakeholder Meeting Notes - Oct 15',
          description: 'Notes from kickoff meeting with fraud ops team discussing pain points and requirements',
          tags: ['Meeting Notes', 'Requirements']
        }
      ]
    }
  },
  {
    name: 'IT Support Knowledge Base AI',
    color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300',
    data: {
      requestor_name: 'Kenji Watanabe',
      requestor_email: 'kenji.watanabe@movate.com',
      company: 'Global Technology Services Inc',
      region: 'APAC',
      business_unit: 'IT Service Management',
      problem_statement: 'IT support teams lack current, accurate knowledge articles leading to 60% ticket escalation rate. Manual KB maintenance is reactive and knowledge gaps are discovered only after incidents. Support agents spend 45 minutes per complex ticket searching multiple sources. Web-based solutions and vendor documentation updates are not monitored proactively.',
      expected_outcomes: 'Reduce ticket escalation by 40%, decrease average handle time from 45 to 20 minutes, identify and fill 80% of knowledge gaps automatically, achieve 90% first-contact resolution rate, create 100+ new articles per quarter autonomously',
      target_production_date: '2025-08-15',
      preferred_path: 'Rapid Prototype (1 week)',
      deployment_preference: ['Customer VPC (Cloud)'],
      data_privacy_requirements: ['Confidential'],
      data_notes: 'Corporate IT documentation contains proprietary system configurations and security protocols. No external data sharing permitted.',
      critical_integrations: ['ServiceNow', 'Confluence', 'Jira'],
      integration_notes: 'Deep ServiceNow integration for ticket analysis, incident trends, and KB publishing. Confluence for knowledge repository and Jira for enhancement tracking.',
      executive_sponsor_name: 'Lisa Thompson',
      executive_sponsor_email: 'lisa.thompson@globaltech.com',
      budget_band: '$250k–$500k',
      competitors: 'ServiceNow Virtual Agent, Zendesk Answer Bot, Moveworks',
      deal_stage: 'Prototype',
      win_factors: 'Proactive content monitoring and gap detection, confidence scoring for automation readiness, seamless ServiceNow integration, learns from query patterns',
      attachments: [
        {
          type: 'file',
          name: 'IT_Support_Metrics_Dashboard.pdf',
          url: '#',
          size: 3200000,
          displayName: 'Current IT Support Performance Metrics',
          description: 'Dashboard export showing ticket volume, escalation rates, and resolution times',
          tags: ['Metrics', 'Baseline']
        },
        {
          type: 'url',
          name: 'https://globaltech.atlassian.net/wiki/spaces/KB',
          url: 'https://globaltech.atlassian.net/wiki/spaces/KB',
          displayName: 'Existing Knowledge Base',
          description: 'Link to current Confluence KB with 500+ articles',
          tags: ['Knowledge Base', 'Reference']
        },
        {
          type: 'file',
          name: 'Sample_Tickets_Analysis.xlsx',
          url: '#',
          size: 845000,
          displayName: 'Sample Ticket Analysis',
          description: 'Excel workbook with 1000 sample tickets analyzed for common patterns',
          tags: ['Data', 'Analysis']
        }
      ]
    }
  },
  {
    name: 'Patient Intake & Eligibility',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
    data: {
      requestor_name: 'Aditi Menon',
      requestor_email: 'aditi.menon@aws.com',
      company: 'Regional Healthcare Network',
      region: 'NA',
      business_unit: 'Patient Access & Revenue Cycle',
      problem_statement: 'Patient intake requires 15-20 minutes of staff time collecting insurance details, verifying eligibility, and manual EHR data entry. Eligibility verification happens after appointment booking leading to 25% denial rate. Missing or incorrect insurance information causes revenue cycle delays averaging 45 days. Staff burnout from repetitive data entry tasks.',
      expected_outcomes: 'Reduce intake time to under 5 minutes, achieve 98% eligibility verification accuracy before appointment, decrease claim denials by 60%, improve staff satisfaction by 40%, accelerate revenue collection by 30 days',
      target_production_date: '2025-10-01',
      preferred_path: 'Paid Pilot (3 months)',
      deployment_preference: ['Customer VPC (Cloud)'],
      data_privacy_requirements: ['PHI', 'PII', 'US-only'],
      data_notes: 'HIPAA compliance mandatory. All PHI must be encrypted at rest and in transit. BAA required. Integration with Epic EHR requires certified interface.',
      critical_integrations: ['Other'],
      integration_notes: 'Epic EHR (HL7/FHIR), Availity for payer eligibility verification, Waystar for coverage discovery. Real-time API integration required.',
      executive_sponsor_name: 'Dr. Maria Rodriguez',
      executive_sponsor_email: 'maria.rodriguez@regionalhealthcare.org',
      budget_band: '>$1M',
      competitors: 'Olive AI, Notable Health, Hyro',
      deal_stage: 'Shortlist',
      win_factors: 'Real-time eligibility verification, automated EHR pre-population, HIPAA-native architecture, intelligent exception handling with HITL queue',
      attachments: [
        {
          type: 'file',
          name: 'Patient_Journey_Map.pptx',
          url: '#',
          size: 5600000,
          displayName: 'Patient Intake Journey Map',
          description: 'Detailed patient journey showing 20-minute intake process with pain points',
          tags: ['Process', 'Patient Experience']
        },
        {
          type: 'file',
          name: 'HIPAA_BAA_Template.docx',
          url: '#',
          size: 185000,
          displayName: 'HIPAA BAA Template',
          description: 'Standard Business Associate Agreement template required for vendor engagement',
          tags: ['Legal', 'Compliance']
        },
        {
          type: 'file',
          name: 'Denial_Analysis_Report.pdf',
          url: '#',
          size: 980000,
          displayName: 'Claim Denial Root Cause Analysis',
          description: 'Analysis of 25% denial rate showing eligibility verification gaps',
          tags: ['Analysis', 'Revenue Cycle']
        }
      ]
    }
  },
  {
    name: 'Loan Application Assistant',
    color: 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-300',
    data: {
      requestor_name: 'Derrick Shaw',
      requestor_email: 'derrick.shaw@nvidia.com',
      company: 'First National Consumer Finance',
      region: 'NA',
      business_unit: 'Consumer Lending',
      problem_statement: 'Loan application process takes 45-60 minutes with high abandonment rate of 40% before completion. Applicants struggle with complex financial terminology and regulatory disclosures. Manual eligibility pre-screening happens after full application submission wasting customer and staff time. Limited support for non-English speaking applicants.',
      expected_outcomes: 'Reduce application time to 15 minutes, decrease abandonment rate to under 15%, achieve 90% eligibility pre-qualification accuracy, support 5 languages (English, Spanish, Mandarin, French, Hindi), improve approval rates by 25%',
      target_production_date: '2025-07-15',
      preferred_path: 'Rapid Prototype (1 week)',
      deployment_preference: ['Lyzr SaaS', 'Customer VPC (Cloud)'],
      data_privacy_requirements: ['PII', 'US-only'],
      data_notes: 'Must comply with FCRA, ECOA, and state-specific lending regulations. Adverse action notices required for denials with clear explanation.',
      critical_integrations: ['Salesforce', 'Other'],
      integration_notes: 'Experian and TransUnion credit bureau APIs, Salesforce Financial Services Cloud, LOS (Loan Origination System), compliance documentation system.',
      executive_sponsor_name: 'Michael Patterson',
      executive_sponsor_email: 'michael.patterson@firstnational.com',
      budget_band: '$500k–$1M',
      competitors: 'Blend, Roostify, nCino',
      deal_stage: 'Intro/Discovery',
      win_factors: 'Conversational multilingual interface, transparent eligibility scoring with explanations, real-time credit bureau integration, regulatory disclosure management',
      attachments: [
        {
          type: 'file',
          name: 'Loan_Application_Current_Form.pdf',
          url: '#',
          size: 425000,
          displayName: 'Current Loan Application Form',
          description: '18-page loan application form causing 40% abandonment rate',
          tags: ['Current State', 'Form']
        },
        {
          type: 'file',
          name: 'Abandonment_Analysis.xlsx',
          url: '#',
          size: 650000,
          displayName: 'Application Abandonment Analysis',
          description: 'Drop-off analysis showing where and why applicants abandon the process',
          tags: ['Analysis', 'Metrics']
        },
        {
          type: 'url',
          name: 'https://firstnational.com/compliance/lending-regulations',
          url: 'https://firstnational.com/compliance/lending-regulations',
          displayName: 'Lending Compliance Guidelines',
          description: 'Internal compliance documentation for FCRA, ECOA, and state regulations',
          tags: ['Compliance', 'Reference']
        }
      ]
    }
  },
  {
    name: 'HR Exit Interview Manager',
    color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-300',
    data: {
      requestor_name: 'Isabella Duarte',
      requestor_email: 'isabella.duarte@nvidia.com',
      company: 'Global Workforce Solutions',
      region: 'EMEA',
      business_unit: 'Human Resources & Talent Management',
      problem_statement: 'Exit interviews are inconsistently conducted with only 40% completion rate. Manual interview notes lack standardization making trend analysis impossible. HR teams spend hours transcribing and categorizing feedback. Critical cultural insights and attrition patterns are missed due to lack of systematic analysis. No proactive identification of at-risk departments or managers.',
      expected_outcomes: 'Achieve 85% exit interview completion rate, automate sentiment classification with 90% accuracy, generate monthly attrition trend reports automatically, identify cultural risk factors 3 months earlier, reduce HR administrative time by 50%',
      target_production_date: '2025-09-30',
      preferred_path: 'Paid Pilot (3 months)',
      deployment_preference: ['Customer VPC (Cloud)'],
      data_privacy_requirements: ['PII', 'Confidential', 'EU-only'],
      data_notes: 'GDPR compliance required. Employee data must be anonymized for trend analysis. Data residency in EU datacenters mandatory. Right to deletion must be supported.',
      critical_integrations: ['Workday', 'Microsoft SharePoint'],
      integration_notes: 'Workday HCM for employee records and offboarding workflows, Microsoft Teams for voice-enabled interviews, SharePoint for document management.',
      executive_sponsor_name: 'Thomas Bergström',
      executive_sponsor_email: 'thomas.bergstrom@globalworkforce.eu',
      budget_band: '$250k–$500k',
      competitors: 'Qualtrics XM, Culture Amp, Peakon',
      deal_stage: 'Negotiation',
      win_factors: 'Voice-enabled empathetic interview experience, automated sentiment clustering, anonymized insights dashboards, GDPR-compliant data handling',
      attachments: [
        {
          type: 'file',
          name: 'Exit_Interview_Template.docx',
          url: '#',
          size: 95000,
          displayName: 'Current Exit Interview Template',
          description: 'Standard exit interview questionnaire with 40% completion rate',
          tags: ['Template', 'Current State']
        },
        {
          type: 'file',
          name: 'Attrition_Trends_2024.pptx',
          url: '#',
          size: 3100000,
          displayName: '2024 Attrition Trends Report',
          description: 'Annual attrition analysis showing department-level patterns',
          tags: ['Trends', 'Analysis']
        },
        {
          type: 'file',
          name: 'gdpr_requirements.txt',
          url: '#',
          size: 15600,
          displayName: 'GDPR Data Handling Requirements',
          description: 'Notes on GDPR compliance requirements for employee exit data',
          tags: ['GDPR', 'Compliance']
        }
      ]
    }
  },
  {
    name: 'Sales Forecasting Copilot',
    color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-300',
    data: {
      requestor_name: 'Ethan Caldwell',
      requestor_email: 'ethan.caldwell@aws.com',
      company: 'Enterprise Software Corp',
      region: 'NA',
      business_unit: 'Sales Operations & Revenue Planning',
      problem_statement: 'Quarterly revenue forecasting relies on manual spreadsheet analysis taking 2 weeks per quarter. Sales leadership lacks confidence in forecast accuracy averaging 30% variance from actuals. Historical deal patterns and seasonality factors are not systematically incorporated. No automated outlier detection for at-risk deals. Limited scenario planning capabilities for strategic decisions.',
      expected_outcomes: 'Reduce forecasting time from 2 weeks to 2 days, improve forecast accuracy to within 10% variance, detect 95% of at-risk deals automatically, enable real-time scenario planning, increase revenue predictability by 40%',
      target_production_date: '2025-06-30',
      preferred_path: 'Rapid Prototype (1 week)',
      deployment_preference: ['Customer VPC (Cloud)'],
      data_privacy_requirements: ['Confidential'],
      data_notes: 'Sales pipeline data contains competitive insights and customer contract details. No third-party data sharing permitted.',
      critical_integrations: ['Salesforce', 'Snowflake'],
      integration_notes: 'Salesforce for CRM data and opportunity tracking, Snowflake for historical data warehouse, Tableau for visualization dashboards, AWS Forecast API.',
      executive_sponsor_name: 'Jennifer Walsh',
      executive_sponsor_email: 'jennifer.walsh@enterprisesoftware.com',
      budget_band: '$500k–$1M',
      competitors: 'Clari, BoostUp, Aviso AI',
      deal_stage: 'RFP',
      win_factors: 'ML-powered historical pattern analysis, confidence scoring with explainability, real-time outlier detection, configurable scenario planning dashboards',
      attachments: [
        {
          type: 'file',
          name: 'Sales_Forecast_Methodology.pdf',
          url: '#',
          size: 1850000,
          displayName: 'Current Forecasting Methodology',
          description: 'Documentation of existing manual forecasting process and spreadsheet models',
          tags: ['Process', 'Current State']
        },
        {
          type: 'file',
          name: 'Historical_Forecast_Accuracy.xlsx',
          url: '#',
          size: 1200000,
          displayName: 'Historical Forecast vs Actuals',
          description: '3 years of forecast accuracy data showing 30% average variance',
          tags: ['Historical Data', 'Accuracy']
        },
        {
          type: 'url',
          name: 'https://enterprisesoftware.tableau.com/sales-dashboard',
          url: 'https://enterprisesoftware.tableau.com/sales-dashboard',
          displayName: 'Current Sales Dashboard',
          description: 'Link to existing Tableau sales pipeline dashboard',
          tags: ['Dashboard', 'Reference']
        },
        {
          type: 'file',
          name: 'rfp_requirements.docx',
          url: '#',
          size: 340000,
          displayName: 'RFP Requirements Document',
          description: 'Formal RFP with technical requirements and evaluation criteria',
          tags: ['RFP', 'Requirements']
        }
      ]
    }
  }
];
