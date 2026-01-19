/**
 * Chat UI Component with Proper Component Names
 * Demonstrates Phase 1 architecture with real DOM elements
 */

import React, { useState } from 'react';
import { Components } from "@/architecture";

interface Message {
  id: string;
  text: string;
  timestamp: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div 
      data-testid={Components.Chat.bubble}
      className="chat-ui max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      {/* Chat Header */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">Chat Interface</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Using Component Names
        </p>
      </div>

      {/* Message List */}
      <div 
        data-testid={Components.Chat.messages}
        className="mb-4 h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Send one below!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3"
            >
              <div className="text-sm font-medium">{msg.text}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="flex space-x-2">
        <input
          data-testid={Components.Chat.input}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid={Components.Chat.sendButton}
          onClick={handleSend}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Send
        </button>
        <button
          data-testid={Components.Chat.clearButton}
          onClick={handleClear}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
        >
          Clear
        </button>
      </div>

      {/* Component Names Reference */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
        <div className="font-semibold mb-2">Component Names Used:</div>
        <ul className="space-y-1 font-mono">
          <li>Bubble: <code className="text-blue-600">{Components.Chat.bubble}</code></li>
          <li>Input: <code className="text-blue-600">{Components.Chat.input}</code></li>
          <li>Send Button: <code className="text-blue-600">{Components.Chat.sendButton}</code></li>
          <li>Clear Button: <code className="text-blue-600">{Components.Chat.clearButton}</code></li>
          <li>Messages: <code className="text-blue-600">{Components.Chat.messages}</code></li>
        </ul>
      </div>
    </div>
  );
}

