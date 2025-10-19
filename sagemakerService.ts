import { SageMakerPrediction, MedicalImageAnalysis } from '@/types';

// SageMaker endpoints configuration
const SAGEMAKER_CONFIG = {
  TRIAGE_ENDPOINT: 'medical-triage-endpoint',
  IMAGE_ANALYSIS_ENDPOINT: 'medical-image-classifier',
  RISK_PREDICTION_ENDPOINT: 'patient-risk-scorer',
  SUPABASE_FUNCTION_URL: process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1'
};

/**
 * Call SageMaker triage model through Supabase Edge Function
 * This analyzes symptoms and predicts urgency using ML
 */
export const analyzeSymptomsWithML = async (
  symptoms: string[],
  patientData: {
    age?: number;
    gender?: string;
    medicalHistory?: string[];
    currentMedications?: string[];
  }
): Promise<SageMakerPrediction> => {
  try {
    // In production, this calls Supabase Edge Function which calls SageMaker
    const response = await fetch(`${SAGEMAKER_CONFIG.SUPABASE_FUNCTION_URL}/sagemaker-triage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add Supabase anon key when connected
      },
      body: JSON.stringify({
        symptoms,
        patient_data: patientData,
        endpoint: SAGEMAKER_CONFIG.TRIAGE_ENDPOINT
      })
    });

    if (!response.ok) {
      throw new Error('SageMaker inference failed');
    }

    const prediction = await response.json();
    return prediction;
  } catch (error) {
    console.error('SageMaker ML analysis error:', error);
    // Fallback to rule-based system
    return generateFallbackPrediction(symptoms);
  }
};

/**
 * Analyze medical images (X-rays, skin lesions, etc.) using SageMaker
 */
export const analyzemedicalImage = async (
  imageUri: string,
  imageType: 'xray' | 'skin' | 'ct' | 'mri'
): Promise<MedicalImageAnalysis> => {
  try {
    // Upload image to Supabase Storage first
    const imageBlob = await fetch(imageUri).then(r => r.blob());
    
    // Call Edge Function with image data
    const response = await fetch(`${SAGEMAKER_CONFIG.SUPABASE_FUNCTION_URL}/sagemaker-image-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_data: imageUri, // In production, send S3/Supabase URL
        image_type: imageType,
        endpoint: SAGEMAKER_CONFIG.IMAGE_ANALYSIS_ENDPOINT
      })
    });

    const analysis = await response.json();
    
    return {
      id: Date.now().toString(),
      imageUri,
      predictions: analysis.predictions,
      timestamp: new Date(),
      sagemakerEndpoint: SAGEMAKER_CONFIG.IMAGE_ANALYSIS_ENDPOINT
    };
  } catch (error) {
    console.error('Medical image analysis error:', error);
    throw error;
  }
};

/**
 * Predict patient risk score using historical data
 */
export const calculateRiskScore = async (
  symptoms: string[],
  vitalSigns: {
    heartRate?: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenSaturation?: number;
  },
  medicalHistory: string[]
): Promise<number> => {
  try {
    const response = await fetch(`${SAGEMAKER_CONFIG.SUPABASE_FUNCTION_URL}/sagemaker-risk-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptoms,
        vital_signs: vitalSigns,
        medical_history: medicalHistory,
        endpoint: SAGEMAKER_CONFIG.RISK_PREDICTION_ENDPOINT
      })
    });

    const result = await response.json();
    return result.risk_score; // 0-100 scale
  } catch (error) {
    console.error('Risk score calculation error:', error);
    return 0;
  }
};

/**
 * Fallback prediction when SageMaker is unavailable
 */
const generateFallbackPrediction = (symptoms: string[]): SageMakerPrediction => {
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious'];
  const hasEmergency = symptoms.some(s => 
    emergencyKeywords.some(k => s.toLowerCase().includes(k))
  );

  if (hasEmergency) {
    return {
      urgency_score: 0.95,
      risk_level: 'critical',
      recommended_specialty: 'Emergency Medicine',
      confidence: 0.85,
      key_findings: ['Emergency symptoms detected', 'Immediate medical attention required']
    };
  }

  return {
    urgency_score: 0.45,
    risk_level: 'medium',
    recommended_specialty: 'General Practice',
    confidence: 0.70,
    key_findings: symptoms.slice(0, 3)
  };
};

/**
 * Mock SageMaker predictions for development/testing
 */
export const getMockSageMakerPrediction = async (
  symptoms: string[]
): Promise<SageMakerPrediction> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const hasChestPain = symptoms.some(s => s.toLowerCase().includes('chest pain'));
  const hasFever = symptoms.some(s => s.toLowerCase().includes('fever'));
  
  if (hasChestPain) {
    return {
      urgency_score: 0.92,
      risk_level: 'critical',
      recommended_specialty: 'Cardiology',
      confidence: 0.94,
      key_findings: [
        'Chest pain detected - potential cardiac event',
        'Immediate evaluation recommended',
        'Consider ECG and cardiac biomarkers'
      ]
    };
  }
  
  if (hasFever) {
    return {
      urgency_score: 0.58,
      risk_level: 'medium',
      recommended_specialty: 'Internal Medicine',
      confidence: 0.82,
      key_findings: [
        'Fever pattern suggests possible infection',
        'Monitor temperature trends',
        'Consider basic lab work'
      ]
    };
  }
  
  return {
    urgency_score: 0.35,
    risk_level: 'low',
    recommended_specialty: 'General Practice',
    confidence: 0.76,
    key_findings: [
      'Symptoms appear non-urgent',
      'Routine consultation recommended',
      'Self-care measures may be appropriate'
    ]
  };
};