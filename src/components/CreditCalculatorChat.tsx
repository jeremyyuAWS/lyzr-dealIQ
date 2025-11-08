import { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, Bot, User, TrendingUp, FileText, Download } from 'lucide-react';
import { DealSubmission } from '../types';
import { DEMO_SCENARIOS, CreditEstimate, ScenarioInputs } from '../types/agentPricing';
import { estimateCredits, formatCreditDisplay, formatUSDDisplay, convertToOldPricing } from '../utils/creditEstimator';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  estimate?: CreditEstimate;
  showDetails?: boolean;
}

interface ChatState {
  mode: 'welcome' | 'demo' | 'custom' | 'qualifyUnit' | 'qualifyCount' | 'complete';
  customScenario?: string;
  customUnit?: string;
  customCount?: number;
}

interface CreditCalculatorChatProps {
  onExportToForm?: (data: Partial<DealSubmission>) => void;
}

const WELCOME_MESSAGE = `Hey! I'll estimate credits for your workflow or business process automation.

**Lyzr follows a transparent, effort-based pricing model.** Credit usage is calculated based on agent actions. High-effort tasks like deep research consume more credits, while low-effort tasks like website chat consume fewer credits. Our billing granularity extends down to 1/1000th of a credit.

**Lyzr does not mark up your LLM costs.** If you bring your own models, you pay the model provider directly. We maintain complete transparency in our pricing.

**1 Credit = 1 USD**

What would you like to do?
• Type **"demo"** to see example scenarios
• Type **"calculate"** to estimate your own scenario`;

