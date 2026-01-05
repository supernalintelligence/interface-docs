'use client';

/**
 * SIMPLIFIED Interactive Widgets Example
 * 
 * This demonstrates usage of the new SimplifiedDemoTools class,
 * which uses the ultra-short @Tool decorator syntax.
 * 
 * Compare with InteractiveWidgets.tsx to see the difference.
 */

import React, { useState, useEffect } from 'react';
import { SimplifiedDemoTools } from '../lib/SimplifiedDemoTools';
import { StatefulDemoNames } from '../names/StatefulDemoNames';

export const SimplifiedInteractiveWidgets: React.FC = () => {
  const [count, setCount] = useState(0);
  const [toolsInitialized, setToolsInitialized] = useState(false);
  const [tools, setTools] = useState<SimplifiedDemoTools | null>(null);

  // Initialize tools on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const toolsInstance = new SimplifiedDemoTools();
    setTools(toolsInstance);
    setToolsInitialized(true);
  }, []);

  return (
    <div className="simplified-demo-container border-2 border-green-500 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-green-600">
          🚀 Simplified Decorator Syntax Demo
        </h2>
        {!toolsInitialized && (
          <span className="text-sm text-gray-500">Initializing tools...</span>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <p className="text-sm text-green-700 mb-2 font-semibold">
          ⚡ This component uses the NEW ultra-short @Tool syntax:
        </p>
        <code className="text-xs bg-green-100 px-2 py-1 rounded block mb-2">
          @Tool(elementId, &#123; examples: [...] &#125;)
        </code>
        <p className="text-xs text-green-600">
          Compare with the original InteractiveWidgets to see ~85% boilerplate reduction!
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-gray-700">{count}</div>
          <div className="text-sm text-gray-500 mt-1">Current Count</div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            data-testid={StatefulDemoNames.decrementButton}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={async () => {
              if (tools) {
                const result = await tools.decrementCount();
                if (result.success) setCount(result.count);
              }
            }}
          >
            - Decrement
          </button>

          <button
            data-testid={StatefulDemoNames.resetButton}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            onClick={async () => {
              if (tools) {
                const result = await tools.resetCount();
                if (result.success) setCount(result.count);
              }
            }}
          >
            ↻ Reset
          </button>

          <button
            data-testid={StatefulDemoNames.incrementButton}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            onClick={async () => {
              if (tools) {
                const result = await tools.incrementCount();
                if (result.success) setCount(result.count);
              }
            }}
          >
            + Increment
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
        <p className="font-semibold mb-1">🎯 What&apos;s Different:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Tools use <code className="bg-gray-200 px-1">@ToolProvider(containerId)</code> shorthand</li>
          <li>Each tool is just <code className="bg-gray-200 px-1">@Tool(elementId, &#123;examples&#125;)</code></li>
          <li>No manual toolId, name, description, category, containerId, aiEnabled, or dangerLevel</li>
          <li>Everything inferred from method names and @ToolProvider</li>
          <li>Still 100% type-safe and backward compatible!</li>
        </ul>
      </div>
    </div>
  );
};

