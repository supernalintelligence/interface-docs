/**
 * Home Page - Landing/Hero section with comprehensive value proposition
 */

import React from 'react';
import { useContainer } from "@supernal/interface/browser";

import { testId } from '@supernal/interface/testing';
import { pages as pagesNames } from '@/architecture/ComponentNames';
interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Register as Landing container (handles cleanup automatically)
  useContainer('Landing');
  
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl shadow-lg text-white p-8 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">@supernal-interface</h1>
          <p className="text-xl mb-6 opacity-90">
            Transform any React application into an AI-controllable system with simple @Tool decorators
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              data-testid="landing-nav-to-demo"
              onClick={() => onNavigate('demo')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Live Demo
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Read Documentation
            </button>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">The Challenge</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-600">
          <p>
            AI agents like ChatGPT or Claude can generate code, but controlling <strong>existing UI applications</strong> requires:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Manual integration</strong> - Writing custom APIs for every button, form, and interaction</li>
            <li><strong>Fragile selectors</strong> - Brittle CSS selectors that break with UI changes</li>
            <li><strong>No testability</strong> - AI interactions aren&apos;t validated before deployment</li>
            <li><strong>Unclear contracts</strong> - What can the AI actually do? What&apos;s safe? What requires approval?</li>
          </ul>
          <p className="pt-2">
            <strong>Similar to:</strong> In Python, LangChain requires manual tool definitions for every action. 
            In JavaScript/React, there&apos;s been no equivalent - until now.
          </p>
        </div>
      </div>

      {/* The Solution */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">The Supernal Interface Solution</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
          <p className="text-lg font-medium text-center">
            Decorate React components and methods with <code className="bg-white px-2 py-1 rounded">@Tool</code> 
            - they become AI-controllable, testable, and fully documented.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg border-2 border-green-200">
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold mb-2">Zero Boilerplate</h3>
              <p className="text-sm">One decorator per component. Automatic registration, discovery, and exposure to AI.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-bold mb-2">AI-Safe by Default</h3>
              <p className="text-sm">Test-only until you explicitly enable AI. Built-in danger levels and approval workflows.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
              <div className="text-2xl mb-2">🧪</div>
              <h3 className="font-bold mb-2">Testing Built-In</h3>
              <p className="text-sm">Playwright tests auto-generated from decorators. Validate before AI ever touches production.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features - Expanded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Simple Decorators</h3>
          <p className="text-gray-600 mb-3">
            Add <code className="bg-gray-100 px-1 rounded">@Tool</code>, <code className="bg-gray-100 px-1 rounded">@ClickTool</code>, 
            or <code className="bg-gray-100 px-1 rounded">@ChangeTool</code> to any React component or method. That&apos;s it.
          </p>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`@ClickTool({
  elementId: 'save-button',
  description: 'Save data',
  aiEnabled: true
})`}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Stable Component Names</h3>
          <p className="text-gray-600 mb-3">
            Centralized component registry prevents naming conflicts. Same names used for testing, AI control, and analytics.
          </p>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`// names/Components.ts
export const Components = {
  saveButton: 'save-button'
}`}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🤖</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Natural Language Control</h3>
          <p className="text-gray-600 mb-3">
            AI matches commands like &quot;save the file&quot; or &quot;change theme to dark&quot; to your decorated tools using examples and descriptions.
          </p>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`examples: [
  'save data',
  'save file',
  'store information'
]`}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold mb-3">Automatic Test Generation</h3>
          <p className="text-gray-600 mb-3">
            Generate Playwright tests, Jest tests, and Gherkin scenarios directly from @Tool decorators. Keep tests in sync with code.
          </p>
          <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`npm run test:generate
✓ Playwright tests
✓ Gherkin features
✓ Component tests`}
          </pre>
        </div>
      </div>

      {/* How It Works - Detailed */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold mb-2">Define Component Names</h3>
                <p className="text-gray-600 text-sm">
                  Create a centralized registry of component names. These are stable identifiers used everywhere.
                </p>
                <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs">
{`export const Components = {
  loginButton: 'login-button',
  emailInput: 'email-input'
};`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold mb-2">Decorate Components or Methods</h3>
                <p className="text-gray-600 text-sm">
                  Wrap components with HOC helpers or add @Tool to class methods. Specify behavior and safety level.
                </p>
                <pre className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs">
{`const LoginButton = ClickTool({
  elementId: Components.loginButton,
  description: 'Log in user',
  aiEnabled: true,
  dangerLevel: 'safe'
})(MyButton);`}
                </pre>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold mb-2">Automatic Registration</h3>
                <p className="text-gray-600 text-sm">
                  Tools register themselves in the global ToolRegistry. AI and test generators discover them automatically.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h3 className="font-semibold mb-2">Test & Control</h3>
                <p className="text-gray-600 text-sm">
                  Generate tests to validate functionality. Enable AI control when ready. Monitor usage with built-in analytics.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm">
            <div className="mb-2 text-gray-400">{`// Complete Example: AI-Controllable Button`}</div>
            <pre className="whitespace-pre-wrap">{`// 1. Define name
export const Components = {
  saveButton: 'save-button'
};

// 2. Create component with @Tool
export const SaveButton = ClickTool({
  elementId: Components.saveButton,
  description: 'Save user data',
  aiEnabled: true,
  dangerLevel: 'moderate',
  requiresApproval: false,
  examples: [
    'save data',
    'save file',
    'store information'
  ],
})(({ className, reportSuccess }) => {
  const handleClick = async () => {
    await saveUserData();
    reportSuccess?.('Data saved!');
  };
  
  return (
    <button 
      data-testid={Components.saveButton}
      onClick={handleClick}
      className={className}
    >
      Save
    </button>
  );
});

// 3. AI can now control this:
// "save the file" → Finds tool → Executes → Reports success`}</pre>
          </div>
        </div>
      </div>

      {/* Comparison with LangChain/Python Tools */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Why This Matters for React</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-red-600">❌ Traditional Approach (Like LangChain)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Manually define tool interfaces</li>
                <li>• Write separate validation logic</li>
                <li>• Create test harnesses from scratch</li>
                <li>• Maintain parallel documentation</li>
                <li>• No type safety between UI and tools</li>
                <li>• Tools and UI easily drift apart</li>
              </ul>
              <pre className="mt-4 bg-gray-900 text-red-400 p-3 rounded text-xs">
{`// Manual tool definition
function saveTool(args) {
  // Find element somehow?
  // Click it?
  // Hope it works?
}

// Separate test
test('save tool', ...)`}
              </pre>
            </div>
            
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-green-600">✅ Supernal Interface</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Single decorator defines everything</li>
                <li>• Validation built into decorator</li>
                <li>• Tests auto-generated from decorators</li>
                <li>• Component IS the documentation</li>
                <li>• Full TypeScript type safety</li>
                <li>• Tool and UI are the same thing</li>
              </ul>
              <pre className="mt-4 bg-gray-900 text-green-400 p-3 rounded text-xs">
{`// One decorator, everything works
const SaveButton = ClickTool({
  ...config
})(MyButton);

// Auto-generated tests
npm run test:generate`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Perfect For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🖥️</span>
            </div>
            <h3 className="font-semibold mb-2">UI Automation</h3>
            <p className="text-gray-600 text-sm">Let AI control buttons, forms, and interface elements in React apps</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="font-semibold mb-2">Admin Dashboards</h3>
            <p className="text-gray-600 text-sm">Build AI-powered admin interfaces with natural language control</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold mb-2">Testing Automation</h3>
            <p className="text-gray-600 text-sm">Generate comprehensive test suites automatically from your decorated components</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold mb-2">AI Agents</h3>
            <p className="text-gray-600 text-sm">Build autonomous agents that can safely interact with your React UI</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg text-white p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Make Your App AI-Controllable?</h2>
        <p className="text-lg mb-6 opacity-90">
          Start with the live demo to see how it works, then explore the documentation to integrate into your project.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('demo')}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Try Live Demo
          </button>
          <button
            onClick={() => onNavigate('docs')}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            Read Documentation
          </button>
          <button
            onClick={() => onNavigate('examples')}
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            View Examples
          </button>
        </div>
      </div>
    </>
  );
};
