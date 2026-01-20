/**
 * Stateful Demo Route - /demo/stateful
 *
 * State persisted in localStorage using ComponentState helpers
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

export default function StatefulDemoPage() {
  useContainer(DemoContainers.DemoStateful.id);

  const [availableTools, setAvailableTools] = useState<ToolInfo[]>([]);

  // Get tools
  useEffect(() => {
    const tools = Array.from(ToolRegistry.getAllTools().values())
      .filter(t => t.aiEnabled && (t.containerId === '/demo/stateful' || !t.containerId || t.elementId?.startsWith(NAVIGATION_TOOL_PREFIX)))
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
      title="Stateful Demo"
      activeTab="stateful"
      description={
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h3 className="font-semibold text-green-900 mb-2">💾 Stateful Pattern</h3>
          <p className="text-sm text-green-800">
            Uses ComponentState helpers for persistence. State PERSISTS across page refreshes via localStorage.
            Perfect for user preferences and settings.
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
        subtitle="Click to see AI control widgets above (with persistence)"
        color="green"
      />
      {/* Chat is now global in _app.tsx */}
    </DemoLayout>
  );
}
