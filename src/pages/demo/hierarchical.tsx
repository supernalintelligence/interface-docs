/**
 * Hierarchical Demo Route - /demo/hierarchical
 * 
 * Nested navigation with state-dependent tools
 */

import React from 'react';
import { DemoLayout } from '../../components/DemoLayout';

export default function HierarchicalDemoPage() {
  return (
    <DemoLayout
      title="Hierarchical Demo"
      activeTab="hierarchical"
      description={
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h3 className="font-semibold text-green-900 mb-2">🏗️ Hierarchical Pattern</h3>
          <p className="text-sm text-green-800">
            Demonstrates nested containers (Dashboard → Settings → Profile) and state-dependent tool availability.
            Tools appear and disappear based on current navigation context.
          </p>
        </div>
      }
    >
      {/* Placeholder */}
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-8xl mb-6">🚧</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Hierarchical demo with nested navigation and context-aware tools will be implemented here.
          This will showcase:
        </p>
        <ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
          <li>• Nested containers (Dashboard → Settings → Profile)</li>
          <li>• State-dependent tool visibility</li>
          <li>• Modal + tab combinations</li>
          <li>• Dynamic tool availability based on navigation context</li>
        </ul>
      </div>
    </DemoLayout>
  );
}

