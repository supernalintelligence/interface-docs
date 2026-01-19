/**
 * Simple Demo Route - /demo/simple
 *
 * Stateless pattern with HOC and callbacks
 */
import React from 'react';
import { DemoLayout } from '../../components/DemoLayout';
import { DemoContainers } from '../../architecture';
import { useContainer } from '@supernal/interface/browser';

// Import widgets to register tools
import '../../lib/UIWidgetComponents';

export default function SimpleDemoPage() {
  // Set container context for tool filtering
  useContainer(DemoContainers.DemoSimple.id);

  return (
    <DemoLayout
      title="Simple Demo - Stateless Widgets"
      description="Interactive widgets with stateless pattern using HOC and callbacks"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Interactive Widgets</h2>
          <p className="text-gray-600 mb-4">
            Try controlling these widgets using the chat interface. Examples:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>"toggle menu" or "open notifications"</li>
            <li>"set priority to high"</li>
            <li>"increment counter"</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Widgets will be rendered here by the InteractiveWidgets component */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Menu Widget</h3>
            <div id="menu-widget">
              {/* Menu widget placeholder */}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Counter Widget</h3>
            <div id="counter-widget">
              {/* Counter widget placeholder */}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
