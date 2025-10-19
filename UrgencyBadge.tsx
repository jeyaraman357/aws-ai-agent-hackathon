import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { UrgencyLevel } from '@/types';
import { URGENCY_COLORS, URGENCY_LABELS, URGENCY_ICONS } from '@/constants/medical';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'small' | 'large';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, size = 'large' }) => {
  const isSmall = size === 'small';
  
  return (
    <View style={[styles.container, { backgroundColor: URGENCY_COLORS[urgency] }, isSmall && styles.smallContainer]}>
      <MaterialIcons 
        name={URGENCY_ICONS[urgency]} 
        size={isSmall ? 16 : 24} 
        color="#FFFFFF" 
      />
      <Text style={[styles.text, isSmall && styles.smallText]}>
        {URGENCY_LABELS[urgency]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8
  },
  smallContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  smallText: {
    fontSize: 14
  }
});