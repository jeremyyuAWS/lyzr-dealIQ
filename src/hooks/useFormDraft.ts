import { useState, useEffect, useCallback } from 'react';
import { supabase, DealSubmission } from '../lib/supabase';

const DRAFT_KEY = 'deal_intake_draft';
const AUTO_SAVE_DELAY = 2000;

export function useFormDraft(initialData?: Partial<DealSubmission>) {
  const [formData, setFormData] = useState<Partial<DealSubmission>>(initialData || {});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadDraft = () => {
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved && !initialData) {
          const draft = JSON.parse(saved);
          setFormData(draft.data);
          setLastSaved(new Date(draft.timestamp));
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    };

    loadDraft();
  }, [initialData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(formData);
    }, AUTO_SAVE_DELAY);

    return () => clearTimeout(timer);
  }, [formData]);

  const saveDraft = useCallback(async (data: Partial<DealSubmission>) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          data,
          timestamp: new Date().toISOString(),
        })
      );

      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
      setSaveError('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setFormData({});
    setLastSaved(null);
  }, []);

  const updateFormData = useCallback((updates: Partial<DealSubmission>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  return {
    formData,
    updateFormData,
    setFormData,
    isSaving,
    lastSaved,
    saveError,
    clearDraft,
  };
}
