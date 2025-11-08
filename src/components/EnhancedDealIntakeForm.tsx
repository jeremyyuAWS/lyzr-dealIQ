import { useState, FormEvent, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle2, Sparkles, User, FileText, Settings, Briefcase, Paperclip, Save, Clock, Gauge } from 'lucide-react';
import { supabase, DealSubmission } from '../lib/supabase';
import { SCENARIOS, Scenario } from '../data/scenarios';
import FormProgressIndicator from './FormProgressIndicator';
import CollapsibleSection from './CollapsibleSection';
import { useFormDraft } from '../hooks/useFormDraft';
import UserAnalysisResult from './UserAnalysisResult';
import AttachmentCard from './AttachmentCard';
import { APP_CONFIG } from '../config/appConfig';

const REGIONS = ['NA', 'EMEA', 'APAC', 'India', 'LATAM'];
const PREFERRED_PATHS = ['Rapid Prototype (1 week)', 'Paid Pilot (3 months)'];
const DEPLOYMENT_OPTIONS = ['Lyzr SaaS', 'Customer VPC (Cloud)', 'On-Prem'];
const DATA_PRIVACY_OPTIONS = ['PII', 'PHI', 'PCI', 'Confidential', 'US-only', 'EU-only', 'Other'];
const INTEGRATION_OPTIONS = [
  'Microsoft SharePoint',
  'Salesforce',
  'ServiceNow',
  'SAP',
  'Oracle',
  'Workday',
  'Jira',
  'Confluence',
  'Snowflake',
  'Databricks',
  'Other'
];
const BUDGET_BANDS = ['$250k–$500k', '$500k–$1M', '>$1M'];
const DEAL_STAGES = [
  'Intro/Discovery',
  'Prototype',
  'RFP',
  'Shortlist',
  'Negotiation',
  'Closed-Won',
  'Closed-Lost'
];

interface FormErrors {
  [key: string]: string;
}

const FORM_STEPS = [
  { id: 'contact', label: 'Contact' },
  { id: 'project', label: 'Project' },
  { id: 'technical', label: 'Technical' },
  { id: 'business', label: 'Business' },
  { id: 'attachments', label: 'Attachments' },
];

