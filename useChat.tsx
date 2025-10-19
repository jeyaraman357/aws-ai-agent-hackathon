import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { generateAIResponse } from '@/services/triageService';
import { AI_GREETING } from '@/constants/medical';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: AI_GREETING,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, text]);
    setIsTyping(true);
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const aiResponse = generateAIResponse(text, conversationContext);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  }, [conversationContext]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: AI_GREETING,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setConversationContext([]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    conversationContext
  };
};