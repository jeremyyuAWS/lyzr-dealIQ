import { useState, useEffect } from 'react';
import { DealSubmission } from '../types';
import { storage } from '../lib/storage';
import OpportunityAnalysis from './OpportunityAnalysis';
import CreditForecast from './CreditForecast';
import { generateOpportunityAnalysis, OpportunityAnalysisData } from '../utils/analysisGenerator';
import { creditPricing } from '../lib/creditPricing';
import { ChevronRight, TrendingUp, Clock, Building, Mail, Calendar, Sparkles, X, Settings, DollarSign, Save, Globe } from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '../lib/creditPricing';
import CreditPricingTable from './CreditPricingTable';

const SYNTHETIC_DEALS: DealSubmission[] = [
  {
    id: 'synth-1',
    requestor_name: 'Sarah Chen',
    requestor_email: 'sarah.chen@techcorp.com',
    company: 'TechCorp Financial',
    region: 'NA',
    business_unit: 'Fraud Detection',
    problem_statement: 'We need to reduce credit card fraud detection time from 48 hours to near real-time. Our current rule-based system misses 15% of fraudulent transactions and generates too many false positives, frustrating legitimate customers.',
    expected_outcomes: 'Reduce fraud detection time to under 5 minutes, improve fraud detection rate to 97%+, reduce false positives by 60%',
    target_production_date: '2025-04-15',
    preferred_path: 'Paid Pilot (3 months)',
    deployment_preference: ['Customer VPC (Cloud)'],
    data_privacy_requirements: ['PCI', 'US-only'],
    critical_integrations: ['Salesforce', 'Snowflake'],
    executive_sponsor_name: 'Michael Rodriguez',
    executive_sponsor_email: 'm.rodriguez@techcorp.com',
    budget_band: '$500k–$1M',
    deal_stage: 'Shortlist',
    competitors: 'DataRobot, H2O.ai',
    win_factors: 'Real-time processing, explainable AI for regulatory compliance, proven financial services experience',
    created_at: '2025-11-05T14:30:00Z',
  },
  {
    id: 'synth-2',
    requestor_name: 'James Mitchell',
    requestor_email: 'j.mitchell@healthplus.com',
    company: 'HealthPlus Medical',
    region: 'EMEA',
    business_unit: 'Patient Services',
    problem_statement: 'Patient intake process takes 45 minutes per patient with high error rates in eligibility verification. Staff manually check insurance coverage across 50+ providers, leading to billing issues and patient dissatisfaction.',
    expected_outcomes: 'Reduce intake time to 10 minutes, achieve 99% eligibility accuracy, improve patient satisfaction scores by 40%',
    target_production_date: '2025-05-01',
    preferred_path: 'Rapid Prototype (1 week)',
    deployment_preference: ['Customer VPC (Cloud)'],
    data_privacy_requirements: ['PHI', 'EU-only'],
    critical_integrations: ['Epic', 'ServiceNow'],
    executive_sponsor_name: 'Dr. Emily Watson',
    executive_sponsor_email: 'e.watson@healthplus.com',
    budget_band: '$250k–$500k',
    deal_stage: 'Prototype',
    competitors: 'None identified',
    win_factors: 'HIPAA compliance, healthcare domain expertise, rapid deployment',
    created_at: '2025-11-06T09:15:00Z',
  },
  {
    id: 'synth-3',
    requestor_name: 'Priya Sharma',
    requestor_email: 'priya.sharma@globalretail.com',
    company: 'Global Retail Solutions',
    region: 'India',
    business_unit: 'Sales Operations',
    problem_statement: 'Sales forecasting is highly inaccurate (30% error margin), relying on spreadsheets and gut feel. Leadership cannot make informed inventory decisions, leading to $2M in excess inventory costs quarterly.',
    expected_outcomes: 'Reduce forecast error to under 10%, automate forecast generation, provide real-time insights for 50+ regional managers',
    target_production_date: '2025-06-30',
    preferred_path: 'Paid Pilot (3 months)',
    deployment_preference: ['Lyzr SaaS'],
    data_privacy_requirements: ['Confidential'],
    critical_integrations: ['Salesforce', 'SAP', 'Snowflake'],
    executive_sponsor_name: 'Rajesh Kumar',
    executive_sponsor_email: 'r.kumar@globalretail.com',
    budget_band: '>$1M',
    deal_stage: 'Negotiation',
    competitors: 'Anaplan, Board',
    win_factors: 'AI-driven forecasting, easy-to-use interface, rapid time to value',
    created_at: '2025-11-04T16:45:00Z',
  },
  {
    id: 'synth-4',
    requestor_name: 'Marcus Johnson',
    requestor_email: 'marcus.j@innovatetech.io',
    company: 'InnovateTech Labs',
    region: 'NA',
    business_unit: 'IT Operations',
    problem_statement: 'IT support team is overwhelmed with 500+ tickets per week. 60% are repetitive questions about password resets, software access, and common issues. Response time averages 8 hours, impacting employee productivity.',
    expected_outcomes: 'Automate 70% of common support tickets, reduce response time to under 5 minutes for automated issues, free up IT team for strategic projects',
    target_production_date: '2025-03-20',
    preferred_path: 'Rapid Prototype (1 week)',
    deployment_preference: ['Customer VPC (Cloud)'],
    data_privacy_requirements: ['Confidential', 'US-only'],
    critical_integrations: ['ServiceNow', 'Microsoft SharePoint', 'Jira'],
    executive_sponsor_name: 'Lisa Thompson',
    executive_sponsor_email: 'l.thompson@innovatetech.io',
    budget_band: '$250k–$500k',
    deal_stage: 'RFP',
    competitors: 'Zendesk AI, Freshdesk',
    win_factors: 'Fast deployment, integration with existing systems, knowledge base automation',
    created_at: '2025-11-07T11:20:00Z',
  },
  {
    id: 'synth-5',
    requestor_name: 'Ana Rodriguez',
    requestor_email: 'ana.r@hrexcellence.com',
    company: 'HR Excellence Group',
    region: 'LATAM',
    business_unit: 'Human Resources',
    problem_statement: 'HR team spends 20 hours per week scheduling and conducting exit interviews, then manually analyzing responses. Insights are delayed by weeks, and retention issues are identified too late to act on.',
    expected_outcomes: 'Automate interview scheduling, provide real-time sentiment analysis, generate actionable retention insights weekly',
    target_production_date: '2025-05-15',
    preferred_path: 'Paid Pilot (3 months)',
    deployment_preference: ['Lyzr SaaS'],
    data_privacy_requirements: ['Confidential'],
    critical_integrations: ['Workday', 'Microsoft SharePoint'],
    executive_sponsor_name: 'Carlos Mendez',
    executive_sponsor_email: 'c.mendez@hrexcellence.com',
    budget_band: '$250k–$500k',
    deal_stage: 'Intro/Discovery',
    competitors: 'Glint, Culture Amp',
    win_factors: 'AI-driven insights, multilingual support, privacy-first approach',
    created_at: '2025-11-07T13:00:00Z',
  },
];

