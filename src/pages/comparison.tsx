/**
 * Decorator Syntax Comparison Page
 * 
 * This page demonstrates both the old (verbose) and new (simplified) @Tool decorator syntax.
 * Shows the 80-85% boilerplate reduction achieved in the simplification effort.
 */

import React from 'react';
import { InteractiveWidgets } from '../components/InteractiveWidgets';
import { SimplifiedInteractiveWidgets } from '../components/SimplifiedInteractiveWidgets';
import { DemoLayout } from '../components/DemoLayout';

function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            @Tool Decorator Syntax Comparison
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare the original verbose syntax with the new simplified syntax.
            Both produce identical functionality - the new syntax just removes ~85% of the boilerplate!
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Original Syntax */}
          <div className="space-y-4">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-blue-700 mb-2">
                📋 Original Syntax
              </h2>
              <p className="text-sm text-blue-600 mb-4">
                The traditional approach requiring explicit configuration of every field
              </p>
              
              <div className="bg-white rounded p-4 mb-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Example Code:</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
{`@ToolProvider({
  containerId: 'DemoStateful',
  category: 'user_interaction'
})
class DemoWidgetProvider {
  @Tool({
    elementId: StatefulDemoNames.incrementButton,
    containerId: DemoContainers.StatefulDemo,
    toolId: 'stateful-demo.increment',
    name: 'Increment Count',
    description: 'Increment the counter by 1',
    category: 'user_interaction',
    aiEnabled: true,
    dangerLevel: 'safe',
    examples: [
      'increment the counter',
      'add one to the count'
    ],
    callbacks: { storage: true }
  })
  async incrementCount(options?: ToolOptions) {
    // implementation
  }
}`}
                </pre>
              </div>

              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-700 font-semibold mb-1">❌ Issues:</p>
                <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                  <li>~15 lines of config per tool</li>
                  <li>Duplicate information (elementId, toolId, containerId)</li>
                  <li>Manual category/name/description duplicates method name</li>
                  <li>Easy to forget fields or make mistakes</li>
                  <li>Not DRY (Don&apos;t Repeat Yourself)</li>
                </ul>
              </div>
            </div>

            <InteractiveWidgets />
          </div>

          {/* Right: Simplified Syntax */}
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                ⚡ Simplified Syntax
              </h2>
              <p className="text-sm text-green-600 mb-4">
                The new approach with smart inference and inheritance
              </p>
              
              <div className="bg-white rounded p-4 mb-4">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Example Code:</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
{`@ToolProvider(DemoContainers.StatefulDemo)
class SimplifiedDemoTools {
  @Tool(StatefulDemoNames.incrementButton, {
    examples: [
      'increment the counter',
      'add one to the count'
    ]
  })
  async incrementCount(options?: ToolOptions) {
    // implementation
  }
}`}
                </pre>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-3">
                <p className="text-sm text-green-700 font-semibold mb-1">✅ Improvements:</p>
                <ul className="text-xs text-green-600 space-y-1 list-disc list-inside">
                  <li>~3 lines of config per tool (85% reduction!)</li>
                  <li>No duplicate IDs - elementId is the single source of truth</li>
                  <li>Auto-inferred: name, category, containerId, aiEnabled, dangerLevel</li>
                  <li>Inheritance from @ToolProvider (containerId)</li>
                  <li>Type-safe with full IDE autocomplete</li>
                  <li>100% backward compatible with old syntax</li>
                </ul>
              </div>
            </div>

            <SimplifiedInteractiveWidgets />
          </div>
        </div>

        {/* Bottom: Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-gray-300 rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 Key Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-gray-700">
                <strong>Boilerplate Reduction</strong>
                <p className="text-xs text-gray-600 mt-1">
                  From ~15 config lines to ~3 per tool
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-sm text-gray-700">
                <strong>Backward Compatible</strong>
                <p className="text-xs text-gray-600 mt-1">
                  Old syntax still works - migrate at your own pace
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm text-gray-700">
                <strong>Breaking Changes</strong>
                <p className="text-xs text-gray-600 mt-1">
                  All existing code continues to work unchanged
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>🔍 How It Works:</strong>
            </p>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li><strong>Method Name Inference:</strong> `incrementCount` → name: &quot;Increment Count&quot;, category: &quot;user_interaction&quot;</li>
              <li><strong>Danger Detection:</strong> Methods with &quot;delete&quot;, &quot;remove&quot;, &quot;destroy&quot; → higher danger levels</li>
              <li><strong>AI Enablement:</strong> Safe methods auto-enabled for AI, dangerous ones require explicit opt-in</li>
              <li><strong>Container Inheritance:</strong> @ToolProvider containerId flows down to all @Tool decorators</li>
              <li><strong>Name Contracts:</strong> elementId constants ensure type safety and refactorability</li>
            </ul>
          </div>
        </div>

        {/* Migration Guide */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-3">
            📝 Migration Guide
          </h2>
          <div className="space-y-3 text-sm text-yellow-900">
            <div>
              <strong>Step 1:</strong> Update @ToolProvider to use shorthand
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
{`- @ToolProvider({ containerId: 'MyContainer', category: 'user_interaction' })
+ @ToolProvider('MyContainer')`}
              </pre>
            </div>
            <div>
              <strong>Step 2:</strong> Simplify each @Tool decorator
              <pre className="text-xs bg-white p-2 rounded mt-1 overflow-x-auto">
{`- @Tool({ elementId: 'my-button', containerId: 'MyContainer', name: '...', ... })
+ @Tool('my-button', { examples: ['click button'] })`}
              </pre>
            </div>
            <div>
              <strong>Step 3:</strong> Test & verify
              <p className="text-xs text-yellow-700 mt-1">
                All existing tests should pass without modification!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonPageWithLayout() {
  return (
    <DemoLayout title="@Tool Decorator Comparison" activeTab="simple">
      <ComparisonPage />
    </DemoLayout>
  );
}

