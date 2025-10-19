import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
  onBook: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onBook }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="local-hospital" size={32} color="#2563EB" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.specialty}>{provider.specialty}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <View style={styles.infoRow}>
          <MaterialIcons name="star" size={16} color="#F59E0B" />
          <Text style={styles.infoText}>{provider.rating} rating</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color="#6B7280" />
          <Text style={styles.infoText}>{provider.distance}</Text>
        </View>
        {provider.acceptsInsurance && (
          <View style={styles.infoRow}>
            <MaterialIcons name="check-circle" size={16} color="#10B981" />
            <Text style={styles.infoText}>Insurance accepted</Text>
          </View>
        )}
      </View>
      
      <View style={styles.slots}>
        <Text style={styles.slotsTitle}>Available:</Text>
        <View style={styles.slotsList}>
          {provider.availableSlots.slice(0, 3).map((slot, index) => (
            <View key={index} style={styles.slotBadge}>
              <Text style={styles.slotText}>{slot}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.bookButton} onPress={onBook}>
        <Text style={styles.bookButtonText}>Book Appointment</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280'
  },
  info: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280'
  },
  slots: {
    marginBottom: 16
  },
  slotsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  slotsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  slotBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  slotText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500'
  },
  bookButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});