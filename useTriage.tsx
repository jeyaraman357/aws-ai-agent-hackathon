import { useState, useCallback } from 'react';
import { TriageResult } from '@/types';
import { analyzeSymptoms } from '@/services/triageService';

export const useTriage = () => {
  const [currentTriage, setCurrentTriage] = useState<TriageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageHistory, setTriageHistory] = useState<TriageResult[]>([]);

  const performTriage = useCallback(async (symptoms: string[], responses: string[]) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(symptoms, responses);
      setCurrentTriage(result);
      setTriageHistory(prev => [result, ...prev]);
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearCurrentTriage = useCallback(() => {
    setCurrentTriage(null);
  }, []);

  return {
    currentTriage,
    isAnalyzing,
    triageHistory,
    performTriage,
    clearCurrentTriage
  };
};