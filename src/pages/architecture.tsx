/**
 * Architecture Page Route - /architecture
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Header } from '../components/Header';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { ArchitecturePage } from '../components/pages/ArchitecturePage';
import { NavigationGraph } from "@supernal/interface/browser";
import { initializeDemoArchitecture } from '../architecture';
import { useSharedChat } from '../hooks/useSharedChat';
import { DemoAIInterface } from '../lib/AIInterface';
import { ToolManager } from '../lib/ToolManager';

export default function ArchitectureRoute() {
  const router = useRouter();
  const { messages, addMessage, clearMessages } = useSharedChat();
  const [aiInterface] = useState(() => new DemoAIInterface());
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  useEffect(() => {
    // Set up navigation handler
    NavigationGraph.getInstance().setNavigationHandler((page: string | any) => {
      const pageStr = typeof page === 'string' ? page : (page?.name || page?.path || String(page));
      const pageLower = pageStr.toLowerCase();
      const routeMap: Record<string, string> = {
        'home': '/',
        'demo': '/demo/simple',
        'architecture': '/architecture',
        'dashboard': '/dashboard',
        'docs': '/docs',
        'examples': '/examples',
        'blog': '/blog',
      };
      
      const targetRoute = routeMap[pageLower] || '/';
      router.push(targetRoute);
    });
    
    initializeDemoArchitecture();
    
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
      const result = await aiInterface.findAndExecuteCommand(text, 'Architecture');
      
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
        <title>Architecture - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ArchitecturePage />
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

