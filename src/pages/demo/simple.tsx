/**
 * Simple Demo Route - /demo/simple
 * 
 * Stateless pattern with HOC and callbacks
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DemoLayout } from '../../components/DemoLayout';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { ToolList } from '../../components/ToolList';
import { InteractiveWidgets } from '../../components/InteractiveWidgets';
import { DemoAIInterface } from '../../lib/AIInterface';
import { ToolManager } from '../../lib/ToolManager';
import { ToolRegistry, NavigationGraph, useContainer } from "@supernal/interface/browser";
import { DemoContainers } from '../../architecture';

// ToolInfo type expected by ToolList component
interface ToolInfo {
  name: string;
  elementId?: string;
  testId?: string;
  dangerLevel?: string;
  description?: string;
  examples?: string[];
}
import { useSharedChat } from '../../hooks/useSharedChat';
import { NAVIGATION_TOOL_PREFIX } from '../../lib/constants';

// Import widgets to register tools (architecture auto-initializes when imported above)
import '../../lib/UIWidgetComponents';

export default function SimpleDemoPage() {
  useContainer(DemoContainers.DemoSimple.id);
  
  const router = useRouter();
  const { messages, addMessage, clearMessages } = useSharedChat();
  const [aiInterface] = useState(() => new DemoAIInterface());
  const [availableTools, setAvailableTools] = useState<ToolInfo[]>([]);

  // Initialize
  useEffect(() => {
    // Set up navigation handler
    NavigationGraph.getInstance().setNavigationHandler((page: string | any) => {
      
      // Map page names to Next.js routes
      // Normalize to lowercase for case-insensitive matching
      const pageLower = page.toLowerCase();
      
      const routeMap: Record<string, string> = {
        'home': '/',
        'landing': '/',
        'demo': '/demo',  // Parent Demo container
        'simple': '/demo/simple',
        'stateful': '/demo/stateful',
        'hierarchical': '/demo/hierarchical',
        'architecture': '/architecture',
        'dashboard': '/dashboard',
        'docs': '/docs',
        'documentation': '/docs',
        'examples': '/examples',
        'blog': '/blog',
        'api': '/api-docs',
      };
      
      const targetRoute = routeMap[pageLower] || '/';
      router.push(targetRoute);
    });
  }, [router]);

  // Get tools
  useEffect(() => {
    const tools = Array.from(ToolRegistry.getAllTools().values())
      .filter(t => t.aiEnabled && (t.containerId === 'DemoSimple' || !t.containerId || t.elementId?.startsWith(NAVIGATION_TOOL_PREFIX)))
      .sort((a, b) => {
        const order: Record<string, number> = {
          'Open Menu': 1,
          'Close Menu': 2,
          'Toggle Feature': 3,
          'Toggle Notifications': 4,
        };
        return (order[a.name] || 999) - (order[b.name] || 999);
      });
    setAvailableTools(tools);
    
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
      const result = await aiInterface.findAndExecuteCommand(text, 'DemoSimple');
      
      if (!result.success) {
        addMessage(result.message, 'system');
      }
      // Success message already added by ToolManager subscription
    } catch (error) {
      addMessage(`Error: ${error instanceof Error ? error.message : String(error)}`, 'ai');
    }
  };

  const handleExecuteTool = async (tool: ToolInfo) => {
    try {
      const query = tool.examples?.[0] || tool.name;
      const command = await aiInterface.findToolsForCommand(query);
      await aiInterface.executeCommand(command, true);
      // Success message will be added via ToolManager.subscribe()
    } catch (error) {
      addMessage(`❌ Failed to execute "${tool.name}": ${error instanceof Error ? error.message : String(error)}`, 'system');
    }
  };

  const handleWidgetInteraction = (widgetType: string, action: string, result: { name: string }) => {
    addMessage(`🎮 Widget "${widgetType}" ${action}: ${result.name}`, 'system');
  };

  return (
    <DemoLayout
      title="Simple Demo"
      activeTab="simple"
      description={
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Simple Pattern</h3>
          <p className="text-sm text-blue-800">
            Uses Higher-Order Components (HOCs) with callbacks. State is managed in memory and does NOT persist across page refreshes.
            Perfect for temporary interactions.
          </p>
        </div>
      }
    >
      {/* Widgets */}
      <InteractiveWidgets onWidgetInteraction={handleWidgetInteraction} />

      {/* AI Tools */}
      <ToolList
        tools={availableTools}
        title="🤖 AI TOOLS"
        subtitle="Click to see AI control widgets above (no persistence)"
        onExecuteTool={handleExecuteTool}
        color="blue"
      />
      {/* Chat is now global in _app.tsx */}
    </DemoLayout>
  );
}

