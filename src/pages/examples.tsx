/**
 * Examples Page Route - /examples
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/chat/ChatBubble';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { ExamplesPage } from '../components/pages/ExamplesPage';
import { NavigationGraph, useContainer } from "@supernal/interface/browser";
import { registerExampleTools } from '../tools/ExampleTools';
import { useSharedChat } from '../hooks/useSharedChat';
import { DemoAIInterface } from '../lib/AIInterface';
import { ToolManager } from '../lib/ToolManager';

export default function ExamplesRoute() {
  const router = useRouter();
  const { messages, addMessage, clearMessages } = useSharedChat();
  const [aiInterface] = useState(() => new DemoAIInterface());
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  
  // CRITICAL: Set container context for tool filtering
  useContainer('Examples');

  useEffect(() => {
    // Set up navigation handler
    
    
    // Register example-specific tools
    registerExampleTools();
    
    // Subscribe to tool execution results
    const unsubscribe = ToolManager.subscribe((result) => {
      const emoji = result.success ? '✅' : '❌';
      addMessage(`${emoji} ${result.message}`, 'ai');
    });
    
    return unsubscribe;
  }, [router, addMessage]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    addMessage(text, 'user');
    
    try {
      const command = aiInterface.findToolsForCommand(text);
      await aiInterface.executeCommand(command, true);
    } catch (error) {
      addMessage(`Error: ${error instanceof Error ? error.message : String(error)}`, 'ai');
    }
  };

  return (
    <>
      <Head>
        <title>Examples - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ExamplesPage />
        </div>
        
        {/* Chat is now global in _app.tsx */}
        
        <EarlyAccessModal 
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>
    </>
  );
}
