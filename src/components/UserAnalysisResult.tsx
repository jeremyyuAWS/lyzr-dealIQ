import { useState, useEffect } from 'react';
import { DealSubmission } from '../types';
import { generateOpportunityAnalysis, OpportunityAnalysisData } from '../utils/analysisGenerator';
import { calculateCredits, calculateTimeline, getResponsibleAIFeatures, CreditEstimate, TimelineEstimate, ResponsibleAIFeatures } from '../utils/creditCalculator';
import { Sparkles, Brain, Zap, Clock, Shield, CheckCircle, TrendingUp, AlertCircle, Users, Network, Calculator, Mail, Download, Send } from 'lucide-react';
import CreditForecast from './CreditForecast';

interface UserAnalysisResultProps {
  dealData: DealSubmission;
  emailRequested?: boolean;
  onClose: () => void;
}

export default function UserAnalysisResult({ dealData, emailRequested = false, onClose }: UserAnalysisResultProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysis, setAnalysis] = useState<OpportunityAnalysisData | null>(null);
  const [credits, setCredits] = useState<CreditEstimate | null>(null);
  const [timeline, setTimeline] = useState<TimelineEstimate | null>(null);
  const [aiFeatures, setAiFeatures] = useState<ResponsibleAIFeatures | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator'>('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    const steps = [
      { progress: 20, message: 'Analyzing requirements...' },
      { progress: 40, message: 'Determining agent architecture...' },
      { progress: 60, message: 'Calculating resource needs...' },
      { progress: 80, message: 'Estimating timeline & costs...' },
      { progress: 100, message: 'Generating recommendations...' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    const analysisResult = generateOpportunityAnalysis(dealData);
    const creditEstimate = calculateCredits(dealData, analysisResult.estimated_agents);
    const timelineEstimate = calculateTimeline(dealData, analysisResult.complexity_level);
    const responsibleAI = getResponsibleAIFeatures(dealData);

    setAnalysis(analysisResult);
    setCredits(creditEstimate);
    setTimeline(timelineEstimate);
    setAiFeatures(responsibleAI);
    setIsAnalyzing(false);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('PDF download feature will be implemented with a backend service. For demo purposes, this simulates the download process.');
    setIsDownloading(false);
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEmailSent(true);
    setIsSendingEmail(false);
    setTimeout(() => setEmailSent(false), 5000);
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-16 w-16 stroke-black animate-pulse" />
              <div className="absolute inset-0 bg-black opacity-10 blur-xl animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-black text-center mb-4">
            Analyzing Your Opportunity
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Our AI agents are processing your submission to provide a comprehensive analysis
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-black h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center text-sm text-gray-500">{progress}% Complete</p>
        </div>
      </div>
    );
  }

  if (!analysis || !credits || !timeline || !aiFeatures) return null;

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'High': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Very High': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img src="/lyzr-logo-cut.png" alt="Lyzr" className="h-8" />
              <div>
                <h1 className="text-xl font-bold text-black">Your Project Analysis</h1>
                <p className="text-sm text-gray-600">AI-powered feasibility and cost estimate</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-black rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || emailSent}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailSent ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {isSendingEmail ? 'Sending...' : 'Email Report'}
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Project Overview
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'calculator'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Calculator className="h-4 w-4" />
              Credit Calculator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {emailRequested && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl p-5 mb-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 rounded-full p-2 mt-0.5">
                <Mail className="h-5 w-5 stroke-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Report Sent to Your Inbox</h3>
                <p className="text-sm text-blue-800 mb-2">
                  A detailed PDF analysis report has been emailed to <span className="font-semibold">{dealData.requestor_email}</span>
                </p>
                <div className="bg-white/60 rounded-lg p-3 mt-3">
                  <p className="text-xs text-blue-700">
                    <strong>What's included:</strong> Opportunity score, complexity analysis, agent architecture recommendations, timeline estimates, and detailed cost breakdown
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <>
        <div className="bg-white border-2 border-black rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-8 w-8 stroke-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-black">Submission Received</h2>
              <p className="text-gray-600">Our solutions team will follow up within 24 hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Company</p>
              <p className="text-lg font-bold text-black">{dealData.company}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Contact</p>
              <p className="text-lg font-bold text-black">{dealData.requestor_name}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Target Date</p>
              <p className="text-lg font-bold text-black">
                {dealData.target_production_date ? new Date(dealData.target_production_date).toLocaleDateString() : 'TBD'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Recommended AI Agent Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-6 w-6 stroke-black" />
              <h3 className="text-lg font-bold text-black">Agent Count</h3>
            </div>
            <p className="text-4xl font-bold text-black mb-2">{analysis.estimated_agents}</p>
            <p className="text-sm text-gray-600">Specialized AI agents</p>
          </div>

          <div className={`border-2 rounded-2xl p-6 shadow-sm ${getComplexityColor(analysis.complexity_level)}`}>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-6 w-6" />
              <h3 className="text-lg font-bold">Complexity</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{analysis.complexity_level}</p>
            <p className="text-sm">Based on integrations & requirements</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-6 w-6 stroke-black" />
              <h3 className="text-lg font-bold text-black">Timeline</h3>
            </div>
            <p className="text-4xl font-bold text-black mb-2">{timeline.total_weeks}</p>
            <p className="text-sm text-gray-600">Weeks to production</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Network className="h-5 w-5 stroke-black" />
            <h3 className="text-lg font-bold text-black">Agent Roles & Responsibilities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.agent_details.map((agent, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-black">{agent.name}</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {agent.complexity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Role:</span> {agent.role}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Purpose:</span> {agent.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 stroke-blue-600" />
            <h3 className="text-xl font-bold text-black">Credit Consumption Estimate</h3>
          </div>

          <div className="bg-white rounded-xl p-6 border border-blue-200 mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <p className="text-4xl font-bold text-black">{credits.total_credits.toLocaleString()}</p>
              <p className="text-lg text-gray-600">credits</p>
            </div>
            <p className="text-sm text-gray-600">Total estimated for prototype, pilot, and 3 months production</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Prototype Phase</span>
              <span className="text-sm font-bold text-black">{credits.breakdown.prototype_phase.toLocaleString()} credits</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Pilot Phase</span>
              <span className="text-sm font-bold text-black">{credits.breakdown.pilot_phase.toLocaleString()} credits</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">Production (per month)</span>
              <span className="text-sm font-bold text-black">{credits.breakdown.production_monthly.toLocaleString()} credits</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-200">
            <p className="text-xs font-semibold text-gray-700 mb-3">Calculation Factors:</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-sm font-bold text-black">{credits.factors.agent_count}</p>
                <p className="text-xs text-gray-600">Agents</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black">{credits.factors.integration_complexity.toFixed(1)}x</p>
                <p className="text-xs text-gray-600">Integration Factor</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black">{credits.factors.data_volume_multiplier.toFixed(1)}x</p>
                <p className="text-xs text-gray-600">Data Complexity</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 stroke-black" />
            <h3 className="text-lg font-bold text-black">Implementation Timeline</h3>
          </div>
          <div className="space-y-3">
            {timeline.phases.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-sm font-bold text-black">{phase.weeks}w</span>
                </div>
                <div className="flex-1 pb-4 border-b border-gray-200 last:border-b-0">
                  <h4 className="font-semibold text-black mb-1">{phase.name}</h4>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 stroke-green-600" />
            <h3 className="text-xl font-bold text-black">Lyzr Responsible AI Features</h3>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Required for Your Use Case:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiFeatures.required.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-green-200">
                  <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Recommended:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiFeatures.recommended.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-200">
                  <AlertCircle className="h-4 w-4 stroke-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-black mb-3">Next Steps</h3>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <p className="text-gray-700 pt-0.5">
                Our solutions team will review your submission within 24 hours
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <p className="text-gray-700 pt-0.5">
                Schedule a discovery call to discuss your specific requirements
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <p className="text-gray-700 pt-0.5">
                Receive a detailed proposal with pricing and timeline
              </p>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <p className="text-gray-700 pt-0.5">
                {dealData.preferred_path === 'Rapid Prototype (1 week)'
                  ? 'Begin with a rapid 1-week prototype to validate approach'
                  : 'Start with a comprehensive 3-month pilot program'}
              </p>
            </li>
          </ol>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
          >
            Submit Another Opportunity
          </button>
        </div>
        </>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-2xl p-8 mb-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-8 w-8 stroke-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-black">Credit Usage Calculator</h2>
                  <p className="text-gray-600">Estimate your monthly and annual credit consumption</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Company</p>
                  <p className="text-lg font-bold text-black">{dealData.company}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">AI Agents</p>
                  <p className="text-lg font-bold text-black">{analysis.estimated_agents}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Complexity</p>
                  <p className="text-lg font-bold text-black">{analysis.complexity_level}</p>
                </div>
              </div>
            </div>

            <CreditForecast
              estimatedAgents={analysis.estimated_agents}
              complexityLevel={analysis.complexity_level}
              dealData={dealData}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-black mb-3">About Credit Consumption</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
                  <span>Credits are consumed based on agent interactions, API calls, and data processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
                  <span>Higher complexity solutions require more credits per run due to additional processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
                  <span>Adjust parameters above to model different usage scenarios for your planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
                  <span>Contact our team for custom pricing or volume discounts</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
              >
                Submit Another Opportunity
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
