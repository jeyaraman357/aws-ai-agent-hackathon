export const URGENCY_COLORS = {
  low: '#10B981',
  moderate: '#F59E0B',
  high: '#EF4444',
  emergency: '#DC2626'
};

export const URGENCY_LABELS = {
  low: 'Low Priority',
  moderate: 'Moderate Priority',
  high: 'High Priority',
  emergency: 'Emergency - Seek Immediate Care'
};

export const URGENCY_ICONS = {
  low: 'check-circle',
  moderate: 'alert-circle',
  high: 'alert-circle',
  emergency: 'warning'
} as const;

export const COMMON_SYMPTOMS = [
  'Headache',
  'Fever',
  'Cough',
  'Sore Throat',
  'Fatigue',
  'Nausea',
  'Chest Pain',
  'Shortness of Breath',
  'Abdominal Pain',
  'Dizziness'
];

export const PROVIDER_SPECIALTIES = [
  'General Practice',
  'Urgent Care',
  'Emergency Medicine',
  'Internal Medicine',
  'Family Medicine',
  'Pediatrics'
];

export const AI_GREETING = "Hello! I'm HealthNav, your AI healthcare assistant. I'm here to help assess your symptoms and guide you to the right care. What symptoms are you experiencing today?";

export const TRIAGE_QUESTIONS = [
  "How long have you been experiencing these symptoms?",
  "On a scale of 1-10, how would you rate the severity?",
  "Are you experiencing any other symptoms?",
  "Do you have any pre-existing medical conditions?",
  "Are you currently taking any medications?"
];