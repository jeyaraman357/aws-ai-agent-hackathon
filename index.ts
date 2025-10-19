export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  imageUri?: string; // For medical images
}

export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description?: string;
}

export type UrgencyLevel = 'low' | 'moderate' | 'high' | 'emergency';

export interface TriageResult {
  id: string;
  urgency: UrgencyLevel;
  primarySymptoms: string[];
  recommendation: string;
  suggestedAction: 'self-care' | 'clinic' | 'urgent-care' | 'emergency';
  estimatedWaitTime?: string;
  timestamp: Date;
  mlConfidence?: number; // SageMaker prediction confidence
  riskScore?: number; // SageMaker risk assessment
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  availableSlots: string[];
  address: string;
  phone: string;
  acceptsInsurance: boolean;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  type: 'in-person' | 'tele-consult';
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  insuranceProvider?: string;
  insuranceId?: string;
  medicalHistory: string[];
}

export interface MedicalImageAnalysis {
  id: string;
  imageUri: string;
  predictions: {
    condition: string;
    confidence: number;
    severity: string;
  }[];
  timestamp: Date;
  sagemakerEndpoint: string;
}

export interface SageMakerPrediction {
  urgency_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  recommended_specialty: string;
  confidence: number;
  key_findings: string[];
}