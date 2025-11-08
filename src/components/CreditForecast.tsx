import { useState } from 'react';
import { Calculator, TrendingUp, Calendar, Info } from 'lucide-react';
import { DealSubmission } from '../lib/supabase';

interface CreditForecastProps {
  estimatedAgents: number;
  complexityLevel: string;
  dealData: DealSubmission;
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

export default function CreditForecast({ estimatedAgents, complexityLevel, dealData }: CreditForecastProps) {
  const detectedUseCase = detectUseCase(dealData);
  const useCaseConfig = USE_CASE_METRICS[detectedUseCase];

  const [volumePerDay, setVolumePerDay] = useState(useCaseConfig.defaultValue);
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState(22);
  const [timeframe, setTimeframe] = useState<'6-month' | '12-month'>('6-month');

  const getComplexityMultiplier = () => {
    switch (complexityLevel) {
      case 'Low': return 0.7;
      case 'Medium': return 1.0;
      case 'High': return 1.5;
      case 'Very High': return 2.0;
      default: return 1.0;
    }
  };

  const baseCreditsPerTransaction = useCaseConfig.creditsPerUnit;
  const complexityMultiplier = getComplexityMultiplier();
  const agentMultiplier = (1 + (estimatedAgents - 1) * 0.25);

  const creditsPerTransaction = Math.round(baseCreditsPerTransaction * complexityMultiplier * agentMultiplier);
  const dailyCredits = creditsPerTransaction * volumePerDay;
  const monthlyCredits = dailyCredits * workingDaysPerMonth;
  const annualCredits = monthlyCredits * 12;

  const creditCost = 0.01;
  const dailyCost = dailyCredits * creditCost;
  const monthlyCost = monthlyCredits * creditCost;
  const annualCost = annualCredits * creditCost;

  // Generate forecast data for chart
  const numMonths = timeframe === '6-month' ? 6 : 12;
  const historicalMonths = 2; // First 2 months are "historical"

  const chartData = Array.from({ length: numMonths }, (_, i) => ({
    month: i + 1,
    cost: monthlyCost * (i < historicalMonths ? 1 : 1), // Could add variance here
    isHistorical: i < historicalMonths,
    label: `M${i + 1}`
  }));

  const maxCost = Math.max(...chartData.map(d => d.cost)) * 1.15;
  const minCost = 0;
  const chartHeight = 240;
  const chartWidth = 100; // percentage

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-6 w-6 stroke-black" />
        <h3 className="text-xl font-bold text-black">Credit Usage & Cost Forecast</h3>
      </div>

      <div className="space-y-6">
        {/* Detected Use Case Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Detected Use Case</p>
              <p className="text-lg font-bold text-blue-900">{detectedUseCase}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-700 font-medium mb-1">Estimated Volume</p>
              <p className="text-lg font-bold text-blue-900">{useCaseConfig.defaultValue} {useCaseConfig.label}/day</p>
            </div>
          </div>
        </div>

        {/* Business Metrics Input */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 stroke-gray-600" />
            <h4 className="font-semibold text-black">Configure Your Usage</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {useCaseConfig.label} per Day
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={volumePerDay}
                onChange={(e) => setVolumePerDay(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">Expected daily volume</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Working Days per Month
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={workingDaysPerMonth}
                onChange={(e) => setWorkingDaysPerMonth(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg font-semibold"
              />
              <p className="text-xs text-gray-500 mt-1">Business operating days</p>
            </div>
          </div>
        </div>

        {/* Credit Breakdown */}
        <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
          <h4 className="font-semibold text-black mb-4">Credit Consumption Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Per {useCaseConfig.unit.slice(0, -1)}</p>
              <p className="text-3xl font-bold text-black">{creditsPerTransaction.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">credits</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 mb-2">Daily</p>
              <p className="text-3xl font-bold text-blue-900">{dailyCredits.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-2">{volumePerDay} {useCaseConfig.unit}</p>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <p className="text-xs text-blue-700 mb-2">Monthly</p>
              <p className="text-3xl font-bold text-blue-900">{monthlyCredits.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-2">{workingDaysPerMonth} days</p>
            </div>
            <div className="text-center p-4 bg-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 mb-2">Annual</p>
              <p className="text-3xl font-bold text-blue-950">{annualCredits.toLocaleString()}</p>
              <p className="text-xs text-blue-700 mt-2">12 months</p>
            </div>
          </div>
        </div>

        {/* Cost Estimates */}
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

          {/* Forecast Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="font-bold text-black text-lg mb-1">
                  {timeframe === '6-month' ? '6-Month' : '12-Month'} Cost Forecast
                </h4>
                <p className="text-sm text-gray-500">Projected monthly costs based on current usage</p>
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
              {/* Y-axis */}
              <div className="absolute left-0 top-4 bottom-12 w-16 flex flex-col justify-between text-xs text-gray-600 font-medium">
                <span>${(maxCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>${(maxCost * 0.25).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>$0</span>
              </div>

              {/* Chart area */}
              <div className="ml-16 mr-4 relative" style={{ height: chartHeight }}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                  <div
                    key={ratio}
                    className="absolute w-full border-t border-gray-200"
                    style={{ top: `${(1 - ratio) * 100}%` }}
                  />
                ))}

                {/* Chart SVG */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  {/* Historical line (solid) */}
                  {historicalMonths > 0 && (
                    <polyline
                      points={chartData.slice(0, historicalMonths + 1).map((d, i) => {
                        const x = (i / (numMonths - 1)) * 100;
                        const y = (1 - ((d.cost - minCost) / (maxCost - minCost))) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Forecast line (dashed) */}
                  <polyline
                    points={chartData.slice(historicalMonths).map((d, i) => {
                      const actualIndex = i + historicalMonths;
                      const x = (actualIndex / (numMonths - 1)) * 100;
                      const y = (1 - ((d.cost - minCost) / (maxCost - minCost))) * 100;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="4"
                    strokeDasharray="12,8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {chartData.map((d, i) => {
                    const x = (i / (numMonths - 1)) * 100;
                    const y = (1 - ((d.cost - minCost) / (maxCost - minCost))) * 100;
                    const isHistorical = d.isHistorical;
                    return (
                      <g key={i}>
                        <circle
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="7"
                          fill={isHistorical ? '#2563eb' : '#93c5fd'}
                          stroke="white"
                          strokeWidth="3"
                          className="drop-shadow-md"
                        />
                        {/* Value labels on hover */}
                        <title>${d.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</title>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X-axis labels */}
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

              {/* Legend */}
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

        {/* Calculation Details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 stroke-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-3 text-base">Calculation Breakdown</p>
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
                  <p className="font-semibold text-blue-900 mb-1">Final Cost</p>
                  <p className="text-blue-800">{creditsPerTransaction} credits × ${creditCost}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-blue-700 bg-white/40 rounded-lg p-3">
                💡 <strong>Note:</strong> Actual usage may vary based on conversation length, data processing complexity, and integration requirements. This forecast assumes consistent daily volume.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
