/**
 * Chat Adapters Example
 * 
 * Demonstrates the swappable chat UI adapter system.
 * Shows how to use both CopilotKit and Native adapters.
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { 
  ChatUIProvider, 
  ChatUI,
  createCopilotKitAdapter,
  createNativeAdapter,
  bridgeToolRegistry,
  createAuditTrail,
  ChatUIAdapter,
} from "@supernal/interface-enterprise";
import type { ChatToolExecution } from "@supernal/interface-enterprise";

// Demo widgets with @Tool methods
import { SimpleWidget, SettingsWidget } from '../../widgets';

export default function ChatAdaptersExample() {
  const router = useRouter();
  const [adapterType, setAdapterType] = useState<'copilotkit' | 'native'>('native');
  const [executions, setExecutions] = useState<ChatToolExecution[]>([]);
  const [adapter, setAdapter] = useState<ChatUIAdapter | null>(null);
  
  // Create adapter when type changes
  useEffect(() => {
    const newAdapter = adapterType === 'copilotkit'
      ? createCopilotKitAdapter({ runtimeUrl: '/api/copilotkit' })
      : createNativeAdapter();
    
    // Initialize adapter
    newAdapter.initialize?.().then(() => {
      // Bridge tools
      bridgeToolRegistry(newAdapter, {
        filter: (tool) => tool.aiEnabled === true,
      });
      
      // Set up audit trail
      const _audit = createAuditTrail(newAdapter, {
        logToConsole: true,
        maxExecutions: 20,
      });
      
      // Subscribe to executions for display
      newAdapter.onToolExecution((execution) => {
        setExecutions(prev => [execution, ...prev.slice(0, 9)]);
      });
      
      setAdapter(newAdapter);
    });
    
    return () => {
      newAdapter.dispose?.();
    };
  }, [adapterType]);
  
  return (
    <>
      <Head>
        <title>Chat Adapters Example - Supernal Interface</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentPage="examples"
          onNavigate={(page) => router.push(`/${page}`)}
          onSettingsClick={() => {}}
        />
        
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chat UI Adapters
            </h1>
            <p className="text-gray-600">
              Swappable chat UI layer - same tools work with different providers
            </p>
          </div>
          
          {/* Adapter Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Adapter</h2>
            
            <div className="flex gap-4">
              <button
                onClick={() => setAdapterType('native')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  adapterType === 'native'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold mb-1">Native Adapter</div>
                <div className="text-sm text-gray-600">
                  Zero dependencies, pattern matching
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  No API key required
                </div>
              </button>
              
              <button
                onClick={() => setAdapterType('copilotkit')}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  adapterType === 'copilotkit'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold mb-1">CopilotKit Adapter</div>
                <div className="text-sm text-gray-600">
                  Full LLM integration, streaming
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Requires OPENAI_API_KEY
                </div>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
              <strong>Current:</strong> {adapterType === 'copilotkit' ? 'CopilotKit' : 'Native'} adapter
              {adapter?.isReady?.() && <span className="text-green-600 ml-2">✓ Ready</span>}
            </div>
          </div>
          
          {/* Demo Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Interactive Widgets</h2>
              <p className="text-sm text-gray-600 mb-4">
                These widgets have @Tool methods that the chat can control.
              </p>
              <div className="space-y-4">
                <SimpleWidget />
                <SettingsWidget />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Execution Log</h2>
              <p className="text-sm text-gray-600 mb-4">
                Tool executions are tracked for audit/compliance.
              </p>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {executions.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    No executions yet. Try a command in the chat.
                  </div>
                ) : (
                  executions.map((exec, i) => (
                    <div 
                      key={i}
                      className={`p-2 rounded text-sm ${
                        exec.success ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {exec.success ? '✅' : '❌'} {exec.toolName}
                        </span>
                        <span className="text-gray-400">
                          {exec.duration}ms
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {JSON.stringify(exec.args)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Code Example */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Usage</h2>
            
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Create adapter (swap between providers easily)
const adapter = adapterType === 'copilotkit'
  ? createCopilotKitAdapter({ runtimeUrl: '/api/copilotkit' })
  : createNativeAdapter();

// Bridge tools from ToolRegistry
bridgeToolRegistry(adapter, {
  filter: (tool) => tool.aiEnabled === true,
});

// Create audit trail for compliance
const audit = createAuditTrail(adapter, {
  logToConsole: true,
});

// Render with provider
<ChatUIProvider adapter={adapter}>
  <YourApp />
  <ChatUI position="bottom-right" />
</ChatUIProvider>`}
            </pre>
          </div>
        </main>
        
        {/* Chat UI */}
        {adapter && (
          <ChatUIProvider adapter={adapter}>
            <ChatUI 
              position="bottom-right"
              title={adapterType === 'copilotkit' ? 'CopilotKit Chat' : 'Native Chat'}
            />
          </ChatUIProvider>
        )}
      </div>
    </>
  );
}

