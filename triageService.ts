import { TriageResult, UrgencyLevel } from '@/types';
import { analyzeSymptomsWithML, getMockSageMakerPrediction } from './sagemakerService';

export const analyzeSymptoms = async (symptoms: string[], responses: string[]): Promise<TriageResult> => {
  // Use SageMaker ML model for advanced analysis
  const mlPrediction = await getMockSageMakerPrediction(symptoms);
  
  // Convert ML prediction to triage result
  let urgency: UrgencyLevel;
  let suggestedAction: TriageResult['suggestedAction'];
  
  if (mlPrediction.urgency_score >= 0.8) {
    urgency = 'emergency';
    suggestedAction = 'emergency';
  } else if (mlPrediction.urgency_score >= 0.6) {
    urgency = 'high';
    suggestedAction = 'urgent-care';
  } else if (mlPrediction.urgency_score >= 0.4) {
    urgency = 'moderate';
    suggestedAction = 'clinic';
  } else {
    urgency = 'low';
    suggestedAction = 'self-care';
  }
  
  const recommendation = generateRecommendation(
    urgency, 
    mlPrediction.recommended_specialty,
    mlPrediction.key_findings
  );
  
  return {
    id: Date.now().toString(),
    urgency,
    primarySymptoms: symptoms,
    recommendation,
    suggestedAction,
    estimatedWaitTime: suggestedAction === 'urgent-care' ? '30-60 min' : undefined,
    timestamp: new Date(),
    mlConfidence: mlPrediction.confidence,
    riskScore: mlPrediction.urgency_score * 100
  };
};

const generateRecommendation = (
  urgency: UrgencyLevel,
  specialty: string,
  findings: string[]
): string => {
  const findingsList = findings.map(f => `• ${f}`).join('\n');
  
  switch (urgency) {
    case 'emergency':
      return `🚨 EMERGENCY ASSESSMENT\n\nML Analysis Findings:\n${findingsList}\n\nRecommended Action: Call 911 or go to the nearest emergency room immediately. Your symptoms require urgent medical attention from ${specialty} specialists.`;
    
    case 'high':
      return `⚠️ HIGH PRIORITY\n\nML Analysis Findings:\n${findingsList}\n\nRecommended Action: Seek prompt medical attention. Visit an urgent care center or schedule a same-day appointment with a ${specialty} provider.`;
    
    case 'moderate':
      return `📋 MODERATE PRIORITY\n\nML Analysis Findings:\n${findingsList}\n\nRecommended Action: Schedule an appointment with a ${specialty} provider within the next few days for proper evaluation.`;
    
    case 'low':
      return `✓ LOW PRIORITY\n\nML Analysis Findings:\n${findingsList}\n\nRecommended Action: Monitor your symptoms. Consider self-care measures and schedule a routine check-up with a ${specialty} provider if symptoms persist.`;
  }
};

export const generateAIResponse = (userMessage: string, conversationContext: string[]): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Emergency detection
  if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart')) {
    return "I understand you're experiencing chest pain. This could be serious. Our AI system is analyzing this now. Are you also experiencing shortness of breath, nausea, or pain radiating to your arm or jaw? If yes, please call 911 immediately.";
  }
  
  if (lowerMessage.includes('breathing') || lowerMessage.includes('breath')) {
    return "Difficulty breathing requires immediate attention. Our ML model is evaluating the severity. Can you describe how severe it is? Are your lips or fingernails turning blue?";
  }
  
  // Symptom follow-ups
  if (lowerMessage.includes('headache')) {
    return "I understand you have a headache. Our AI will analyze this along with other symptoms. Can you tell me: Is it mild, moderate, or severe? How long have you had it? Is it accompanied by fever, vision changes, or nausea?";
  }
  
  if (lowerMessage.includes('fever')) {
    return "A fever can indicate infection. Our machine learning system will assess the risk level. What is your temperature? Are you experiencing chills, body aches, or other symptoms?";
  }
  
  if (lowerMessage.includes('cough')) {
    return "I see you have a cough. Our AI will evaluate this symptom. Is it dry or producing mucus? Are you experiencing shortness of breath or chest pain with it?";
  }
  
  // Duration questions
  if (conversationContext.length === 2) {
    return "How long have you been experiencing these symptoms? Please specify in hours, days, or weeks. This helps our ML model provide more accurate predictions.";
  }
  
  // Severity questions
  if (conversationContext.length === 4) {
    return "On a scale of 1-10, with 10 being the most severe, how would you rate your symptoms? This data will be used in our risk prediction model.";
  }
  
  // Additional symptoms
  if (conversationContext.length === 6) {
    return "Are you experiencing any other symptoms I should know about? The more information you provide, the more accurate our ML-powered assessment will be.";
  }
  
  // Final analysis
  if (conversationContext.length >= 8) {
    return "Thank you for providing that information. Our AWS SageMaker model is now analyzing your symptoms using advanced machine learning algorithms to provide personalized recommendations...";
  }
  
  return "I understand. Can you provide more details about your symptoms? Our AI system uses these details to provide the most accurate health guidance possible.";
};