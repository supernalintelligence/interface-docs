/**
 * Stateful Demo Route - /demo/stateful
 *
 * Stateful pattern with @State decorator and localStorage persistence
 */
import React from 'react';
import { DemoLayout } from '../../components/DemoLayout';
import { DemoContainers } from '../../architecture';
import { useContainer } from '@supernal/interface/browser';

// Import widgets to register tools
import '../../lib/UIWidgetComponents';

export default function StatefulDemoPage() {
  // Set container context for tool filtering
  useContainer(DemoContainers.DemoStateful.id);

  return (
    <DemoLayout
      title="Stateful Demo - Persistent Widgets"
      description="Interactive widgets with @State decorator and localStorage persistence"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Stateful Widgets</h2>
          <p className="text-gray-600 mb-4">
            These widgets persist their state using localStorage. Try:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>"show settings" or "hide settings"</li>
            <li>"enable dark mode"</li>
            <li>"set counter to 10"</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            💾 State persists across page refreshes!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Widgets will be rendered here by the InteractiveWidgets component */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Settings Widget</h3>
            <div id="settings-widget">
              {/* Settings widget placeholder */}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Persistent Counter</h3>
            <div id="counter-widget">
              {/* Counter widget placeholder */}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