export default function EnhancedDealIntakeForm() {
  const {
    formData,
    updateFormData,
    setFormData,
    isSaving,
    lastSaved,
    clearDraft,
  } = useFormDraft({
    deployment_preference: [],
    data_privacy_requirements: [],
    critical_integrations: [],
    attachments: []
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [submittedDeal, setSubmittedDeal] = useState<DealSubmission | null>(null);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast' | 'instant'>('normal');
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [shouldFillStep, setShouldFillStep] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldFillStep && isAutoFilling && activeScenario && !isTyping) {
      setShouldFillStep(false);
      fillCurrentStep(activeScenario);
    }
  }, [shouldFillStep]);

  const getSpeedMultiplier = () => {
    switch (typingSpeed) {
      case 'slow': return 2.0;
      case 'normal': return 1.0;
      case 'fast': return 0.3;
      case 'instant': return 0;
      default: return 1.0;
    }
  };

  const typeText = async (fieldName: string, text: string, baseDelay = 20): Promise<void> => {
    const multiplier = getSpeedMultiplier();

    if (multiplier === 0) {
      updateFormData({ [fieldName]: text });
      return Promise.resolve();
    }

    const delay = baseDelay * multiplier;

    return new Promise((resolve) => {
      let index = 0;

      const typeChar = () => {
        if (index < text.length) {
          const currentText = text.substring(0, index + 1);
          updateFormData({ [fieldName]: currentText });
          index++;
          typingTimeoutRef.current = setTimeout(typeChar, delay);
        } else {
          resolve();
        }
      };

      typeChar();
    });
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ['requestor_name', 'requestor_email', 'company', 'region', 'business_unit'];
      case 1:
        return ['problem_statement', 'expected_outcomes', 'target_production_date', 'preferred_path'];
      case 2:
        return ['deployment_preference', 'data_privacy_requirements', 'data_notes', 'critical_integrations', 'integration_notes'];
      case 3:
        return ['executive_sponsor_name', 'executive_sponsor_email', 'budget_band', 'deal_stage', 'competitors', 'win_factors'];
      case 4:
        return ['attachments'];
      default:
        return [];
    }
  };

  const loadScenario = async (scenario: Scenario) => {
    if (isTyping) return;

    setActiveScenario(scenario);
    setIsAutoFilling(true);
    await fillCurrentStep(scenario);
  };

  const fillCurrentStep = async (scenario: Scenario) => {
    const fieldsForCurrentStep = getFieldsForStep(currentStep);

    if (fieldsForCurrentStep.length === 0) {
      setIsAutoFilling(false);
      setActiveScenario(null);
      return;
    }

    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 300));

    for (const field of fieldsForCurrentStep) {
      const value = scenario.data[field as keyof DealSubmission];
      if (!value) continue;

      const multiplier = getSpeedMultiplier();
      const skipDelays = multiplier === 0;

      if (field === 'attachments' && Array.isArray(value)) {
        if (skipDelays) {
          const limitedAttachments = value.slice(0, 2);
          for (let i = 0; i < limitedAttachments.length; i++) {
            const currentAttachments = limitedAttachments.slice(0, i + 1);
            updateFormData({ attachments: currentAttachments });
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        } else {
          const limitedAttachments = value.slice(0, 2);
          for (let i = 0; i < limitedAttachments.length; i++) {
            const attachment = limitedAttachments[i];
            await new Promise(resolve => setTimeout(resolve, 1200 * multiplier));

            const currentAttachments = limitedAttachments.slice(0, i + 1);
            updateFormData({ attachments: currentAttachments });

            await new Promise(resolve => setTimeout(resolve, 1800 * multiplier));
          }
        }
      } else if (typeof value === 'string') {
        const delay = field === 'problem_statement' || field === 'expected_outcomes' ? 8 :
                     field === 'requestor_name' || field === 'company' ? 30 :
                     field === 'requestor_email' || field === 'executive_sponsor_email' ? 25 : 15;
        await typeText(field, value, delay);
        if (!skipDelays) await new Promise(resolve => setTimeout(resolve, 200 * multiplier));
      } else if (Array.isArray(value)) {
        if (skipDelays) {
          updateFormData({ [field]: value });
        } else {
          for (let i = 0; i < value.length; i++) {
            const currentArray = value.slice(0, i + 1);
            updateFormData({ [field]: currentArray });
            await new Promise(resolve => setTimeout(resolve, 300 * multiplier));
          }
          await new Promise(resolve => setTimeout(resolve, 200 * multiplier));
        }
      } else {
        updateFormData({ [field]: value });
        if (!skipDelays) await new Promise(resolve => setTimeout(resolve, 150 * multiplier));
      }
    }

    setIsTyping(false);

    if (currentStep === FORM_STEPS.length - 1) {
      setIsAutoFilling(false);
    }
  };


  const getStepCompletionStatus = () => {
    const contactComplete = !!(formData.requestor_name && formData.requestor_email);
    const projectComplete = !!(formData.problem_statement && formData.expected_outcomes && formData.target_production_date);
    const technicalComplete = !!(formData.deployment_preference && formData.deployment_preference.length > 0);
    const businessComplete = !!(formData.budget_band || formData.deal_stage);
    const attachmentsComplete = !!(formData.attachments && formData.attachments.length > 0);

    return [contactComplete, projectComplete, technicalComplete, businessComplete, attachmentsComplete];
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.requestor_name?.trim()) {
      newErrors.requestor_name = 'Requestor name is required';
    }
    if (!formData.requestor_email?.trim()) {
      newErrors.requestor_email = 'Requestor email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.requestor_email)) {
      newErrors.requestor_email = 'Invalid email format';
    }
    if (!formData.problem_statement?.trim()) {
      newErrors.problem_statement = 'Problem statement is required';
    }
    if (!formData.expected_outcomes?.trim()) {
      newErrors.expected_outcomes = 'Expected outcomes are required';
    }
    if (!formData.target_production_date) {
      newErrors.target_production_date = 'Target production date is required';
    }
    if (formData.executive_sponsor_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.executive_sponsor_email)) {
      newErrors.executive_sponsor_email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isAutoFilling) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const isDemoSubmission = isAutoFilling || activeScenario;
      const useDemoMode = isDemoSubmission || !APP_CONFIG.enableDatabase;

      if (useDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const simulatedData = {
          ...formData,
          id: `demo-${Date.now()}`,
          created_at: new Date().toISOString()
        };

        clearDraft();
        setSubmittedDeal(simulatedData as DealSubmission);
        setFormData({
          deployment_preference: [],
          data_privacy_requirements: [],
          critical_integrations: [],
          attachments: []
        });
        setErrors({});
        setCurrentStep(0);
        setIsAutoFilling(false);
        setActiveScenario(null);
      } else {
        const { data, error } = await supabase
          .from('deal_submissions')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;

        clearDraft();
        setSubmittedDeal(data);
        setFormData({
          deployment_preference: [],
          data_privacy_requirements: [],
          critical_integrations: [],
          attachments: []
        });
        setErrors({});
        setCurrentStep(0);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit deal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiSelect = (field: string, value: string) => {
    const currentValues = (formData[field as keyof DealSubmission] as string[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFormData({ [field]: newValues });
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;

    const attachments = formData.attachments || [];
    attachments.push({
      type: 'url',
      name: urlInput,
      url: urlInput
    });
    updateFormData({ attachments });
    setUrlInput('');
  };

  const removeAttachment = (index: number) => {
    const attachments = [...(formData.attachments || [])];
    attachments.splice(index, 1);
    updateFormData({ attachments });
  };

  const updateAttachment = (index: number, updates: Partial<typeof formData.attachments[0]>) => {
    const attachments = [...(formData.attachments || [])];
    attachments[index] = { ...attachments[index], ...updates };
    updateFormData({ attachments });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const attachments = formData.attachments || [];
    Array.from(files).forEach(file => {
      attachments.push({
        type: 'file',
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size
      });
    });
    updateFormData({ attachments });
  };

  const completionStatus = getStepCompletionStatus();
  const steps = FORM_STEPS.map((step, index) => ({
    ...step,
    isComplete: completionStatus[index],
  }));

  if (submittedDeal) {
    return (
      <UserAnalysisResult
        dealData={submittedDeal}
        onClose={() => {
          setSubmittedDeal(null);
        }}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <FormProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lyzr-logo-cut.png" alt="Lyzr" className="h-10" />
            <div>
              <h1 className="text-2xl font-bold text-black mb-1">Submit a Deal Opportunity</h1>
              <p className="text-sm text-gray-600">Complete the form below or use the AI assistant</p>
            </div>
          </div>
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {isSaving ? (
                <>
                  <Save className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Saved {lastSaved.toLocaleTimeString()}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className={`mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all duration-300 ${
          isAutoFilling && isTyping ? 'p-3' : 'p-6'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 stroke-black" />
              <h3 className="text-sm font-semibold text-black">Try a Demo Scenario</h3>
            </div>
            <div className="flex items-center gap-2">
              {!(isAutoFilling && isTyping) && (
                <>
                  <Gauge className="h-4 w-4 stroke-gray-600" />
                  <select
                    value={typingSpeed}
                    onChange={(e) => setTypingSpeed(e.target.value as 'slow' | 'normal' | 'fast' | 'instant')}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={isTyping}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                    <option value="instant">Instant</option>
                  </select>
                </>
              )}
            </div>
          </div>
          {!(isAutoFilling && isTyping) && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Click any scenario to auto-fill with realistic data
              </p>
              <div className="flex flex-wrap gap-3">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.name}
                    type="button"
                    onClick={() => loadScenario(scenario)}
                    disabled={isTyping || isAutoFilling}
                    className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                      activeScenario?.name === scenario.name && isAutoFilling
                        ? 'border-black bg-black text-white'
                        : scenario.color
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {scenario.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {(isAutoFilling || (activeScenario && currentStep === FORM_STEPS.length - 1)) && (
            <div className={`flex items-center justify-between ${
              isAutoFilling && isTyping ? '' : 'mt-4'
            }`}>
              {isAutoFilling && isTyping ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-pulse flex items-center gap-2">
                    <Sparkles className="h-4 w-4 stroke-black" />
                    <span>Filling: {activeScenario?.name}</span>
                  </div>
                </div>
              ) : activeScenario && currentStep === FORM_STEPS.length - 1 && !isTyping && !isAutoFilling ? (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-5 w-5 stroke-green-700" />
                  <span className="font-semibold">Demo Paused! Click "Submit Deal" to see AI Analysis</span>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setIsAutoFilling(false);
                  setActiveScenario(null);
                  setShouldFillStep(false);
                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }
                  setIsTyping(false);
                }}
                className="text-xs px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium ml-auto"
              >
                Stop Demo
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <CollapsibleSection
              title="Contact Information"
              icon={<User className="h-5 w-5" />}
              defaultOpen={true}
              isComplete={completionStatus[0]}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Requestor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.requestor_name || ''}
                    onChange={(e) => updateFormData({ requestor_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="John Doe"
                  />
                  {errors.requestor_name && <p className="text-red-500 text-sm mt-1">{errors.requestor_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Requestor Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.requestor_email || ''}
                    onChange={(e) => updateFormData({ requestor_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="john.doe@company.com"
                  />
                  {errors.requestor_email && <p className="text-red-500 text-sm mt-1">{errors.requestor_email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => updateFormData({ company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Region</label>
                  <select
                    value={formData.region || ''}
                    onChange={(e) => updateFormData({ region: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                  >
                    <option value="">Select region</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">Business Unit</label>
                  <input
                    type="text"
                    value={formData.business_unit || ''}
                    onChange={(e) => updateFormData({ business_unit: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    placeholder="Digital Transformation"
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}

          {currentStep === 1 && (
            <CollapsibleSection
              title="Project Details"
              icon={<FileText className="h-5 w-5" />}
              defaultOpen={true}
              isComplete={completionStatus[1]}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Problem Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.problem_statement || ''}
                    onChange={(e) => updateFormData({ problem_statement: e.target.value })}
                    rows={4}
                    placeholder="Describe the business pain in 3-5 sentences..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                  />
                  {errors.problem_statement && <p className="text-red-500 text-sm mt-1">{errors.problem_statement}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.problem_statement?.length || 0} characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Expected Outcomes / KPIs <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.expected_outcomes || ''}
                    onChange={(e) => updateFormData({ expected_outcomes: e.target.value })}
                    rows={4}
                    placeholder="List measurable success metrics..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                  />
                  {errors.expected_outcomes && <p className="text-red-500 text-sm mt-1">{errors.expected_outcomes}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.expected_outcomes?.length || 0} characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Target Production Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.target_production_date || ''}
                      onChange={(e) => updateFormData({ target_production_date: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                    />
                    {errors.target_production_date && <p className="text-red-500 text-sm mt-1">{errors.target_production_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Preferred Path</label>
                    <select
                      value={formData.preferred_path || ''}
                      onChange={(e) => updateFormData({ preferred_path: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                    >
                      <option value="">Select path</option>
                      {PREFERRED_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          )}

          {currentStep === 2 && (
            <CollapsibleSection
              title="Technical Requirements"
              icon={<Settings className="h-5 w-5" />}
              defaultOpen={true}
              isComplete={completionStatus[2]}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-3">Deployment Preference</label>
                  <div className="space-y-2">
                    {DEPLOYMENT_OPTIONS.map(option => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={(formData.deployment_preference || []).includes(option)}
                          onChange={() => handleMultiSelect('deployment_preference', option)}
                          className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-black">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">Data Privacy / Residency Requirements</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DATA_PRIVACY_OPTIONS.map(option => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={(formData.data_privacy_requirements || []).includes(option)}
                          onChange={() => handleMultiSelect('data_privacy_requirements', option)}
                          className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-black text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Data Notes</label>
                  <textarea
                    value={formData.data_notes || ''}
                    onChange={(e) => updateFormData({ data_notes: e.target.value })}
                    rows={3}
                    placeholder="Additional data privacy or residency requirements..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-3">Critical Integrations</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {INTEGRATION_OPTIONS.map(option => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={(formData.critical_integrations || []).includes(option)}
                          onChange={() => handleMultiSelect('critical_integrations', option)}
                          className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-black text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Integration Notes</label>
                  <textarea
                    value={formData.integration_notes || ''}
                    onChange={(e) => updateFormData({ integration_notes: e.target.value })}
                    rows={3}
                    placeholder="Details about integrations, APIs, or systems..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}

          {currentStep === 3 && (
            <CollapsibleSection
              title="Business Context"
              icon={<Briefcase className="h-5 w-5" />}
              defaultOpen={true}
              isComplete={completionStatus[3]}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Executive Sponsor Name</label>
                    <input
                      type="text"
                      value={formData.executive_sponsor_name || ''}
                      onChange={(e) => updateFormData({ executive_sponsor_name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Executive Sponsor Email</label>
                    <input
                      type="email"
                      value={formData.executive_sponsor_email || ''}
                      onChange={(e) => updateFormData({ executive_sponsor_email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      placeholder="jane.smith@company.com"
                    />
                    {errors.executive_sponsor_email && <p className="text-red-500 text-sm mt-1">{errors.executive_sponsor_email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Budget Band</label>
                    <select
                      value={formData.budget_band || ''}
                      onChange={(e) => updateFormData({ budget_band: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                    >
                      <option value="">Select budget band</option>
                      {BUDGET_BANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Deal Stage</label>
                    <select
                      value={formData.deal_stage || ''}
                      onChange={(e) => updateFormData({ deal_stage: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                    >
                      <option value="">Select stage</option>
                      {DEAL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Competitors</label>
                  <input
                    type="text"
                    value={formData.competitors || ''}
                    onChange={(e) => updateFormData({ competitors: e.target.value })}
                    placeholder="List competing solutions..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Win Factors / Key Features</label>
                  <textarea
                    value={formData.win_factors || ''}
                    onChange={(e) => updateFormData({ win_factors: e.target.value })}
                    rows={4}
                    placeholder="List key reasons to choose Lyzr..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                  />
                </div>
              </div>
            </CollapsibleSection>
          )}

          {currentStep === 4 && (
            <CollapsibleSection
              title="Attachments & Links"
              icon={<Paperclip className="h-5 w-5" />}
              defaultOpen={true}
              isComplete={completionStatus[4]}
            >
              <div className="space-y-4">
                <div className="flex gap-4 flex-col sm:flex-row">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">Add URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                      />
                      <button
                        type="button"
                        onClick={addUrl}
                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <LinkIcon className="h-5 w-5 stroke-black" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Upload Files</label>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="h-5 w-5 stroke-black" />
                      <span className="text-black">Upload</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="space-y-3">
                    {formData.attachments.map((att, idx) => (
                      <AttachmentCard
                        key={idx}
                        attachment={att}
                        index={idx}
                        onUpdate={updateAttachment}
                        onRemove={removeAttachment}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-white text-black border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < FORM_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextStep = Math.min(FORM_STEPS.length - 1, currentStep + 1);
                    setCurrentStep(nextStep);
                    if (activeScenario) {
                      setIsAutoFilling(true);
                      setShouldFillStep(true);
                    }
                  }}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isAutoFilling}
                  className={`px-12 py-3 rounded-xl transition-all font-semibold disabled:cursor-not-allowed ${
                    isAutoFilling
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : activeScenario && !isAutoFilling
                      ? 'bg-green-600 text-white hover:bg-green-700 animate-pulse'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : activeScenario && !isAutoFilling ? 'Submit to See Analysis' : 'Submit Deal'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
