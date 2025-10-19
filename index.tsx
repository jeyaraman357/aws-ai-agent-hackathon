import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const quickActions = [
    { id: '1', icon: 'chat', title: 'Start Triage', description: 'Assess symptoms with AI', color: '#2563EB', route: 'chat' },
    { id: '2', icon: 'local-hospital', title: 'Find Providers', description: 'Search nearby clinics', color: '#10B981', route: 'chat' },
    { id: '3', icon: 'calendar-today', title: 'My Appointments', description: 'View scheduled visits', color: '#F59E0B', route: 'history' },
    { id: '4', icon: 'description', title: 'Health Records', description: 'Access medical history', color: '#8B5CF6', route: 'profile' }
  ];

  const emergencyContacts = [
    { title: 'Emergency', number: '911', icon: 'local-hospital' },
    { title: 'Poison Control', number: '1-800-222-1222', icon: 'warning' },
    { title: 'Mental Health', number: '988', icon: 'psychology' }
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} bounces={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to</Text>
          <Text style={styles.title}>HealthNav</Text>
        </View>
        <View style={styles.logoContainer}>
          <MaterialIcons name="favorite" size={32} color="#EF4444" />
        </View>
      </View>

      <View style={styles.heroCard}>
        <MaterialIcons name="health-and-safety" size={48} color="#2563EB" />
        <Text style={styles.heroTitle}>AI-Powered Healthcare Navigation</Text>
        <Text style={styles.heroDescription}>
          Get instant symptom assessment, find the right care, and book appointments - all in one place
        </Text>
        <TouchableOpacity 
          style={styles.heroButton}
          onPress={() => router.push('/chat')}
        >
          <Text style={styles.heroButtonText}>Start Assessment</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => router.push(`/${action.route}` as any)}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}15` }]}>
                <MaterialIcons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <TouchableOpacity key={index} style={styles.emergencyCard}>
            <View style={styles.emergencyIcon}>
              <MaterialIcons name={contact.icon as any} size={24} color="#EF4444" />
            </View>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyTitle}>{contact.title}</Text>
              <Text style={styles.emergencyNumber}>{contact.number}</Text>
            </View>
            <MaterialIcons name="phone" size={24} color="#2563EB" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={24} color="#2563EB" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>How HealthNav Works</Text>
          <Text style={styles.infoText}>
            1. Describe your symptoms{'\n'}
            2. Get AI-powered triage assessment{'\n'}
            3. Find recommended providers{'\n'}
            4. Book appointments instantly
          </Text>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937'
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  heroDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20
  },
  heroButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingHorizontal: 20
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  actionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  emergencyInfo: {
    flex: 1
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2
  },
  emergencyNumber: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '500'
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 16
  },
  infoContent: {
    flex: 1
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22
  }
});