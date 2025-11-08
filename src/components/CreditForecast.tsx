import { useState } from 'react';
import { Calculator, TrendingUp, Calendar, Info, Sliders, PieChart, Zap } from 'lucide-react';
import { DealSubmission } from '../types';
import { creditPricing, CurrencyCode } from '../lib/creditPricing';
import { DealPricingConfig } from '../lib/storage';

interface CreditForecastProps {
  estimatedAgents: number;
  complexityLevel: string;
  dealData: DealSubmission;
  customPricing?: DealPricingConfig | null;
}

const USE_CASE_METRICS = {
  'Credit Card Dispute': { label: 'Disputes', unit: 'disputes', defaultValue: 50, creditsPerUnit: 80 },
  'IT Support': { label: 'Support Tickets', unit: 'tickets', defaultValue: 100, creditsPerUnit: 45 },
  'Patient Intake': { label: 'Patient Registrations', unit: 'patients', defaultValue: 30, creditsPerUnit: 120 },
  'Loan Application': { label: 'Loan Applications', unit: 'applications', defaultValue: 25, creditsPerUnit: 150 },
  'Exit Interview': { label: 'Exit Interviews', unit: 'interviews', defaultValue: 15, creditsPerUnit: 90 },
  'Sales Forecast': { label: 'Forecast Reports', unit: 'reports', defaultValue: 20, creditsPerUnit: 200 },
  'Generic': { label: 'Transactions', unit: 'transactions', defaultValue: 50, creditsPerUnit: 100 }
};

type UseCaseType = keyof typeof USE_CASE_METRICS;
type ScenarioType = 'optimized' | 'standard' | 'premium';

function detectUseCase(dealData: DealSubmission): UseCaseType {
  const problemText = `${dealData.problem_statement} ${dealData.business_unit} ${dealData.company}`.toLowerCase();

  if (problemText.includes('dispute') || problemText.includes('fraud') || problemText.includes('chargeback')) {
    return 'Credit Card Dispute';
  }
  if (problemText.includes('support') || problemText.includes('ticket') || problemText.includes('helpdesk') || problemText.includes('knowledge base')) {
    return 'IT Support';
  }
  if (problemText.includes('patient') || problemText.includes('healthcare') || problemText.includes('medical') || problemText.includes('eligibility')) {
    return 'Patient Intake';
  }
  if (problemText.includes('loan') || problemText.includes('lending') || problemText.includes('mortgage') || problemText.includes('credit application')) {
    return 'Loan Application';
  }
  if (problemText.includes('exit interview') || problemText.includes('attrition') || problemText.includes('offboarding')) {
    return 'Exit Interview';
  }
  if (problemText.includes('sales') || problemText.includes('forecast') || problemText.includes('pipeline') || problemText.includes('revenue')) {
    return 'Sales Forecast';
  }

  return 'Generic';
}

