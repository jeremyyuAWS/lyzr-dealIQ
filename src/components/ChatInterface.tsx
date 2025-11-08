import { useState, FormEvent, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { supabase, DealSubmission } from '../lib/supabase';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const { error } = await supabase
        .from('deal_submissions')
        .insert([data]);

      if (error) throw error;

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
    setMessages([
      { id: '0', role: 'assistant', content: QUESTIONS[0].question }
    ]);
    setChatState({ step: 0, data: {} });
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
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your response..."
            disabled={isSubmitting}
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
            disabled={!input.trim() || isSubmitting}
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
