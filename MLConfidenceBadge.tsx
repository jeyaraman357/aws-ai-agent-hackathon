import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MLConfidenceBadgeProps {
  confidence: number;
  riskScore?: number;
}

export const MLConfidenceBadge: React.FC<MLConfidenceBadgeProps> = ({ 
  confidence, 
  riskScore 
}) => {
  const confidencePercent = Math.round(confidence * 100);
  const riskPercent = riskScore ? Math.round(riskScore) : null;
  
  const getConfidenceColor = (conf: number): string => {
    if (conf >= 0.8) return '#10B981';
    if (conf >= 0.6) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <MaterialIcons name="psychology" size={16} color="#2563EB" />
        <Text style={styles.label}>ML Confidence</Text>
        <View style={[styles.confidenceBar, { backgroundColor: getConfidenceColor(confidence) }]}>
          <Text style={styles.confidenceText}>{confidencePercent}%</Text>
        </View>
      </View>
      
      {riskPercent !== null && (
        <View style={styles.badge}>
          <MaterialIcons name="assessment" size={16} color="#8B5CF6" />
          <Text style={styles.label}>Risk Score</Text>
          <View style={[styles.riskBar, { backgroundColor: getConfidenceColor(riskScore! / 100) }]}>
            <Text style={styles.riskText}>{riskPercent}/100</Text>
          </View>
        </View>
      )}
      
      <View style={styles.footer}>
        <MaterialIcons name="cloud" size={12} color="#9CA3AF" />
        <Text style={styles.footerText}>Powered by AWS SageMaker</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1
  },
  confidenceBar: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center'
  },
  confidenceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  riskBar: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center'
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic'
  }
});