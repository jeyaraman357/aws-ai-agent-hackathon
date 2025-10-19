import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useChat } from '@/hooks/useChat';
import { useTriage } from '@/hooks/useTriage';
import { ChatBubble } from '@/components/ChatBubble';
import { TypingIndicator } from '@/components/TypingIndicator';
import { UrgencyBadge } from '@/components/UrgencyBadge';
import { MLConfidenceBadge } from '@/components/MLConfidenceBadge';
import { ProviderCard } from '@/components/ProviderCard';
import { findRecommendedProviders, bookAppointment } from '@/services/providerService';
import { Provider } from '@/types';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { messages, isTyping, sendMessage, clearChat, conversationContext } = useChat();
  const { currentTriage, isAnalyzing, performTriage, clearCurrentTriage } = useTriage();
  const [inputText, setInputText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const message = inputText.trim();
    setInputText('');
    await sendMessage(message);
    
    // After sufficient conversation, perform triage
    if (conversationContext.length >= 7 && !currentTriage) {
      const symptoms = conversationContext.filter((_, index) => index % 2 === 0);
      const result = await performTriage(symptoms, conversationContext);
      setShowResults(true);
      const recommendedProviders = findRecommendedProviders(result);
      setProviders(recommendedProviders);
    }
  };

  const handleNewChat = () => {
    clearChat();
    clearCurrentTriage();
    setShowResults(false);
    setProviders([]);
    setSelectedProvider(null);
  };

  const handleBookProvider = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleConfirmBooking = async () => {
    if (!selectedProvider || !selectedSlot || !currentTriage) return;
    
    await bookAppointment(
      selectedProvider,
      selectedSlot,
      currentTriage.primarySymptoms,
      selectedProvider.specialty === 'Tele-Consult' ? 'tele-consult' : 'in-person'
    );
    
    setSelectedProvider(null);
    setSelectedSlot('');
    
    // Show success modal (simplified)
    if (Platform.OS === 'web') {
      alert('Appointment booked successfully! Check History tab for details.');
    } else {
      // Would use proper Alert.alert here
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.aiAvatar}>
            <MaterialIcons name="smart-toy" size={24} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.headerTitle}>HealthNav AI</Text>
            <Text style={styles.headerSubtitle}>Medical Triage Assistant</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
          <MaterialIcons name="refresh" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          <>
            {isTyping && <TypingIndicator />}
            {isAnalyzing && (
              <View style={styles.analyzingContainer}>
                <MaterialIcons name="biotech" size={32} color="#2563EB" />
                <Text style={styles.analyzingText}>Analyzing your symptoms...</Text>
              </View>
            )}
          </>
        }
      />

      {showResults && currentTriage && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Triage Results</Text>
            <TouchableOpacity onPress={() => setShowResults(false)}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <UrgencyBadge urgency={currentTriage.urgency} />
          
          {(currentTriage.mlConfidence || currentTriage.riskScore) && (
            <MLConfidenceBadge 
              confidence={currentTriage.mlConfidence || 0.75}
              riskScore={currentTriage.riskScore}
            />
          )}
          
          <Text style={styles.recommendation}>{currentTriage.recommendation}</Text>
          
          <Text style={styles.providersTitle}>Recommended Providers</Text>
          <FlatList
            data={providers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ProviderCard provider={item} onBook={() => handleBookProvider(item)} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.providersList}
          />
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          placeholder="Describe your symptoms..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <MaterialIcons name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {selectedProvider && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Book Appointment</Text>
                <TouchableOpacity onPress={() => setSelectedProvider(null)}>
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalProviderName}>{selectedProvider.name}</Text>
              <Text style={styles.modalProviderSpecialty}>{selectedProvider.specialty}</Text>
              
              <Text style={styles.slotsLabel}>Select Time Slot</Text>
              {selectedProvider.availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.slotOption, selectedSlot === slot && styles.slotOptionSelected]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <MaterialIcons
                    name={selectedSlot === slot ? 'radio-button-checked' : 'radio-button-unchecked'}
                    size={24}
                    color={selectedSlot === slot ? '#2563EB' : '#9CA3AF'}
                  />
                  <Text style={[styles.slotOptionText, selectedSlot === slot && styles.slotOptionTextSelected]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={[styles.confirmButton, !selectedSlot && styles.confirmButtonDisabled]}
                onPress={handleConfirmBooking}
                disabled={!selectedSlot}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937'
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280'
  },
  newChatButton: {
    padding: 8
  },
  messagesList: {
    paddingVertical: 16
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 24,
    gap: 12
  },
  analyzingText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500'
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937'
  },
  recommendation: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 16
  },
  providersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12
  },
  providersList: {
    paddingVertical: 8
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#D1D5DB'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937'
  },
  modalProviderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4
  },
  modalProviderSpecialty: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20
  },
  slotsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12
  },
  slotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    gap: 12
  },
  slotOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB'
  },
  slotOptionText: {
    fontSize: 16,
    color: '#4B5563'
  },
  slotOptionTextSelected: {
    color: '#2563EB',
    fontWeight: '600'
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB'
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});