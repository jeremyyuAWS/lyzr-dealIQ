import { Brain, Wrench, Server, Clock, DollarSign, AlertTriangle, CheckCircle, Target, TrendingUp, Info } from 'lucide-react';

interface AgentDetail {
  name: string;
  role: string;
  purpose: string;
  complexity: string;
}

interface ToolDetail {
  name: string;
  purpose: string;
  integration: string;
}

interface MCPDetail {
  name: string;
  purpose: string;
  endpoints: string[];
}

interface OpportunityAnalysisData {
  id?: string;
  deal_submission_id?: string;
  analysis_date?: string;
  opportunity_score: number;
  complexity_level: string;
  estimated_agents: number;
  agent_details: AgentDetail[];
  tool_calling_required: boolean;
  tool_details: ToolDetail[];
  mcp_servers_required: boolean;
  mcp_details: MCPDetail[];
  estimated_level_of_effort: string;
  estimated_hours: number;
  scope_of_work: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  key_technical_requirements: string[];
  risk_factors: string[];
  recommended_approach: string;
  timeline_estimate_weeks: number;
}

interface OpportunityAnalysisProps {
  analysis: OpportunityAnalysisData;
}

export default function OpportunityAnalysis({ analysis }: OpportunityAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-blue-100 text-blue-700';
      case 'High': return 'bg-amber-100 text-amber-700';
      case 'Very High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAgentCostEstimate = (complexity: string) => {
    const baseCredits = {
      'Low': { low: 50, medium: 80, high: 120 },
      'Medium': { low: 100, medium: 150, high: 200 },
      'High': { low: 180, medium: 250, high: 350 },
      'Very High': { low: 300, medium: 450, high: 600 }
    };
    return baseCredits[complexity as keyof typeof baseCredits] || { low: 100, medium: 150, high: 200 };
  };

  const getAssumptions = (complexity: string) => {
    const assumptions = {
      'Low': [
        'Simple decision-making logic',
        'Minimal external integrations',
        '1-2 API calls per transaction',
        'Standard error handling'
      ],
      'Medium': [
        'Moderate business logic complexity',
        'Multiple system integrations',
        '3-5 API calls per transaction',
        'Enhanced error handling and retries'
      ],
      'High': [
        'Complex decision trees',
        'Real-time data processing',
        '5-10 API calls per transaction',
        'Advanced error handling and rollback logic'
      ],
      'Very High': [
        'Multi-step workflows with branching',
        'Heavy data transformation',
        '10+ API calls per transaction',
        'Sophisticated state management and recovery'
      ]
    };
    return assumptions[complexity as keyof typeof assumptions] || assumptions.Medium;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`border-2 rounded-xl p-6 ${getScoreColor(analysis.opportunity_score)}`}>
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-6 w-6" />
            <h3 className="text-sm font-medium">Opportunity Score</h3>
          </div>
          <p className="text-4xl font-bold">{analysis.opportunity_score}/100</p>
        </div>

        <div className="border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 stroke-black" />
            <h3 className="text-sm font-medium text-black">AI Agents Needed</h3>
          </div>
          <p className="text-4xl font-bold text-black">{analysis.estimated_agents}</p>
        </div>

        <div className="border-2 border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6 stroke-black" />
            <h3 className="text-sm font-medium text-black">Timeline</h3>
          </div>
          <p className="text-4xl font-bold text-black">{analysis.timeline_estimate_weeks} weeks</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-4">Complexity & Effort</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Complexity Level</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(analysis.complexity_level)}`}>
              {analysis.complexity_level}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Level of Effort</p>
            <p className="text-lg font-semibold text-black">{analysis.estimated_level_of_effort} ({analysis.estimated_hours}h)</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-5 w-5 stroke-black" />
          <h3 className="text-lg font-bold text-black">Cost Estimate</h3>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-3xl font-bold text-black">
            ${analysis.estimated_cost_min.toLocaleString()} - ${analysis.estimated_cost_max.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Based on {analysis.estimated_agents} agents, {analysis.estimated_hours} hours, and technical complexity
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="h-5 w-5 stroke-black" />
          <h3 className="text-lg font-bold text-black">AI Agent Breakdown & Cost Analysis</h3>
        </div>
        <div className="space-y-4">
          {analysis.agent_details.map((agent, idx) => {
            const costEstimate = getAgentCostEstimate(agent.complexity);
            const assumptions = getAssumptions(agent.complexity);

            return (
              <div key={idx} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-black">{agent.name}</h4>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border-2 ${
                    agent.complexity === 'Low' ? 'bg-green-50 text-green-700 border-green-300' :
                    agent.complexity === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                    agent.complexity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-300' :
                    'bg-red-50 text-red-700 border-red-300'
                  }`}>
                    {agent.complexity}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[70px]">Role:</span>
                    <span className="text-sm text-gray-700">{agent.role}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-[70px]">Purpose:</span>
                    <span className="text-sm text-gray-700">{agent.purpose}</span>
                  </div>
                </div>

                <div className="bg-white border-2 border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 stroke-blue-700" />
                    <h5 className="text-sm font-bold text-blue-900">Credit Cost Estimates (per transaction)</h5>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-green-700 font-semibold mb-1">Low</p>
                      <p className="text-2xl font-bold text-green-900">{costEstimate.low}</p>
                      <p className="text-xs text-green-600 mt-1">credits</p>
                    </div>

                    <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-3 text-center shadow-sm">
                      <p className="text-xs text-blue-700 font-semibold mb-1">Medium</p>
                      <p className="text-2xl font-bold text-blue-900">{costEstimate.medium}</p>
                      <p className="text-xs text-blue-600 mt-1">credits</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">Typical</p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                      <p className="text-xs text-orange-700 font-semibold mb-1">High</p>
                      <p className="text-2xl font-bold text-orange-900">{costEstimate.high}</p>
                      <p className="text-xs text-orange-600 mt-1">credits</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-600 text-center">
                      <strong>Cost Range:</strong> ${(costEstimate.low * 0.01).toFixed(2)} - ${(costEstimate.high * 0.01).toFixed(2)} per transaction
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 stroke-gray-700" />
                    <h5 className="text-sm font-bold text-gray-800">Cost Assumptions</h5>
                  </div>
                  <ul className="space-y-1.5">
                    {assumptions.map((assumption, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 mt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 stroke-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-blue-900 mb-2">Total Workflow Cost Estimate</h5>
                <p className="text-sm text-blue-800 mb-3">
                  The total cost per transaction depends on how agents work together in the workflow:
                </p>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Sequential</p>
                    <p className="text-lg font-bold text-blue-900">
                      {analysis.agent_details.reduce((sum, agent) => sum + getAgentCostEstimate(agent.complexity).medium, 0)} credits
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Sum of all agents</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Parallel</p>
                    <p className="text-lg font-bold text-blue-900">
                      {Math.max(...analysis.agent_details.map(agent => getAgentCostEstimate(agent.complexity).medium))} credits
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Max single agent</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold mb-1">Hybrid</p>
                    <p className="text-lg font-bold text-blue-900">
                      {Math.round(analysis.agent_details.reduce((sum, agent) => sum + getAgentCostEstimate(agent.complexity).medium, 0) * 0.7)} credits
                    </p>
                    <p className="text-xs text-blue-600 mt-1">~70% of sequential</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> Most workflows use a hybrid approach where some agents run in parallel while others run sequentially. Tool calling costs and data transfer are additional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {analysis.tool_calling_required && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="h-5 w-5 stroke-black" />
            <h3 className="text-lg font-bold text-black">Tool Calling Requirements</h3>
          </div>
          <div className="space-y-3">
            {analysis.tool_details.map((tool, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">{tool.name}</h4>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Purpose:</span> {tool.purpose}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Integration:</span> {tool.integration}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.mcp_servers_required && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Server className="h-5 w-5 stroke-black" />
            <h3 className="text-lg font-bold text-black">MCP Server Requirements</h3>
          </div>
          <div className="space-y-3">
            {analysis.mcp_details.map((mcp, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-black mb-2">{mcp.name}</h4>
                <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Purpose:</span> {mcp.purpose}</p>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Endpoints:</span>
                  <ul className="list-disc list-inside mt-1 ml-2">
                    {mcp.endpoints.map((endpoint, i) => (
                      <li key={i}>{endpoint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-4">Scope of Work</h3>
        <p className="text-gray-700 whitespace-pre-line">{analysis.scope_of_work}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-5 w-5 stroke-black" />
          <h3 className="text-lg font-bold text-black">Technical Requirements</h3>
        </div>
        <ul className="space-y-2">
          {analysis.key_technical_requirements.map((req, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 stroke-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {analysis.risk_factors.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 stroke-amber-600" />
            <h3 className="text-lg font-bold text-amber-900">Risk Factors</h3>
          </div>
          <ul className="space-y-2">
            {analysis.risk_factors.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 stroke-amber-600 mt-0.5 flex-shrink-0" />
                <span className="text-amber-900">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-3">Recommended Approach</h3>
        <p className="text-blue-900 whitespace-pre-line">{analysis.recommended_approach}</p>
      </div>
    </div>
  );
}