export default function CreditCalculatorChat({ onExportToForm }: CreditCalculatorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({ mode: 'welcome' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatEstimateMessage = (estimate: CreditEstimate, isDemo: boolean = false): string => {
    const lightOld = convertToOldPricing(estimate.light.monthlyTotal30dC);
    const heavyOld = convertToOldPricing(estimate.heavy.monthlyTotal30dC);

    const formatAssumptions = (inputs: ScenarioInputs): string => {
      const items: string[] = [];
      if (inputs.pagesChecked > 0) items.push(`${inputs.pagesChecked} pages checked`);
      if (inputs.extraPages > 0) items.push(`${inputs.extraPages} extra pages`);
      if (inputs.knowledgeLookups > 0) items.push(`${inputs.knowledgeLookups} knowledge lookups`);
      if (inputs.memorySteps > 0) items.push(`${inputs.memorySteps} memory steps`);
      if (inputs.apiActions > 0) items.push(`${inputs.apiActions} API actions`);
      if (inputs.safetyChecks > 0) items.push(`${inputs.safetyChecks} safety checks`);
      if (inputs.agentChatterTokens > 0) items.push(`${inputs.agentChatterTokens.toLocaleString()} agent tokens`);
      return items.join('; ');
    };

    let message = `## ${estimate.scenario} ${isDemo ? '(demo)' : ''}\n\n`;

    message += `### Light Usage\n`;
    message += `**≈ ${formatCreditDisplay(estimate.light.perUnitTotalC)} C per ${estimate.unit}** → **${formatCreditDisplay(estimate.light.monthlyTotal30dC)} C / 30 days** (${formatUSDDisplay(estimate.light.monthlyTotal30dC)})\n`;
    message += `*Assumptions: ${formatAssumptions(estimate.light.inputs)}*\n\n`;
    message += `**New Pricing:** ${formatCreditDisplay(estimate.light.monthlyTotal30dC)} C = ${formatUSDDisplay(estimate.light.monthlyTotal30dC)}\n`;
    message += `**Old Pricing:** ${lightOld.creditsOld.toFixed(0)} C = ${formatUSDDisplay(lightOld.usd)}\n\n`;

    message += `### Heavy Usage\n`;
    message += `**≈ ${formatCreditDisplay(estimate.heavy.perUnitTotalC)} C per ${estimate.unit}** → **${formatCreditDisplay(estimate.heavy.monthlyTotal30dC)} C / 30 days** (${formatUSDDisplay(estimate.heavy.monthlyTotal30dC)})\n`;
    message += `*Assumptions: ${formatAssumptions(estimate.heavy.inputs)}*\n\n`;
    message += `**New Pricing:** ${formatCreditDisplay(estimate.heavy.monthlyTotal30dC)} C = ${formatUSDDisplay(estimate.heavy.monthlyTotal30dC)}\n`;
    message += `**Old Pricing:** ${heavyOld.creditsOld.toFixed(0)} C = ${formatUSDDisplay(heavyOld.usd)}\n\n`;

    if (estimate.flags.tokensSoftLimitPerUnit || estimate.flags.callCountSoftLimitPerUnit) {
      message += `⚠️ **Heads-up:** That's quite a lot for one ${estimate.unit}. We can confirm before running.\n\n`;
    }

    message += `*${estimate.notes}*\n\n`;
    message += `Type **"show details"** for line-item breakdown or **"export"** to fill the intake form.`;

    return message;
  };

  const showDemoScenarios = () => {
    let response = `Here are 3 common scenarios:\n\n`;

    DEMO_SCENARIOS.forEach((scenario, idx) => {
      response += `**${idx + 1}. ${scenario.name}**\n${scenario.description}\n`;
      response += `Type **"${idx + 1}"** to see the estimate\n\n`;
    });

    response += `Or type **"calculate"** to estimate your own scenario.`;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: response
    }]);
    setChatState({ mode: 'demo' });
  };

  const showDemoEstimate = (scenarioIndex: number) => {
    const scenario = DEMO_SCENARIOS[scenarioIndex];
    const estimate = estimateCredits(
      scenario.name,
      scenario.unit,
      scenario.unitsPerMonth,
      scenario.light,
      scenario.heavy
    );

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: formatEstimateMessage(estimate, true),
      estimate,
      showDetails: false
    }]);
    setChatState({ mode: 'complete' });
  };

  const startCustomCalculation = () => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! Let's calculate credits for your scenario.\n\n**1) What should I count as one unit of work?**\n(e.g., "a blog post", "a customer support ticket", "a research report")`
    }]);
    setChatState({ mode: 'qualifyUnit' });
  };

  const processUnitResponse = (response: string) => {
    setChatState({ mode: 'qualifyCount', customUnit: response });
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Perfect! Now **2) How many ${response}s in a 30-day month?**\n(An estimate is fine)`
    }]);
  };

  const processCountResponse = (response: string) => {
    const count = parseInt(response, 10);
    if (isNaN(count) || count <= 0) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Please provide a valid number greater than 0.`
      }]);
      return;
    }

    const unit = chatState.customUnit || 'unit';

    const lightInputs: ScenarioInputs = {
      pagesChecked: 2,
      extraPages: 0,
      knowledgeLookups: 1,
      memorySteps: 0,
      apiActions: 2,
      safetyChecks: 0,
      agentChatterTokens: 15000,
    };

    const heavyInputs: ScenarioInputs = {
      pagesChecked: 5,
      extraPages: 3,
      knowledgeLookups: 4,
      memorySteps: 2,
      apiActions: 8,
      safetyChecks: 1,
      agentChatterTokens: 60000,
    };

    const estimate = estimateCredits(
      chatState.customScenario || 'Custom Workflow',
      unit,
      count,
      lightInputs,
      heavyInputs
    );

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: formatEstimateMessage(estimate),
      estimate,
      showDetails: false
    }]);
    setChatState({ mode: 'complete' });
  };

  const showDetails = (messageId: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId && msg.estimate) {
        const details = formatDetailedBreakdown(msg.estimate);
        return {
          ...msg,
          showDetails: true,
          content: msg.content + '\n\n' + details
        };
      }
      return msg;
    }));
  };

  const formatDetailedBreakdown = (estimate: CreditEstimate): string => {
    let details = `## Detailed Breakdown\n\n`;

    details += `### Light Usage - Per ${estimate.unit}\n`;
    estimate.light.perUnitBreakdown.forEach(item => {
      details += `• **${item.resource}:** ${item.units} × ${formatCreditDisplay(item.rateCPerUnit)} C = ${formatCreditDisplay(item.creditsC)} C\n`;
    });
    details += `**Total per ${estimate.unit}:** ${formatCreditDisplay(estimate.light.perUnitTotalC)} C\n\n`;

    details += `### Heavy Usage - Per ${estimate.unit}\n`;
    estimate.heavy.perUnitBreakdown.forEach(item => {
      details += `• **${item.resource}:** ${item.units} × ${formatCreditDisplay(item.rateCPerUnit)} C = ${formatCreditDisplay(item.creditsC)} C\n`;
    });
    details += `**Total per ${estimate.unit}:** ${formatCreditDisplay(estimate.heavy.perUnitTotalC)} C\n\n`;

    return details;
  };

  const exportToForm = (estimate: CreditEstimate) => {
    if (!onExportToForm) return;

    const formData: Partial<DealSubmission> = {
      problem_statement: `Automated workflow: ${estimate.scenario}. Processing approximately ${estimate.unitsPer30d} ${estimate.unit}s per month.`,
      expected_outcomes: `Light usage: ~${formatCreditDisplay(estimate.light.monthlyTotal30dC)} C/month. Heavy usage: ~${formatCreditDisplay(estimate.heavy.monthlyTotal30dC)} C/month.`,
    };

    onExportToForm(formData);

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ **Exported to intake form!** Switch to the Form tab to complete your submission.`
    }]);
  };

  const downloadJSON = (estimate: CreditEstimate) => {
    const json = JSON.stringify(estimate, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lyzr-credit-estimate-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ **JSON downloaded!** You can use this for your records or planning.`
    }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim().toLowerCase();
    setInput('');

    setTimeout(() => {
      if (chatState.mode === 'welcome') {
        if (userInput.includes('demo')) {
          showDemoScenarios();
        } else if (userInput.includes('calc')) {
          startCustomCalculation();
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Please type **"demo"** to see examples or **"calculate"** to estimate your scenario.`
          }]);
        }
      } else if (chatState.mode === 'demo') {
        const num = parseInt(userInput, 10);
        if (num >= 1 && num <= DEMO_SCENARIOS.length) {
          showDemoEstimate(num - 1);
        } else if (userInput.includes('calc')) {
          startCustomCalculation();
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Please select a scenario (1-${DEMO_SCENARIOS.length}) or type **"calculate"**.`
          }]);
        }
      } else if (chatState.mode === 'qualifyUnit') {
        processUnitResponse(input.trim());
      } else if (chatState.mode === 'qualifyCount') {
        processCountResponse(input.trim());
      } else if (chatState.mode === 'complete') {
        if (userInput.includes('detail')) {
          const lastEstimateMsg = messages.filter(m => m.estimate).pop();
          if (lastEstimateMsg) {
            showDetails(lastEstimateMsg.id);
          }
        } else if (userInput.includes('export')) {
          const lastEstimateMsg = messages.filter(m => m.estimate).pop();
          if (lastEstimateMsg && lastEstimateMsg.estimate) {
            exportToForm(lastEstimateMsg.estimate);
          }
        } else if (userInput.includes('download') || userInput.includes('json')) {
          const lastEstimateMsg = messages.filter(m => m.estimate).pop();
          if (lastEstimateMsg && lastEstimateMsg.estimate) {
            downloadJSON(lastEstimateMsg.estimate);
          }
        } else if (userInput.includes('demo')) {
          showDemoScenarios();
        } else if (userInput.includes('calc')) {
          startCustomCalculation();
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Type **"show details"**, **"export"**, **"download"**, or start a new calculation with **"demo"** or **"calculate"**.`
          }]);
        }
      }
    }, 300);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <Bot className="h-5 w-5 stroke-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    code: ({ children }) => (
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                        message.role === 'user' ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        {children}
                      </code>
                    ),
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>,
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline hover:no-underline ${
                          message.role === 'user' ? 'text-blue-300' : 'text-blue-600'
                        }`}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              {message.estimate && message.role === 'assistant' && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {!message.showDetails && (
                    <button
                      onClick={() => showDetails(message.id)}
                      className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium flex items-center gap-1.5"
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      Show Details
                    </button>
                  )}
                  <button
                    onClick={() => exportToForm(message.estimate!)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Export to Form
                  </button>
                  <button
                    onClick={() => downloadJSON(message.estimate!)}
                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium flex items-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download JSON
                  </button>
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 stroke-black" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Type "demo" to see examples or "calculate" to estimate your own</p>
      </div>
    </div>
  );
}
