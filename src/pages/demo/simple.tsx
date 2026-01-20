/**
 * Simple Demo Route - /demo/simple
 *
 * Stateless pattern with HOC and callbacks
 */
import React, { useState, useEffect } from 'react';
import { DemoLayout } from '../../components/DemoLayout';
import { ToolList } from '../../components/ToolList';
import { InteractiveWidgets } from '../../components/InteractiveWidgets';
import { ToolRegistry, useContainer } from '@supernal/interface/browser';
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
import { NAVIGATION_TOOL_PREFIX } from '../../lib/constants';

// Import widgets to register tools
import '../../lib/UIWidgetComponents';

export default function SimpleDemoPage() {
  useContainer(DemoContainers.DemoSimple.id);

  const [availableTools, setAvailableTools] = useState<ToolInfo[]>([]);

  // Get tools
  useEffect(() => {
    const tools = Array.from(ToolRegistry.getAllTools().values())
      .filter(t => t.aiEnabled && (t.containerId === '/demo/simple' || !t.containerId || t.elementId?.startsWith(NAVIGATION_TOOL_PREFIX)))
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
  }, []);

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
      <InteractiveWidgets />

      {/* AI Tools */}
      <ToolList
        tools={availableTools}
        title="🤖 AI TOOLS"
        subtitle="Click to see AI control widgets above (no persistence)"
        color="blue"
      />
      {/* Chat is now global in _app.tsx */}
    </DemoLayout>
  );
}
