import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTriage } from '@/hooks/useTriage';
import { UrgencyBadge } from '@/components/UrgencyBadge';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { triageHistory } = useTriage();

  const mockAppointments = [
    {
      id: '1',
      providerName: 'Dr. Sarah Chen',
      date: '2025-10-20',
      time: '2:00 PM',
      status: 'scheduled' as const,
      type: 'in-person' as const
    }
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} bounces={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Health History</Text>
        <Text style={styles.subtitle}>Your appointments and triage records</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="calendar-today" size={24} color="#2563EB" />
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        </View>
        
        {mockAppointments.length > 0 ? (
          mockAppointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <View style={styles.appointmentIcon}>
                  <MaterialIcons name="local-hospital" size={24} color="#2563EB" />
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentProvider}>{appointment.providerName}</Text>
                  <Text style={styles.appointmentDate}>{appointment.date} at {appointment.time}</Text>
                </View>
              </View>
              
              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentBadge}>
                  <MaterialIcons
                    name={appointment.type === 'in-person' ? 'location-on' : 'videocam'}
                    size={16}
                    color="#2563EB"
                  />
                  <Text style={styles.appointmentBadgeText}>
                    {appointment.type === 'in-person' ? 'In-Person' : 'Tele-Consult'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, styles.statusScheduled]}>
                  <Text style={styles.statusText}>Scheduled</Text>
                </View>
              </View>
              
              <View style={styles.appointmentActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="directions" size={20} color="#2563EB" />
                  <Text style={styles.actionButtonText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MaterialIcons name="event" size={20} color="#2563EB" />
                  <Text style={styles.actionButtonText}>Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            <Text style={styles.emptyStateSubtext}>Start a triage to get recommendations</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="assessment" size={24} color="#10B981" />
          <Text style={styles.sectionTitle}>Triage History</Text>
        </View>
        
        {triageHistory.length > 0 ? (
          triageHistory.map(triage => (
            <View key={triage.id} style={styles.triageCard}>
              <View style={styles.triageHeader}>
                <UrgencyBadge urgency={triage.urgency} size="small" />
                <Text style={styles.triageDate}>
                  {triage.timestamp.toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.triageSymptoms}>
                {triage.primarySymptoms.slice(0, 3).map((symptom, index) => (
                  <View key={index} style={styles.symptomChip}>
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
              </View>
              
              <Text style={styles.triageRecommendation} numberOfLines={2}>
                {triage.recommendation}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>No triage history yet</Text>
            <Text style={styles.emptyStateSubtext}>Your assessments will appear here</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    padding: 20,
    paddingBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280'
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937'
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: 12
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentProvider: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  appointmentDate: {
    fontSize: 15,
    color: '#6B7280'
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  appointmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4
  },
  appointmentBadgeText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500'
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  statusScheduled: {
    backgroundColor: '#D1FAE5'
  },
  statusText: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '500'
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6
  },
  actionButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500'
  },
  triageCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  triageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  triageDate: {
    fontSize: 13,
    color: '#6B7280'
  },
  triageSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  symptomChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  symptomText: {
    fontSize: 13,
    color: '#4B5563'
  },
  triageRecommendation: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20
  },
  emptyState: {
    alignItems: 'center',
    padding: 40
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 4
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF'
  }
});