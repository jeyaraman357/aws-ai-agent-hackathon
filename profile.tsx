import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { icon: 'person', label: 'Full Name', value: 'John Doe', action: 'edit' },
        { icon: 'email', label: 'Email', value: 'john.doe@example.com', action: 'edit' },
        { icon: 'phone', label: 'Phone', value: '+1 (555) 123-4567', action: 'edit' },
        { icon: 'cake', label: 'Date of Birth', value: 'January 15, 1990', action: 'edit' }
      ]
    },
    {
      title: 'Health Information',
      items: [
        { icon: 'favorite', label: 'Blood Type', value: 'O+', action: 'edit' },
        { icon: 'healing', label: 'Allergies', value: 'Penicillin, Pollen', action: 'edit' },
        { icon: 'medical-services', label: 'Medications', value: '2 Current', action: 'view' },
        { icon: 'note-alt', label: 'Medical History', value: '5 Conditions', action: 'view' }
      ]
    },
    {
      title: 'Insurance',
      items: [
        { icon: 'card-membership', label: 'Provider', value: 'HealthCare Plus', action: 'edit' },
        { icon: 'badge', label: 'Policy Number', value: 'HCP-12345678', action: 'edit' },
        { icon: 'verified', label: 'Status', value: 'Active', action: 'none' }
      ]
    }
  ];

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications', label: 'Notifications', action: 'toggle' },
        { icon: 'language', label: 'Language', value: 'English', action: 'select' },
        { icon: 'accessibility', label: 'Accessibility', action: 'navigate' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center', action: 'navigate' },
        { icon: 'policy', label: 'Privacy Policy', action: 'navigate' },
        { icon: 'description', label: 'Terms of Service', action: 'navigate' }
      ]
    }
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} bounces={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="account-circle" size={80} color="#2563EB" />
          <TouchableOpacity style={styles.editAvatarButton}>
            <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {profileSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.listItem,
                  itemIndex < section.items.length - 1 && styles.listItemBorder
                ]}
              >
                <View style={styles.listItemLeft}>
                  <View style={styles.listItemIcon}>
                    <MaterialIcons name={item.icon as any} size={24} color="#2563EB" />
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.listItemValue}>{item.value}</Text>
                    )}
                  </View>
                </View>
                {item.action !== 'none' && (
                  <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.listItem,
                  itemIndex < section.items.length - 1 && styles.listItemBorder
                ]}
              >
                <View style={styles.listItemLeft}>
                  <View style={styles.listItemIcon}>
                    <MaterialIcons name={item.icon as any} size={24} color="#6B7280" />
                  </View>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.listItemLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.listItemValue}>{item.value}</Text>
                    )}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.signOutButton}>
        <MaterialIcons name="logout" size={20} color="#EF4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>HealthNav v1.0.0</Text>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF'
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4
  },
  email: {
    fontSize: 15,
    color: '#6B7280'
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  listItemInfo: {
    flex: 1
  },
  listItemLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2
  },
  listItemValue: {
    fontSize: 14,
    color: '#6B7280'
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444'
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 24
  }
});