import { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, Bot, User, Play, Square } from 'lucide-react';
import { DealSubmission } from '../types';
import { CHAT_SCENARIOS, ChatMessage } from '../data/chatScenarios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  step: number;
  data: Partial<DealSubmission>;
}

interface ChatInterfaceProps {
  onDataUpdate?: (data: Partial<DealSubmission>) => void;
}

const QUESTIONS = [
  { key: 'requestor_name', question: "Hi! I'm here to help you submit a deal opportunity. Let's start with your name?" },
  { key: 'requestor_email', question: "Great! What's your email address?" },
  { key: 'company', question: "Which company is this opportunity for?" },
  { key: 'problem_statement', question: "Can you describe the business problem or pain point in 3-5 sentences?" },
  { key: 'expected_outcomes', question: "What are the expected outcomes or KPIs? What does success look like?" },
  { key: 'target_production_date', question: "When would you like to have this in production? (Please provide a date in YYYY-MM-DD format)" },
  { key: 'budget_band', question: "What's the budget range for this project? ($250k-$500k, $500k-$1M, or >$1M)" },
  { key: 'deal_stage', question: "What stage is this deal currently in? (Intro/Discovery, Prototype, RFP, Shortlist, Negotiation, Closed-Won, or Closed-Lost)" },
  { key: 'deployment_preference', question: "What deployment model do you prefer? (You can mention: Lyzr SaaS, Customer VPC Cloud, or On-Prem)" },
  { key: 'critical_integrations', question: "Are there any critical integrations needed? (e.g., Salesforce, ServiceNow, SharePoint, etc.)" },
];

export default function ChatInterface({ onDataUpdate }: ChatInterfaceProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: QUESTIONS[0].question }
  ]);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({ step: 0, data: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processUserResponse = (response: string, currentStep: number): Partial<DealSubmission> => {
    const currentQuestion = QUESTIONS[currentStep];
    const updatedData = { ...chatState.data };

    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }

    switch (currentQuestion.key) {
      case 'requestor_name':
      case 'requestor_email':
      case 'company':
      case 'problem_statement':
      case 'expected_outcomes':
      case 'target_production_date':
      case 'budget_band':
      case 'deal_stage':
        updatedData[currentQuestion.key as keyof DealSubmission] = response as any;
        break;

      case 'deployment_preference':
      case 'critical_integrations':
        const items = response.split(',').map(item => item.trim()).filter(Boolean);
        updatedData[currentQuestion.key as keyof DealSubmission] = items as any;
        break;
    }

    return updatedData;
  };

  const submitDeal = async (data: Partial<DealSubmission>) => {
    try {
      console.log('Deal submission:', data);

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Perfect! Your deal has been submitted successfully. Our Solutions team will review it within 24 hours and reach out to you. Would you like to submit another deal?"
      }]);

      setChatState({ step: 0, data: {} });
    } catch (error) {
      console.error('Submission error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, there was an error submitting your deal. Please try again or use the form tab."
      }]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const updatedData = processUserResponse(input.trim(), chatState.step);
    const nextStep = chatState.step + 1;

    if (nextStep >= QUESTIONS.length) {
      setIsSubmitting(true);
      await submitDeal(updatedData);
      setIsSubmitting(false);
    } else {
      setChatState({ step: nextStep, data: updatedData });

      if (onDataUpdate) {
        onDataUpdate(updatedData);
      }

      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: QUESTIONS[nextStep].question
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 500);
    }
  };

  const resetChat = () => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    setMessages([
      { id: '0', role: 'assistant', content: QUESTIONS[0].question }
    ]);
    setChatState({ step: 0, data: {} });
    setIsAutoPlaying(false);
    setShowScenarios(false);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    setIsAutoPlaying(false);
  };

  const playScenario = (scenarioIndex: number) => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    const scenario = CHAT_SCENARIOS[scenarioIndex];
    setMessages([]);
    setChatState({ step: 0, data: {} });
    setIsAutoPlaying(true);
    setShowScenarios(false);

    let messageIndex = 0;
    let cumulativeDelay = 0;

    const playNextMessage = () => {
      if (messageIndex >= scenario.conversation.length) {
        setIsAutoPlaying(false);
        return;
      }

      const chatMsg = scenario.conversation[messageIndex];
      const newMessage: Message = {
        id: `${Date.now()}-${messageIndex}`,
        role: chatMsg.role,
        content: chatMsg.content
      };

      setMessages(prev => [...prev, newMessage]);
      messageIndex++;

      if (messageIndex < scenario.conversation.length) {
        const nextDelay = scenario.conversation[messageIndex].delay || 1000;
        autoPlayTimeoutRef.current = setTimeout(playNextMessage, nextDelay);
      } else {
        setIsAutoPlaying(false);
      }
    };

    const firstDelay = scenario.conversation[0].delay || 500;
    autoPlayTimeoutRef.current = setTimeout(playNextMessage, firstDelay);
  };

  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-black text-lg">Deal Assistant Chat</h3>
            <p className="text-xs text-gray-600">Natural conversation to submit opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            {isAutoPlaying ? (
              <button
                onClick={stopAutoPlay}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Square className="h-4 w-4" fill="white" />
                Stop Demo
              </button>
            ) : (
              <button
                onClick={() => setShowScenarios(!showScenarios)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Play className="h-4 w-4" />
                {showScenarios ? 'Hide Demos' : 'Play Demo'}
              </button>
            )}
          </div>
        </div>
        {showScenarios && !isAutoPlaying && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {CHAT_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                onClick={() => playScenario(index)}
                className={`px-3 py-2 rounded-lg border-2 transition-all text-xs font-medium ${scenario.color}`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        )}
      </div>
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
              className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 stroke-black" />
              </div>
            )}
          </div>
        ))}
        {isSubmitting && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Bot className="h-5 w-5 stroke-white" />
            </div>
            <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        {isAutoPlaying && (
          <div className="mb-3 bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-3">
            <p className="text-sm text-blue-900 font-medium">
              Demo in progress... Watch the conversation flow between chat and form.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            disabled={isSubmitting || isAutoPlaying}
            rows={3}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-black disabled:opacity-50 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSubmitting || isAutoPlaying}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        {chatState.step >= QUESTIONS.length && (
          <button
            onClick={resetChat}
            className="mt-3 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Start a new submission
          </button>
        )}
      </div>
    </div>
  );
}
