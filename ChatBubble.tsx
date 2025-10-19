import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16
  },
  userContainer: {
    alignItems: 'flex-end'
  },
  aiContainer: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4
  },
  text: {
    fontSize: 16,
    lineHeight: 22
  },
  userText: {
    color: '#FFFFFF'
  },
  aiText: {
    color: '#1F2937'
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4
  },
  userTimestamp: {
    color: '#DBEAFE'
  },
  aiTimestamp: {
    color: '#9CA3AF'
  }
});