/**
 * Shared Chat Hook
 * 
 * Provides persistent chat state across all pages using localStorage
 */

import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai' | 'system';
  timestamp: string;
}

const STORAGE_KEY = 'supernal-chat-messages';
const MAX_MESSAGES = 100; // Prevent localStorage from growing too large

function loadMessagesFromStorage(): Message[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Failed to load chat messages from localStorage
  }
  
  return getInitialMessages();
}

function saveMessagesToStorage(messages: Message[]) {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only last MAX_MESSAGES
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Failed to save chat messages to localStorage
  }
}

function getInitialMessages(): Message[] {
  return [
    {
      id: '1',
      text: '👋 Welcome to @supernal-interface Demo!',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      text: 'This is NOT real AI - it\'s a demo showing how AI would interact with @Tool decorated methods.',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      text: '🎮 Try these commands:\n• "open menu" or "close menu"\n• "toggle notifications"\n• "set priority high"',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '4',
      text: '🗺️  Navigate pages:\n• "architecture" or "dashboard"\n• "demo" or "home"\n• "docs" or "examples"',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '5',
      text: '💬 Your chat history persists across pages and refreshes!',
      type: 'system',
      timestamp: new Date().toISOString()
    },
    {
      id: '6',
      text: '💾 Advanced Demo: Uses StateManager with localStorage - your widget state persists too!',
      type: 'system',
      timestamp: new Date().toISOString()
    }
  ];
}

export function useSharedChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const loaded = loadMessagesFromStorage();
    setMessages(loaded);
    setIsInitialized(true);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages, isInitialized]);

  const addMessage = useCallback((text: string, type: Message['type']) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const clearMessages = useCallback(() => {
    const initial = getInitialMessages();
    setMessages(initial);
    saveMessagesToStorage(initial);
  }, []);

  return {
    messages,
    addMessage,
    clearMessages,
    isInitialized
  };
}

