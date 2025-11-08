import { Brain, Wrench, Server, Clock, DollarSign, AlertTriangle, CheckCircle, Target } from 'lucide-react';

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
          <h3 className="text-lg font-bold text-black">AI Agent Breakdown</h3>
        </div>
        <div className="space-y-3">
          {analysis.agent_details.map((agent, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-black">{agent.name}</h4>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {agent.complexity}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Role:</span> {agent.role}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Purpose:</span> {agent.purpose}</p>
            </div>
          ))}
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
