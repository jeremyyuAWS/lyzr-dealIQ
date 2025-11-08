export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  delay?: number;
}

export interface ChatScenario {
  name: string;
  color: string;
  conversation: ChatMessage[];
}

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    name: 'Credit Card Dispute AI',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
    conversation: [
      {
        role: 'assistant',
        content: "Hi! I'm here to help you submit a deal opportunity. Let's start with your name?",
        delay: 500
      },
      {
        role: 'user',
        content: 'Rachel M. Okafor',
        delay: 1200
      },
      {
        role: 'assistant',
        content: "Great! What's your email address?",
        delay: 800
      },
      {
        role: 'user',
        content: 'rachel.okafor@firstsource.com',
        delay: 1500
      },
      {
        role: 'assistant',
        content: 'Which company is this opportunity for?',
        delay: 800
      },
      {
        role: 'user',
        content: 'BMO Bank',
        delay: 1000
      },
      {
        role: 'assistant',
        content: 'Can you describe the business problem or pain point in 3-5 sentences?',
        delay: 800
      },
      {
        role: 'user',
        content: 'We handle thousands of credit card disputes monthly, and it takes 7-10 days to resolve each one. Our agents spend 40% of their time doing manual data entry and sending status updates. The systems for fraud detection, dispute intake, and resolution don\'t talk to each other, which creates compliance gaps and frustrates customers who can\'t track their disputes.',
        delay: 3500
      },
      {
        role: 'assistant',
        content: 'What are the expected outcomes or KPIs? What does success look like?',
        delay: 800
      },
      {
        role: 'user',
        content: 'We want to achieve the following:\n\n- **Cut dispute resolution time** from 7-10 days to under 48 hours\n- **Automate 70%** of routine validation work\n- **Hit 95% accuracy** on fraud detection\n- **Ensure 100% compliance** traceability for Canadian banking regulations\n- **Boost customer satisfaction** scores by 35%',
        delay: 3000
      },
      {
        role: 'assistant',
        content: 'When would you like to have this in production? (Please provide a date in YYYY-MM-DD format)',
        delay: 800
      },
      {
        role: 'user',
        content: '2025-09-01',
        delay: 1200
      },
      {
        role: 'assistant',
        content: "What's the budget range for this project? ($250k-$500k, $500k-$1M, or >$1M)",
        delay: 800
      },
      {
        role: 'user',
        content: '$500k-$1M',
        delay: 1000
      },
      {
        role: 'assistant',
        content: 'What stage is this deal currently in? (Intro/Discovery, Prototype, RFP, Shortlist, Negotiation, Closed-Won, or Closed-Lost)',
        delay: 800
      },
      {
        role: 'user',
        content: 'RFP',
        delay: 800
      },
      {
        role: 'assistant',
        content: 'What deployment model do you prefer? (You can mention: Lyzr SaaS, Customer VPC Cloud, or On-Prem)',
        delay: 800
      },
      {
        role: 'user',
        content: 'On-Prem - we need to keep all data within Canadian borders for OSFI compliance',
        delay: 2000
      },
      {
        role: 'assistant',
        content: 'Are there any critical integrations needed? (e.g., Salesforce, ServiceNow, SharePoint, etc.)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Yes, we need integration with Salesforce, Oracle, and our core banking system Temenos. Also need real-time connection to FICO Falcon for fraud detection.',
        delay: 2500
      },
      {
        role: 'assistant',
        content: "Perfect! Your deal has been submitted successfully. 🎉\n\n**Next Steps:**\n\n1. Our Solutions team will review it within **24 hours**\n2. You'll receive a detailed opportunity analysis\n3. We'll reach out to schedule a technical deep-dive\n\nWould you like to submit another deal?",
        delay: 1000
      }
    ]
  },
  {
    name: 'IT Support Knowledge Base AI',
    color: 'bg-green-100 text-green-700 hover:bg-green-200 border-green-300',
    conversation: [
      {
        role: 'assistant',
        content: "Hi! I'm here to help you submit a deal opportunity. Let's start with your name?",
        delay: 500
      },
      {
        role: 'user',
        content: 'Kenji Watanabe',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "Great! What's your email address?",
        delay: 800
      },
      {
        role: 'user',
        content: 'kenji.watanabe@movate.com',
        delay: 1500
      },
      {
        role: 'assistant',
        content: 'Which company is this opportunity for?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Global Technology Services Inc',
        delay: 1200
      },
      {
        role: 'assistant',
        content: 'Can you describe the business problem or pain point in 3-5 sentences?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Our IT support teams are facing significant challenges:\n\n- Knowledge base is **always outdated**\n- **60% of tickets get escalated** - agents can\'t find answers\n- Each complex ticket takes **45 minutes** searching multiple systems\n- Knowledge gaps discovered *reactively* after incidents',
        delay: 3200
      },
      {
        role: 'assistant',
        content: 'What are the expected outcomes or KPIs? What does success look like?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Cut escalations by 40%. Reduce average handle time from 45 minutes to 20. Automatically identify and fill 80% of knowledge gaps. Get first-contact resolution up to 90%. Create 100+ new KB articles per quarter without manual work.',
        delay: 2800
      },
      {
        role: 'assistant',
        content: 'When would you like to have this in production? (Please provide a date in YYYY-MM-DD format)',
        delay: 800
      },
      {
        role: 'user',
        content: '2025-08-15',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "What's the budget range for this project? ($250k-$500k, $500k-$1M, or >$1M)",
        delay: 800
      },
      {
        role: 'user',
        content: '$250k-$500k',
        delay: 1000
      },
      {
        role: 'assistant',
        content: 'What stage is this deal currently in? (Intro/Discovery, Prototype, RFP, Shortlist, Negotiation, Closed-Won, or Closed-Lost)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Prototype',
        delay: 800
      },
      {
        role: 'assistant',
        content: 'What deployment model do you prefer? (You can mention: Lyzr SaaS, Customer VPC Cloud, or On-Prem)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Customer VPC Cloud - we need control over our proprietary system configurations',
        delay: 1800
      },
      {
        role: 'assistant',
        content: 'Are there any critical integrations needed? (e.g., Salesforce, ServiceNow, SharePoint, etc.)',
        delay: 800
      },
      {
        role: 'user',
        content: 'ServiceNow for tickets and KB publishing, Confluence for our knowledge repository, and Jira for tracking enhancements',
        delay: 2200
      },
      {
        role: 'assistant',
        content: "Perfect! Your deal has been submitted successfully. Our Solutions team will review it within 24 hours and reach out to you. Would you like to submit another deal?",
        delay: 1000
      }
    ]
  },
  {
    name: 'Patient Intake & Eligibility',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
    conversation: [
      {
        role: 'assistant',
        content: "Hi! I'm here to help you submit a deal opportunity. Let's start with your name?",
        delay: 500
      },
      {
        role: 'user',
        content: 'Aditi Menon',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "Great! What's your email address?",
        delay: 800
      },
      {
        role: 'user',
        content: 'aditi.menon@aws.com',
        delay: 1500
      },
      {
        role: 'assistant',
        content: 'Which company is this opportunity for?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Regional Healthcare Network',
        delay: 1200
      },
      {
        role: 'assistant',
        content: 'Can you describe the business problem or pain point in 3-5 sentences?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Patient intake takes 15-20 minutes of manual work collecting insurance info and doing data entry. We verify eligibility AFTER booking appointments, so we have a 25% denial rate. Wrong or missing insurance info delays revenue collection by 45 days on average. Our staff is burned out from repetitive data entry.',
        delay: 3000
      },
      {
        role: 'assistant',
        content: 'What are the expected outcomes or KPIs? What does success look like?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Get intake down to under 5 minutes. Hit 98% accuracy on eligibility verification BEFORE appointments. Cut claim denials by 60%. Boost staff satisfaction by 40%. Speed up revenue collection by 30 days.',
        delay: 2500
      },
      {
        role: 'assistant',
        content: 'When would you like to have this in production? (Please provide a date in YYYY-MM-DD format)',
        delay: 800
      },
      {
        role: 'user',
        content: '2025-10-01',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "What's the budget range for this project? ($250k-$500k, $500k-$1M, or >$1M)",
        delay: 800
      },
      {
        role: 'user',
        content: '>$1M',
        delay: 900
      },
      {
        role: 'assistant',
        content: 'What stage is this deal currently in? (Intro/Discovery, Prototype, RFP, Shortlist, Negotiation, Closed-Won, or Closed-Lost)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Shortlist',
        delay: 800
      },
      {
        role: 'assistant',
        content: 'What deployment model do you prefer? (You can mention: Lyzr SaaS, Customer VPC Cloud, or On-Prem)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Customer VPC Cloud - HIPAA compliant with PHI encryption',
        delay: 1600
      },
      {
        role: 'assistant',
        content: 'Are there any critical integrations needed? (e.g., Salesforce, ServiceNow, SharePoint, etc.)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Epic EHR using HL7 and FHIR, Availity for payer eligibility checks, and Waystar for coverage discovery. All need real-time APIs.',
        delay: 2400
      },
      {
        role: 'assistant',
        content: "Perfect! Your deal has been submitted successfully. Our Solutions team will review it within 24 hours and reach out to you. Would you like to submit another deal?",
        delay: 1000
      }
    ]
  },
  {
    name: 'Sales Forecasting Copilot',
    color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-300',
    conversation: [
      {
        role: 'assistant',
        content: "Hi! I'm here to help you submit a deal opportunity. Let's start with your name?",
        delay: 500
      },
      {
        role: 'user',
        content: 'Ethan Caldwell',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "Great! What's your email address?",
        delay: 800
      },
      {
        role: 'user',
        content: 'ethan.caldwell@aws.com',
        delay: 1500
      },
      {
        role: 'assistant',
        content: 'Which company is this opportunity for?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Enterprise Software Corp',
        delay: 1200
      },
      {
        role: 'assistant',
        content: 'Can you describe the business problem or pain point in 3-5 sentences?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Our quarterly forecasting takes 2 weeks of manual spreadsheet work. Sales leadership doesn\'t trust the numbers - we\'re off by 30% on average. We don\'t systematically look at historical patterns or seasonality. No way to automatically spot at-risk deals. Limited ability to run what-if scenarios for planning.',
        delay: 3200
      },
      {
        role: 'assistant',
        content: 'What are the expected outcomes or KPIs? What does success look like?',
        delay: 800
      },
      {
        role: 'user',
        content: 'Cut forecasting time from 2 weeks to 2 days. Get variance down to within 10%. Auto-detect 95% of at-risk deals. Enable real-time scenario planning. Increase revenue predictability by 40%.',
        delay: 2600
      },
      {
        role: 'assistant',
        content: 'When would you like to have this in production? (Please provide a date in YYYY-MM-DD format)',
        delay: 800
      },
      {
        role: 'user',
        content: '2025-06-30',
        delay: 1000
      },
      {
        role: 'assistant',
        content: "What's the budget range for this project? ($250k-$500k, $500k-$1M, or >$1M)",
        delay: 800
      },
      {
        role: 'user',
        content: '$500k-$1M',
        delay: 1000
      },
      {
        role: 'assistant',
        content: 'What stage is this deal currently in? (Intro/Discovery, Prototype, RFP, Shortlist, Negotiation, Closed-Won, or Closed-Lost)',
        delay: 800
      },
      {
        role: 'user',
        content: 'RFP',
        delay: 800
      },
      {
        role: 'assistant',
        content: 'What deployment model do you prefer? (You can mention: Lyzr SaaS, Customer VPC Cloud, or On-Prem)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Customer VPC Cloud - pipeline data has competitive intelligence we need to protect',
        delay: 1900
      },
      {
        role: 'assistant',
        content: 'Are there any critical integrations needed? (e.g., Salesforce, ServiceNow, SharePoint, etc.)',
        delay: 800
      },
      {
        role: 'user',
        content: 'Salesforce for CRM and opportunity data, Snowflake for our historical data warehouse, plus Tableau for dashboards',
        delay: 2200
      },
      {
        role: 'assistant',
        content: "Perfect! Your deal has been submitted successfully. Our Solutions team will review it within 24 hours and reach out to you. Would you like to submit another deal?",
        delay: 1000
      }
    ]
  }
];