export default function CreditForecast({ estimatedAgents, complexityLevel, dealData, customPricing }: CreditForecastProps) {
  const creditCost = customPricing ? customPricing.creditRate : creditPricing.getRate();
  const currency = customPricing ? customPricing.currency : creditPricing.getCurrency();
  const detectedUseCase = detectUseCase(dealData);
  const useCaseConfig = USE_CASE_METRICS[detectedUseCase];

  const [volumePerDay, setVolumePerDay] = useState(useCaseConfig.defaultValue);
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(22);
  const [timeframe, setTimeframe] = useState<'6-month' | '12-month'>('6-month');
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('standard');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getComplexityMultiplier = () => {
    switch (complexityLevel) {
      case 'Low': return 0.7;
      case 'Medium': return 1.0;
      case 'High': return 1.5;
      case 'Very High': return 2.0;
      default: return 1.0;
    }
  };

  const getScenarioMultiplier = (scenario: ScenarioType) => {
    switch (scenario) {
      case 'optimized': return 0.75;
      case 'standard': return 1.0;
      case 'premium': return 1.3;
    }
  };

  const baseCreditsPerTransaction = useCaseConfig.creditsPerUnit;
  const complexityMultiplier = getComplexityMultiplier();
  const agentMultiplier = (1 + (estimatedAgents - 1) * 0.25);
  const scenarioMultiplier = getScenarioMultiplier(activeScenario);

  const creditsPerTransaction = Math.round(baseCreditsPerTransaction * complexityMultiplier * agentMultiplier * scenarioMultiplier);
  const dailyCredits = creditsPerTransaction * volumePerDay;
  const monthlyCredits = dailyCredits * workingDaysPerMonth;
  const annualCredits = monthlyCredits * 12;

  const dailyCost = dailyCredits * creditCost;
  const monthlyCost = monthlyCredits * creditCost;
  const annualCost = annualCredits * creditCost;

  const numMonths = timeframe === '6-month' ? 6 : 12;
  const historicalMonths = 2;

  const chartData = Array.from({ length: numMonths }, (_, i) => ({
    month: i + 1,
    cost: monthlyCost * (i < historicalMonths ? 1 : 1),
    isHistorical: i < historicalMonths,
    label: `M${i + 1}`
  }));

  const maxCost = Math.max(...chartData.map(d => d.cost)) * 1.15;
  const chartHeight = 240;

  const costBreakdown = [
    { category: 'Agent Execution', percentage: 45, color: '#3b82f6' },
    { category: 'Data Processing', percentage: 25, color: '#10b981' },
    { category: 'API Calls', percentage: 20, color: '#f59e0b' },
    { category: 'Infrastructure', percentage: 10, color: '#8b5cf6' }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="h-6 w-6 stroke-black" />
            <h3 className="text-xl font-bold text-black">Credit Usage & Cost Forecast</h3>
          </div>
          {customPricing && (
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold">
                Custom Pricing Active
              </span>
              <span className="text-gray-600">
                @ {creditCost.toFixed(4)} per credit
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-bold shadow-md transform hover:scale-105 ${
            showBreakdown
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300'
          }`}
        >
          <PieChart className="h-4 w-4" />
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Detected Use Case</p>
              <p className="text-lg font-bold text-blue-900">{detectedUseCase}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700 font-medium mb-1">Base Volume</p>
              <p className="text-lg font-bold text-blue-900">{useCaseConfig.defaultValue} {useCaseConfig.label}/day</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 stroke-orange-600" />
            <h4 className="font-bold text-black">Deployment Scenarios</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">Compare different optimization levels to find the best fit for your needs</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveScenario('optimized')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeScenario === 'optimized'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-black">Optimized</span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">-25%</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Cost-efficient mode with caching and batching</p>
              <p className="text-2xl font-bold text-green-700">
                ${(monthlyCost * 0.75).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
              </p>
            </button>

            <button
              onClick={() => setActiveScenario('standard')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeScenario === 'standard'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-black">Standard</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Recommended</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Balanced performance and cost</p>
              <p className="text-2xl font-bold text-blue-700">
                ${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
              </p>
            </button>

            <button
              onClick={() => setActiveScenario('premium')}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeScenario === 'premium'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-black">Premium</span>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">+30%</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Maximum accuracy and features</p>
              <p className="text-2xl font-bold text-purple-700">
                ${(monthlyCost * 1.3).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
              </p>
            </button>
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>Scenario Details:</strong> {
                activeScenario === 'optimized' ? 'Uses intelligent caching, request batching, and lightweight models for maximum efficiency.' :
                activeScenario === 'premium' ? 'Includes advanced reasoning, real-time processing, multi-step validation, and priority support.' :
                'Standard configuration with reliable performance, moderate caching, and full feature set.'
              }
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="h-4 w-4 stroke-gray-600" />
            <h4 className="font-semibold text-black">Adjust Your Volume</h4>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {useCaseConfig.label} per Day
                </label>
                <span className="text-lg font-bold text-black">{volumePerDay}</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={volumePerDay}
                onChange={(e) => setVolumePerDay(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Working Days per Month
                </label>
                <span className="text-lg font-bold text-black">{workingDaysPerMonth}</span>
              </div>
              <input
                type="range"
                min="1"
                max="31"
                value={workingDaysPerMonth}
                onChange={(e) => setWorkingDaysPerMonth(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>15</span>
                <span>31</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-300">
          <h4 className="font-bold text-black mb-5 text-lg">Estimated Credits & Cost</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-600 mb-3 uppercase tracking-wide">Per {useCaseConfig.unit.slice(0, -1)}</p>
              <p className="text-4xl font-bold text-black mb-1">{creditsPerTransaction.toLocaleString()} <span className="text-xl text-gray-500">credits</span></p>
              <p className="text-sm text-gray-600 mt-1">Base calculation per transaction</p>
            </div>

            <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-700 mb-3 uppercase tracking-wide font-semibold">Monthly Credits</p>
              <p className="text-4xl font-bold text-black mb-1">{monthlyCredits.toLocaleString()} <span className="text-xl text-gray-500">credits</span></p>
              <p className="text-sm text-blue-700 mt-1">Based on {volumePerDay} {useCaseConfig.unit}/day × {workingDaysPerMonth} days</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl border-2 border-blue-400 shadow-md">
              <p className="text-xs text-blue-900 mb-3 uppercase tracking-wide font-bold">Monthly Cost</p>
              <p className="text-5xl font-bold text-blue-950 mb-1">${creditPricing.formatCost(monthlyCredits)}</p>
              <p className="text-sm text-blue-800 mt-2 font-medium">{monthlyCredits.toLocaleString()} × ${creditCost.toFixed(3)} per credit</p>
            </div>
          </div>
        </div>

        {showBreakdown && (
          <div
            className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-5 animate-slideIn"
            style={{
              animation: 'slideIn 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 stroke-purple-700" />
              <h4 className="font-bold text-purple-900">Cost Breakdown by Category</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {costBreakdown.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-bold" style={{ color: item.color }}>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      ${((monthlyCost * item.percentage) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {costBreakdown.reduce((acc, item, idx) => {
                    const startAngle = acc.angle;
                    const angle = (item.percentage / 100) * 360;
                    const endAngle = startAngle + angle;

                    const startRad = (startAngle - 90) * Math.PI / 180;
                    const endRad = (endAngle - 90) * Math.PI / 180;

                    const x1 = 100 + 80 * Math.cos(startRad);
                    const y1 = 100 + 80 * Math.sin(startRad);
                    const x2 = 100 + 80 * Math.cos(endRad);
                    const y2 = 100 + 80 * Math.sin(endRad);

                    const largeArc = angle > 180 ? 1 : 0;

                    acc.paths.push(
                      <path
                        key={idx}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );

                    acc.angle = endAngle;
                    return acc;
                  }, { angle: 0, paths: [] as JSX.Element[] }).paths}
                  <circle cx="100" cy="100" r="40" fill="white" />
                  <text x="100" y="95" textAnchor="middle" className="text-xs font-bold" fill="#000">
                    Total
                  </text>
                  <text x="100" y="110" textAnchor="middle" className="text-lg font-bold" fill="#000">
                    ${monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 stroke-black" />
              <h4 className="font-bold text-black">Cost Estimates</h4>
              <span className="text-xs text-gray-500 ml-2">@ ${creditCost}/credit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 stroke-gray-600" />
                <p className="text-sm text-gray-600 font-semibold">Daily Cost</p>
              </div>
              <p className="text-4xl font-bold text-black mb-2">${dailyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-gray-500">Per business day</p>
            </div>

            <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 stroke-blue-700" />
                <p className="text-sm text-blue-800 font-semibold">Monthly Cost</p>
              </div>
              <p className="text-4xl font-bold text-blue-900 mb-2">${monthlyCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-blue-700">{workingDaysPerMonth} working days</p>
            </div>

            <div className="border-2 border-green-300 bg-green-50 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 stroke-green-700" />
                <p className="text-sm text-green-800 font-semibold">Annual Cost</p>
              </div>
              <p className="text-4xl font-bold text-green-900 mb-2">${annualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-green-700">12-month projection</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-black text-lg mb-1">
                  {timeframe === '6-month' ? '6-Month' : '12-Month'} Cost Forecast
                </h4>
                <p className="text-sm text-gray-500">Projected monthly costs based on {activeScenario} scenario</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeframe('6-month')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    timeframe === '6-month'
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setTimeframe('12-month')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    timeframe === '12-month'
                      ? 'bg-black text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  12 Months
                </button>
              </div>
            </div>

            <div className="relative bg-white rounded-lg p-4" style={{ height: chartHeight + 60 }}>
              <div className="absolute left-0 top-4 bottom-12 w-16 flex flex-col justify-between text-xs text-gray-600 font-medium">
                <span>${(maxCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.25).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>$0</span>
              </div>

              <div className="ml-16 mr-4 relative" style={{ height: chartHeight }}>
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <div
                    key={ratio}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${(1 - ratio) * 100}%` }}
                  />
                ))}

                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {historicalMonths > 0 && (
                    <polyline
                      points={chartData.slice(0, historicalMonths + 1).map((d, i) => {
                        const x = (i / (numMonths - 1)) * 100;
                        const y = (1 - ((d.cost) / maxCost)) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  <polyline
                    points={chartData.slice(historicalMonths).map((d, i) => {
                      const actualIndex = i + historicalMonths;
                      const x = (actualIndex / (numMonths - 1)) * 100;
                      const y = (1 - ((d.cost) / maxCost)) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="3"
                    strokeDasharray="8,6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {chartData.map((d, i) => {
                    const x = (i / (numMonths - 1)) * 100;
                    const y = (1 - ((d.cost) / maxCost)) * 100;
                    const isHistorical = d.isHistorical;
                    return (
                      <g key={i}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="6"
                          fill={isHistorical ? '#2563eb' : '#93c5fd'}
                          stroke="white"
                          strokeWidth="2"
                          className="drop-shadow-sm"
                        />
                        <title>${d.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="ml-16 mr-4 mt-2 flex justify-between text-xs text-gray-600 font-medium">
                {chartData.map((d, i) => {
                  const showLabel = numMonths <= 6 || i % 2 === 0 || i === numMonths - 1;
                  return (
                    <span key={i} className={showLabel ? '' : 'invisible'}>
                      {d.label}
                    </span>
                  );
                })}
              </div>

              <div className="ml-16 flex items-center justify-center gap-8 mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-1 bg-blue-600 rounded"></div>
                  <span className="text-sm text-gray-700 font-medium">Current Usage</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="40" height="4" className="overflow-visible">
                    <line
                      x1="0"
                      y1="2"
                      x2="40"
                      y2="2"
                      stroke="#93c5fd"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 font-medium">Projected Forecast</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 stroke-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-3 text-base">How Credits Are Calculated</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">Base Credits</p>
                  <p className="text-blue-800">{baseCreditsPerTransaction} credits per {useCaseConfig.unit.slice(0, -1)}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">Complexity</p>
                  <p className="text-blue-800">{complexityLevel} (×{complexityMultiplier.toFixed(1)})</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">AI Agents</p>
                  <p className="text-blue-800">{estimatedAgents} agents (×{agentMultiplier.toFixed(2)})</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <p className="font-semibold text-blue-900 mb-1">Scenario</p>
                  <p className="text-blue-800 capitalize">{activeScenario} (×{scenarioMultiplier.toFixed(2)})</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-blue-700 bg-white/40 rounded-lg p-3">
                💡 <strong>Tip:</strong> Use the sliders above to simulate different usage volumes. The {activeScenario} scenario provides {
                  activeScenario === 'optimized' ? 'the best cost efficiency' :
                  activeScenario === 'premium' ? 'maximum performance and accuracy' :
                  'balanced cost and performance'
                }.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
