/**
 * Dashboard Page Route - /dashboard
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Header } from '../components/Header';
import { ChatBubble } from '../components/chat/ChatBubble';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { DashboardPage } from '../components/pages/DashboardPage';
import { useNavigationHandler } from "@supernal/interface/react";
import { initializeDemoArchitecture } from '../architecture';
import { useSharedChat } from '../hooks/useSharedChat';
import { DemoAIInterface } from '../lib/AIInterface';
import { ToolManager } from '../lib/ToolManager';

export default function DashboardRoute() {
  const router = useRouter();
  const { messages, addMessage, clearMessages } = useSharedChat();
  const [aiInterface] = useState(() => new DemoAIInterface());
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  // Set up automatic navigation (ONE LINE!)
  useNavigationHandler(router);

  useEffect(() => {
    initializeDemoArchitecture();
    
    // Subscribe to tool execution results
    const unsubscribe = ToolManager.subscribe((result) => {
      const emoji = result.success ? '✅' : '❌';
      addMessage(`${emoji} ${result.message}`, 'ai');
    });
    
    return unsubscribe;
  }, [addMessage]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    addMessage(text, 'user');
    
    try {
      const result = await aiInterface.findAndExecuteCommand(text, 'Dashboard');
      
      if (!result.success) {
        addMessage(result.message, 'system');
      }
    } catch (error) {
      addMessage(`Error: ${error instanceof Error ? error.message : String(error)}`, 'ai');
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <DashboardPage />
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

