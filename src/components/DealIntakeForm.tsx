import { useState, FormEvent, useEffect, useRef } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase, DealSubmission } from '../lib/supabase';
import { SCENARIOS, Scenario } from '../data/scenarios';

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

export default function DealIntakeForm() {
  const [formData, setFormData] = useState<Partial<DealSubmission>>({
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
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const typeText = async (text: string, delay = 20): Promise<string> => {
    return new Promise((resolve) => {
      let currentText = '';
      let index = 0;

      const typeChar = () => {
        if (index < text.length) {
          currentText += text[index];
          index++;
          typingTimeoutRef.current = setTimeout(typeChar, delay);
        } else {
          resolve(currentText);
        }
      };

      typeChar();
    });
  };

  const loadScenario = async (scenario: Scenario) => {
    if (isTyping) return;

    setIsTyping(true);
    setFormData({
      deployment_preference: [],
      data_privacy_requirements: [],
      critical_integrations: [],
      attachments: []
    });
    setErrors({});

    const fields = Object.keys(scenario.data) as Array<keyof DealSubmission>;

    for (const field of fields) {
      const value = scenario.data[field];

      if (typeof value === 'string') {
        const typedValue = await typeText(value, field === 'problem_statement' || field === 'expected_outcomes' ? 10 : 20);
        setFormData(prev => ({ ...prev, [field]: typedValue }));
        await new Promise(resolve => setTimeout(resolve, 100));
      } else if (Array.isArray(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    }

    setIsTyping(false);
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

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('deal_submissions')
        .insert([formData]);

      if (error) throw error;

      setShowSuccess(true);
      setFormData({
        deployment_preference: [],
        data_privacy_requirements: [],
        critical_integrations: [],
        attachments: []
      });
      setErrors({});
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
    setFormData({ ...formData, [field]: newValues });
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;

    const attachments = formData.attachments || [];
    attachments.push({
      type: 'url',
      name: urlInput,
      url: urlInput
    });
    setFormData({ ...formData, attachments });
    setUrlInput('');
  };

  const removeAttachment = (index: number) => {
    const attachments = [...(formData.attachments || [])];
    attachments.splice(index, 1);
    setFormData({ ...formData, attachments });
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
    setFormData({ ...formData, attachments });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6">
            <CheckCircle2 className="h-8 w-8 stroke-white" />
          </div>
          <h2 className="text-3xl font-bold text-black mb-4">Deal Submitted!</h2>
          <p className="text-lg text-gray-700 mb-8">
            Our Solutions team will review your submission within 24 hours.
          </p>
          <button
            onClick={() => setShowSuccess(false)}
            className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Submit Another Deal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 stroke-black" />
            <h3 className="text-sm font-semibold text-black">Try a Demo Scenario</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Click any scenario below to see it auto-fill with realistic Accenture team submissions
          </p>
          <div className="flex flex-wrap gap-3">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.name}
                type="button"
                onClick={() => loadScenario(scenario)}
                disabled={isTyping}
                className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${scenario.color} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
          {isTyping && (
            <p className="text-sm text-gray-500 mt-3 italic">Auto-filling form with scenario data...</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Requestor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.requestor_name || ''}
                  onChange={(e) => setFormData({ ...formData, requestor_name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
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
                  onChange={(e) => setFormData({ ...formData, requestor_email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
                {errors.requestor_email && <p className="text-red-500 text-sm mt-1">{errors.requestor_email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Region</label>
                <select
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, business_unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Project Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.problem_statement || ''}
                  onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                  rows={4}
                  placeholder="Describe the business pain in 3-5 sentences..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
                {errors.problem_statement && <p className="text-red-500 text-sm mt-1">{errors.problem_statement}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Expected Outcomes / KPIs <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.expected_outcomes || ''}
                  onChange={(e) => setFormData({ ...formData, expected_outcomes: e.target.value })}
                  rows={4}
                  placeholder="List measurable success metrics..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
                {errors.expected_outcomes && <p className="text-red-500 text-sm mt-1">{errors.expected_outcomes}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Target Production Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.target_production_date || ''}
                    onChange={(e) => setFormData({ ...formData, target_production_date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                  {errors.target_production_date && <p className="text-red-500 text-sm mt-1">{errors.target_production_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Preferred Path</label>
                  <select
                    value={formData.preferred_path || ''}
                    onChange={(e) => setFormData({ ...formData, preferred_path: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black bg-white"
                  >
                    <option value="">Select path</option>
                    {PREFERRED_PATHS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Technical Requirements</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-3">Deployment Preference</label>
                <div className="space-y-2">
                  {DEPLOYMENT_OPTIONS.map(option => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
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
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
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
                  onChange={(e) => setFormData({ ...formData, data_notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-3">Critical Integrations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {INTEGRATION_OPTIONS.map(option => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
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
                  onChange={(e) => setFormData({ ...formData, integration_notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Business Context</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Executive Sponsor Name</label>
                  <input
                    type="text"
                    value={formData.executive_sponsor_name || ''}
                    onChange={(e) => setFormData({ ...formData, executive_sponsor_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Executive Sponsor Email</label>
                  <input
                    type="email"
                    value={formData.executive_sponsor_email || ''}
                    onChange={(e) => setFormData({ ...formData, executive_sponsor_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                  {errors.executive_sponsor_email && <p className="text-red-500 text-sm mt-1">{errors.executive_sponsor_email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Budget Band</label>
                  <select
                    value={formData.budget_band || ''}
                    onChange={(e) => setFormData({ ...formData, budget_band: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, deal_stage: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                  placeholder="List competing solutions..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Win Factors / Key Features</label>
                <textarea
                  value={formData.win_factors || ''}
                  onChange={(e) => setFormData({ ...formData, win_factors: e.target.value })}
                  rows={4}
                  placeholder="List key reasons to choose Lyzr..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Attachments & Links</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
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
                <div className="space-y-2">
                  {formData.attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {att.type === 'url' ? (
                          <LinkIcon className="h-4 w-4 stroke-black" />
                        ) : (
                          <Upload className="h-4 w-4 stroke-black" />
                        )}
                        <span className="text-black text-sm truncate">{att.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="p-1 hover:opacity-70"
                      >
                        <X className="h-4 w-4 stroke-black" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-white text-black border-2 border-black rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