export default function AdminView() {
  const [deals, setDeals] = useState<DealSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<DealSubmission | null>(null);
  const [analysis, setAnalysis] = useState<OpportunityAnalysisData | null>(null);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const showSyntheticData = true;
  const [activeTab, setActiveTab] = useState<'analysis' | 'submission'>('analysis');
  const [showSettings, setShowSettings] = useState(false);
  const [creditRate, setCreditRate] = useState(creditPricing.getRate());
  const [creditNotes, setCreditNotes] = useState(creditPricing.getPricing().notes || '');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>(creditPricing.getCurrency());

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const realDeals = await storage.getAllSubmissions();
      const allDeals = [...SYNTHETIC_DEALS, ...realDeals];
      setDeals(allDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals(SYNTHETIC_DEALS);
    } finally {
      setLoading(false);
    }
  };


  const handleAnalyzeDeal = async (deal: DealSubmission) => {
    setSelectedDeal(deal);
    setGeneratingAnalysis(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysisData = generateOpportunityAnalysis(deal);
    setAnalysis(analysisData);
    setGeneratingAnalysis(false);
  };

  const handleCloseDeal = () => {
    setSelectedDeal(null);
    setAnalysis(null);
  };

  const handleSaveSettings = () => {
    creditPricing.setRate(creditRate, currency, creditNotes);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const getDealStageColor = (stage?: string) => {
    switch (stage) {
      case 'Closed-Won':
        return 'bg-green-100 text-green-700';
      case 'Negotiation':
      case 'Shortlist':
        return 'bg-blue-100 text-blue-700';
      case 'RFP':
      case 'Prototype':
        return 'bg-amber-100 text-amber-700';
      case 'Intro/Discovery':
        return 'bg-gray-100 text-gray-700';
      case 'Closed-Lost':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (selectedDeal) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-black">{selectedDeal.company || 'Deal Analysis'}</h2>
                <p className="text-sm text-gray-600">Submitted by {selectedDeal.requestor_name}</p>
              </div>
              <button
                onClick={handleCloseDeal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 stroke-black" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('analysis');
                  if (!analysis && !generatingAnalysis) {
                    handleAnalyzeDeal(selectedDeal);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Deal Analysis & Forecast
              </button>
              <button
                onClick={() => setActiveTab('submission')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'submission'
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Form Submission
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {activeTab === 'analysis' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-4">Problem Statement</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedDeal.problem_statement}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-black mb-4">Key Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 stroke-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Region</p>
                        <p className="text-sm font-medium text-black">{selectedDeal.region || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 stroke-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Target Date</p>
                        <p className="text-sm font-medium text-black">
                          {selectedDeal.target_production_date ? new Date(selectedDeal.target_production_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 stroke-gray-600 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Deal Stage</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDealStageColor(selectedDeal.deal_stage)}`}>
                          {selectedDeal.deal_stage || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {generatingAnalysis ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <Sparkles className="h-12 w-12 stroke-black mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-black mb-2">Generating AI Analysis...</h3>
                  <p className="text-gray-600">Analyzing opportunity, estimating agents, calculating costs</p>
                </div>
              ) : analysis ? (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="h-6 w-6 stroke-black" />
                    <h2 className="text-2xl font-bold text-black">AI-Generated Opportunity Analysis</h2>
                  </div>
                  <OpportunityAnalysis analysis={analysis} />

                  <div className="mt-8">
                    <CreditForecast
                      estimatedAgents={analysis.estimated_agents}
                      complexityLevel={analysis.complexity_level}
                      dealData={selectedDeal}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                  <p className="text-gray-600 mb-4">No analysis generated yet</p>
                  <button
                    onClick={() => handleAnalyzeDeal(selectedDeal)}
                    className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                  >
                    Generate Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'submission' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-black">Original Form Submission</h3>
                <p className="text-sm text-gray-600 mt-1">Complete data as submitted by the requestor</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requestor Name</label>
                    <p className="mt-1 text-black">{selectedDeal.requestor_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Requestor Email</label>
                    <p className="mt-1 text-black">{selectedDeal.requestor_email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Company</label>
                    <p className="mt-1 text-black">{selectedDeal.company || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Region</label>
                    <p className="mt-1 text-black">{selectedDeal.region || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Business Unit</label>
                    <p className="mt-1 text-black">{selectedDeal.business_unit || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Production Date</label>
                    <p className="mt-1 text-black">
                      {selectedDeal.target_production_date ? new Date(selectedDeal.target_production_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Problem Statement</label>
                  <p className="mt-2 text-black leading-relaxed">{selectedDeal.problem_statement || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expected Outcomes</label>
                  <p className="mt-2 text-black leading-relaxed">{selectedDeal.expected_outcomes || 'N/A'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Path</label>
                    <p className="mt-1 text-black">{selectedDeal.preferred_path || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Budget Band</label>
                    <p className="mt-1 text-black">{selectedDeal.budget_band || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deployment Preference</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDeal.deployment_preference && selectedDeal.deployment_preference.length > 0 ? (
                      selectedDeal.deployment_preference.map((dep, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                          {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Data Privacy Requirements</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDeal.data_privacy_requirements && selectedDeal.data_privacy_requirements.length > 0 ? (
                      selectedDeal.data_privacy_requirements.map((req, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {req}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Critical Integrations</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDeal.critical_integrations && selectedDeal.critical_integrations.length > 0 ? (
                      selectedDeal.critical_integrations.map((integration, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                          {integration}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">None specified</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Executive Sponsor Name</label>
                    <p className="mt-1 text-black">{selectedDeal.executive_sponsor_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Executive Sponsor Email</label>
                    <p className="mt-1 text-black">{selectedDeal.executive_sponsor_email || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deal Stage</label>
                    <div className="mt-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDealStageColor(selectedDeal.deal_stage)}`}>
                        {selectedDeal.deal_stage || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Submission Date</label>
                    <p className="mt-1 text-black">
                      {selectedDeal.created_at ? new Date(selectedDeal.created_at).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                </div>

                {selectedDeal.competitors && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Competitors</label>
                    <p className="mt-2 text-black">{selectedDeal.competitors}</p>
                  </div>
                )}

                {selectedDeal.win_factors && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Win Factors</label>
                    <p className="mt-2 text-black leading-relaxed">{selectedDeal.win_factors}</p>
                  </div>
                )}

                {selectedDeal.attachments && selectedDeal.attachments.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attachments</label>
                    <div className="mt-2 space-y-2">
                      {selectedDeal.attachments.map((attachment, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium text-black">{attachment.name}</p>
                          {attachment.type && <p className="text-xs text-gray-500 mt-1">Type: {attachment.type}</p>}
                          {attachment.description && <p className="text-sm text-gray-600 mt-1">{attachment.description}</p>}
                          {attachment.tags && attachment.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {attachment.tags.map((tag, tagIdx) => (
                                <span key={tagIdx} className="px-2 py-0.5 bg-white text-gray-600 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Deal Pipeline</h2>
            <p className="text-gray-600">Review and analyze submitted opportunities</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-black hover:border-gray-400 font-medium text-sm transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>

        {showSettings && (
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-300 rounded-2xl p-8 mb-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-3 shadow-lg">
                  <DollarSign className="h-8 w-8 stroke-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black mb-1">Credit Pricing & Currency Configuration</h3>
                  <p className="text-sm text-gray-600">Set custom credit rates and default currency for this account</p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 stroke-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-md">
                <label className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 stroke-blue-600" />
                  Currency Selection
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold cursor-pointer bg-blue-50"
                >
                  {CURRENCIES.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </option>
                  ))}
                </select>
                <div className="mt-3 bg-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-800"><strong>Selected:</strong> All cost displays will use <span className="font-bold">{CURRENCIES.find(c => c.code === currency)?.symbol} {currency}</span></p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-md">
                <label className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 stroke-purple-600" />
                  Rate per Credit
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-700 font-bold text-lg">
                    {CURRENCIES.find(c => c.code === currency)?.symbol}
                  </span>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={creditRate}
                    onChange={(e) => setCreditRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-bold bg-purple-50"
                    placeholder="0.01"
                  />
                </div>
                <div className="mt-3 bg-purple-100 rounded-lg p-3">
                  <p className="text-xs text-purple-800 font-semibold mb-2">Quick Set:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setCreditRate(0.015)}
                      className="px-2 py-1.5 bg-white hover:bg-purple-200 rounded text-xs font-medium border-2 border-purple-300 transition-colors"
                    >
                      0.015
                    </button>
                    <button
                      onClick={() => setCreditRate(0.01)}
                      className="px-2 py-1.5 bg-white hover:bg-purple-200 rounded text-xs font-medium border-2 border-purple-300 transition-colors"
                    >
                      0.010
                    </button>
                    <button
                      onClick={() => setCreditRate(0.007)}
                      className="px-2 py-1.5 bg-white hover:bg-purple-200 rounded text-xs font-medium border-2 border-purple-300 transition-colors"
                    >
                      0.007
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-300 shadow-md">
                <label className="text-sm font-semibold text-green-900 mb-3 block">
                  💰 Live Cost Preview
                </label>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-700 mb-1">100 credits</p>
                    <p className="text-2xl font-bold text-green-900">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}{(100 * creditRate).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-700 mb-1">1,000 credits</p>
                    <p className="text-2xl font-bold text-green-900">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}{(1000 * creditRate).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-green-700 mb-1">10,000 credits</p>
                    <p className="text-2xl font-bold text-green-900">
                      {CURRENCIES.find(c => c.code === currency)?.symbol}{(10000 * creditRate).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 mb-6 border-2 border-gray-200">
              <label className="text-sm font-semibold text-gray-800 mb-3 block">
                📝 Account Notes
              </label>
              <textarea
                value={creditNotes}
                onChange={(e) => setCreditNotes(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                rows={3}
                placeholder="e.g., Enterprise tier customer, annual contract discount applied, special volume pricing..."
              />
            </div>

            <div className="flex items-center justify-between pt-6 border-t-2 border-gray-300">
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-3">
                <p className="text-sm text-yellow-900">
                  <strong>💡 Remember:</strong> Click <strong>Save Settings</strong> to apply changes across all calculators
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={settingsSaved}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  settingsSaved
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                }`}
              >
                {settingsSaved ? (
                  <>
                    <Save className="h-5 w-5" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

            <div className="mt-8">
              <CreditPricingTable />
            </div>
          </div>
        )}

        {deals.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-600">No deals submitted yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handleAnalyzeDeal(deal)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-black">{deal.company || 'Unnamed Company'}</h3>
                      {deal.deal_stage && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDealStageColor(deal.deal_stage)}`}>
                          {deal.deal_stage}
                        </span>
                      )}
                      {deal.budget_band && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {deal.budget_band}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{deal.problem_statement}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{deal.requestor_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>{deal.region || 'No region'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Target: {deal.target_production_date ? new Date(deal.target_production_date).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Submitted: {deal.created_at ? new Date(deal.created_at).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {deal.critical_integrations && deal.critical_integrations.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {deal.critical_integrations.slice(0, 4).map((integration, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                            {integration}
                          </span>
                        ))}
                        {deal.critical_integrations.length > 4 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg">
                            +{deal.critical_integrations.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button className="flex-shrink-0 ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="h-6 w-6 stroke-black" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
