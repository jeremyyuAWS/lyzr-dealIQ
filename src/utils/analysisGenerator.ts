import { DealSubmission } from '../types';

export interface OpportunityAnalysisData {
  opportunity_score: number;
  complexity_level: string;
  estimated_agents: number;
  agent_details: any[];
  tool_calling_required: boolean;
  tool_details: any[];
  mcp_servers_required: boolean;
  mcp_details: any[];
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

export function generateOpportunityAnalysis(deal: DealSubmission): OpportunityAnalysisData {
  const hasIntegrations = deal.critical_integrations && deal.critical_integrations.length > 0;
  const isComplexDeployment = deal.deployment_preference?.includes('On-Prem') ||
                              deal.deployment_preference?.includes('Customer VPC (Cloud)');
  const hasDataPrivacy = deal.data_privacy_requirements && deal.data_privacy_requirements.length > 0;
  const isHighBudget = deal.budget_band === '>$1M';

  let complexityScore = 30;
  let estimatedAgents = 2;

  if (hasIntegrations) complexityScore += 15;
  if (isComplexDeployment) complexityScore += 10;
  if (hasDataPrivacy) complexityScore += 15;
  if (deal.problem_statement && deal.problem_statement.length > 300) complexityScore += 10;
  if (deal.critical_integrations && deal.critical_integrations.length > 3) complexityScore += 10;

  let complexityLevel = 'Low';
  if (complexityScore > 70) {
    complexityLevel = 'Very High';
    estimatedAgents = 6;
  } else if (complexityScore > 55) {
    complexityLevel = 'High';
    estimatedAgents = 4;
  } else if (complexityScore > 40) {
    complexityLevel = 'Medium';
    estimatedAgents = 3;
  }

  const agentDetails = generateAgentDetails(deal, estimatedAgents);
  const toolDetails = hasIntegrations ? generateToolDetails(deal) : [];
  const mcpDetails = isComplexDeployment ? generateMCPDetails(deal) : [];

  const baseHours = estimatedAgents * 80;
  const integrationHours = (deal.critical_integrations?.length || 0) * 40;
  const totalHours = baseHours + integrationHours;

  let effortLevel = 'Small';
  if (totalHours > 600) effortLevel = 'Extra Large';
  else if (totalHours > 400) effortLevel = 'Large';
  else if (totalHours > 200) effortLevel = 'Medium';

  const hourlyRate = 150;
  const costMin = totalHours * hourlyRate * 0.8;
  const costMax = totalHours * hourlyRate * 1.2;

  const opportunityScore = Math.min(95, 50 +
    (isHighBudget ? 20 : 10) +
    (deal.deal_stage === 'RFP' || deal.deal_stage === 'Shortlist' ? 15 : 5) +
    (deal.executive_sponsor_name ? 10 : 0)
  );

  const timelineWeeks = Math.ceil(totalHours / 40 / 2);

  return {
    opportunity_score: opportunityScore,
    complexity_level: complexityLevel,
    estimated_agents: estimatedAgents,
    agent_details: agentDetails,
    tool_calling_required: hasIntegrations,
    tool_details: toolDetails,
    mcp_servers_required: isComplexDeployment,
    mcp_details: mcpDetails,
    estimated_level_of_effort: effortLevel,
    estimated_hours: totalHours,
    scope_of_work: generateScopeOfWork(deal, estimatedAgents, totalHours),
    estimated_cost_min: costMin,
    estimated_cost_max: costMax,
    key_technical_requirements: generateTechnicalRequirements(deal),
    risk_factors: generateRiskFactors(deal),
    recommended_approach: generateRecommendedApproach(deal, complexityLevel),
    timeline_estimate_weeks: timelineWeeks,
  };
}

function generateAgentDetails(deal: DealSubmission, count: number) {
  const agents = [];

  agents.push({
    name: 'Orchestrator Agent',
    role: 'Workflow Coordination',
    purpose: 'Manages the overall workflow, coordinates between different agents, and ensures proper task sequencing',
    complexity: 'Medium'
  });

  agents.push({
    name: 'Data Processing Agent',
    role: 'Data Analysis & Transformation',
    purpose: 'Handles data extraction, transformation, and loading operations. Ensures data quality and consistency',
    complexity: deal.data_privacy_requirements && deal.data_privacy_requirements.length > 2 ? 'High' : 'Medium'
  });

  if (count >= 3) {
    agents.push({
      name: 'Integration Agent',
      role: 'External System Integration',
      purpose: `Manages connections to ${deal.critical_integrations?.slice(0, 3).join(', ')} and handles API communications`,
      complexity: 'High'
    });
  }

  if (count >= 4) {
    agents.push({
      name: 'Compliance Agent',
      role: 'Regulatory Compliance & Security',
      purpose: `Ensures ${deal.data_privacy_requirements?.join(', ')} compliance and monitors security protocols`,
      complexity: 'High'
    });
  }

  if (count >= 5) {
    agents.push({
      name: 'Analytics Agent',
      role: 'Performance Monitoring & Insights',
      purpose: 'Tracks KPIs, generates insights, and provides real-time performance metrics',
      complexity: 'Medium'
    });
  }

  if (count >= 6) {
    agents.push({
      name: 'User Interface Agent',
      role: 'User Interaction & Experience',
      purpose: 'Handles user queries, provides conversational interface, and manages user sessions',
      complexity: 'Medium'
    });
  }

  return agents;
}

function generateToolDetails(deal: DealSubmission) {
  const tools = [];

  if (deal.critical_integrations?.includes('Salesforce')) {
    tools.push({
      name: 'Salesforce CRM Tool',
      purpose: 'Query and update Salesforce records, manage opportunities, contacts, and custom objects',
      integration: 'REST API via OAuth 2.0 with real-time event streaming'
    });
  }

  if (deal.critical_integrations?.includes('Microsoft SharePoint')) {
    tools.push({
      name: 'SharePoint Document Management Tool',
      purpose: 'Access, create, and manage SharePoint documents, lists, and metadata',
      integration: 'Microsoft Graph API with delegated permissions'
    });
  }

  if (deal.critical_integrations?.includes('Snowflake')) {
    tools.push({
      name: 'Snowflake Data Warehouse Tool',
      purpose: 'Execute queries, retrieve analytics data, and perform data transformations',
      integration: 'Snowflake Connector with OAuth authentication'
    });
  }

  if (deal.critical_integrations?.includes('ServiceNow')) {
    tools.push({
      name: 'ServiceNow ITSM Tool',
      purpose: 'Create, update, and query incidents, change requests, and service tickets',
      integration: 'ServiceNow REST API with table API access'
    });
  }

  if (deal.critical_integrations?.includes('Epic')) {
    tools.push({
      name: 'Epic EHR Integration Tool',
      purpose: 'Access patient records, appointments, and clinical data with FHIR compliance',
      integration: 'Epic FHIR API with OAuth 2.0 authorization'
    });
  }

  if (deal.critical_integrations?.includes('SAP')) {
    tools.push({
      name: 'SAP ERP Tool',
      purpose: 'Connect to SAP systems for financial data, inventory, and supply chain operations',
      integration: 'SAP OData API with OAuth/SAML authentication'
    });
  }

  if (deal.critical_integrations?.includes('Workday')) {
    tools.push({
      name: 'Workday HR Tool',
      purpose: 'Access employee data, payroll information, and organizational hierarchies',
      integration: 'Workday REST API with ISU authentication'
    });
  }

  if (deal.critical_integrations?.includes('Jira')) {
    tools.push({
      name: 'Jira Project Management Tool',
      purpose: 'Create, update, and track issues, projects, and workflows',
      integration: 'Jira REST API v3 with OAuth 2.0'
    });
  }

  if (deal.critical_integrations && deal.critical_integrations.length > 0) {
    tools.push({
      name: 'Generic HTTP Client Tool',
      purpose: 'Handle custom API calls to additional third-party services and legacy systems',
      integration: 'Configurable HTTP client supporting OAuth, API keys, and basic auth'
    });

    tools.push({
      name: 'Data Validation Tool',
      purpose: 'Validate and sanitize data from all integrated sources before processing',
      integration: 'Schema validation with custom business rules engine'
    });
  }

  return tools;
}

function generateMCPDetails(deal: DealSubmission) {
  const mcpServers = [];

  if (deal.deployment_preference?.includes('On-Prem') || deal.data_privacy_requirements?.includes('Confidential')) {
    mcpServers.push({
      name: 'Secure Data Gateway MCP',
      purpose: 'Provides secure access to on-premise data sources while maintaining data sovereignty and compliance',
      endpoints: [
        '/v1/data/query - Execute secure SQL queries with row-level security',
        '/v1/data/transform - Transform and enrich data within secure boundary',
        '/v1/audit/log - Track all data access for compliance reporting',
        '/v1/encryption/manage - Manage encryption keys and data masking rules'
      ]
    });
  }

  if (deal.critical_integrations && deal.critical_integrations.length > 2) {
    mcpServers.push({
      name: 'Integration Hub MCP',
      purpose: 'Centralized integration orchestration for multiple external systems with retry logic and error handling',
      endpoints: [
        '/v1/integrate/sync - Synchronize data across systems with conflict resolution',
        '/v1/integrate/webhook - Handle incoming webhooks with signature verification',
        '/v1/integrate/batch - Process bulk data transfers efficiently',
        '/v1/integrate/status - Monitor integration health and performance metrics',
        '/v1/integrate/retry - Manage failed requests with exponential backoff'
      ]
    });
  }

  if (deal.data_privacy_requirements?.includes('PHI') || deal.data_privacy_requirements?.includes('PCI')) {
    mcpServers.push({
      name: 'Compliance & Security MCP',
      purpose: 'Enforce HIPAA/PCI compliance rules, data encryption, and access controls',
      endpoints: [
        '/v1/compliance/validate - Validate requests against compliance rules',
        '/v1/security/encrypt - Encrypt sensitive data fields',
        '/v1/security/decrypt - Decrypt data with proper authorization',
        '/v1/audit/access - Log all PHI/PCI data access with timestamps',
        '/v1/compliance/report - Generate compliance audit reports'
      ]
    });
  }

  if (deal.deployment_preference?.includes('Customer VPC')) {
    mcpServers.push({
      name: 'VPC Network Gateway MCP',
      purpose: 'Manages secure connectivity between Lyzr services and customer VPC resources',
      endpoints: [
        '/v1/network/connect - Establish secure VPN/PrivateLink connections',
        '/v1/network/firewall - Configure VPC security groups and firewall rules',
        '/v1/network/dns - Resolve private DNS names within customer network',
        '/v1/network/monitor - Track network latency and connection health'
      ]
    });
  }

  if (deal.critical_integrations?.includes('Snowflake') || deal.critical_integrations?.includes('SAP')) {
    mcpServers.push({
      name: 'Enterprise Data MCP',
      purpose: 'Optimized data warehouse and ERP connectivity with connection pooling and caching',
      endpoints: [
        '/v1/warehouse/query - Execute optimized data warehouse queries',
        '/v1/warehouse/cache - Manage query result caching for performance',
        '/v1/erp/transaction - Handle transactional ERP operations',
        '/v1/data/lineage - Track data lineage and transformation history'
      ]
    });
  }

  if (mcpServers.length > 0) {
    mcpServers.push({
      name: 'Observability & Monitoring MCP',
      purpose: 'Centralized logging, metrics, and tracing for all MCP operations',
      endpoints: [
        '/v1/metrics/collect - Collect performance and usage metrics',
        '/v1/logs/stream - Stream real-time logs to observability platform',
        '/v1/trace/context - Distributed tracing across all MCP servers',
        '/v1/alerts/trigger - Trigger alerts based on configurable thresholds'
      ]
    });
  }

  return mcpServers;
}

function generateScopeOfWork(deal: DealSubmission, agents: number, hours: number) {
  return `Project Scope Summary:

1. Initial Discovery & Requirements (2 weeks)
   - Stakeholder interviews and requirements gathering
   - Technical architecture design
   - Data flow mapping and integration planning

2. AI Agent Development (${Math.ceil(hours / 40 / 3)} weeks)
   - Development of ${agents} specialized AI agents
   - Agent training and fine-tuning
   - Inter-agent communication protocols

3. Integration Development (${Math.ceil((deal.critical_integrations?.length || 0) * 2)} weeks)
   - Integration with ${deal.critical_integrations?.join(', ') || 'external systems'}
   - API development and testing
   - Data synchronization mechanisms

4. Security & Compliance (3 weeks)
   - Implementation of ${deal.data_privacy_requirements?.join(', ') || 'security'} controls
   - Compliance validation and documentation
   - Security testing and vulnerability assessment

5. Testing & QA (3 weeks)
   - Unit testing of individual agents
   - Integration testing
   - User acceptance testing
   - Performance optimization

6. Deployment & Training (2 weeks)
   - ${deal.deployment_preference?.join(' or ') || 'Production'} deployment
   - User training and documentation
   - Knowledge transfer

7. Post-Launch Support (4 weeks)
   - Monitoring and optimization
   - Bug fixes and enhancements
   - Performance tuning`;
}

function generateTechnicalRequirements(deal: DealSubmission) {
  const requirements = [];

  requirements.push('Cloud infrastructure with auto-scaling capabilities');
  requirements.push('Secure API gateway for external integrations');

  if (deal.data_privacy_requirements?.includes('PHI') || deal.data_privacy_requirements?.includes('PCI')) {
    requirements.push('HIPAA/PCI DSS compliant infrastructure');
    requirements.push('End-to-end encryption for data in transit and at rest');
  }

  if (deal.deployment_preference?.includes('On-Prem')) {
    requirements.push('On-premise deployment capability with containerization');
  }

  if (deal.critical_integrations && deal.critical_integrations.length > 0) {
    requirements.push(`Integration capabilities for ${deal.critical_integrations.length} external systems`);
  }

  requirements.push('Real-time monitoring and logging infrastructure');
  requirements.push('Backup and disaster recovery mechanisms');
  requirements.push('Multi-tenant architecture with data isolation');

  return requirements;
}

function generateRiskFactors(deal: DealSubmission) {
  const risks = [];

  if (deal.target_production_date) {
    const targetDate = new Date(deal.target_production_date);
    const monthsUntilTarget = (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsUntilTarget < 6) {
      risks.push('Aggressive timeline may require additional resources or scope reduction');
    }
  }

  if (deal.critical_integrations && deal.critical_integrations.length > 3) {
    risks.push('Multiple integrations increase complexity and potential points of failure');
  }

  if (deal.deployment_preference?.includes('On-Prem')) {
    risks.push('On-premise deployment may require additional security reviews and infrastructure setup time');
  }

  if (!deal.executive_sponsor_name) {
    risks.push('Lack of executive sponsorship may impact project prioritization and resource allocation');
  }

  if (deal.data_privacy_requirements && deal.data_privacy_requirements.length > 2) {
    risks.push('Multiple compliance requirements may extend validation and certification timeline');
  }

  if (deal.competitors) {
    risks.push('Competitive landscape requires differentiated features and accelerated delivery');
  }

  return risks;
}

function generateRecommendedApproach(deal: DealSubmission, complexity: string) {
  let approach = '';

  if (deal.preferred_path === 'Rapid Prototype (1 week)') {
    approach = `Recommended Approach: Agile Rapid Prototyping

Phase 1 (Week 1): Build minimal viable prototype focusing on core use case
- Demonstrate key AI agent capabilities
- Mock integrations with sample data
- Gather stakeholder feedback

Phase 2 (Weeks 2-4): Iterative development with 2-week sprints
- Implement real integrations
- Expand agent capabilities
- Continuous user feedback and refinement

Phase 3: Production hardening and deployment
- Security and compliance validation
- Performance optimization
- Production deployment and monitoring`;
  } else {
    approach = `Recommended Approach: Phased Pilot Implementation

Phase 1 (Month 1): Foundation
- Complete technical architecture
- Build core AI agents
- Set up development environment

Phase 2 (Month 2): Integration & Testing
- Implement all required integrations
- End-to-end testing
- Security validation

Phase 3 (Month 3): Pilot Deployment
- Deploy to pilot user group
- Gather metrics and feedback
- Optimize based on real usage

Phase 4: Scale & Production
- Full production rollout
- Ongoing support and enhancement`;
  }

  if (complexity === 'Very High' || complexity === 'High') {
    approach += '\n\nGiven the high complexity, we recommend:\n- Dedicated technical architect\n- Weekly stakeholder reviews\n- Incremental delivery of features\n- Comprehensive documentation and knowledge transfer';
  }

  return approach;
}
